import logging
import re
import threading
from dataclasses import dataclass

from rank_bm25 import BM25Okapi

from app.config import settings
from app.core.embeddings import embed_text, embed_batch
from app.core.vectorstore import get_or_create_collection, list_collections
from app.core.llm import generate

logger = logging.getLogger(__name__)

_cross_encoder = None
_cross_encoder_lock = threading.Lock()


def _get_cross_encoder():
    """Lazy-load cross-encoder model (singleton)."""
    global _cross_encoder
    if _cross_encoder is None:
        with _cross_encoder_lock:
            if _cross_encoder is None:
                try:
                    from sentence_transformers import CrossEncoder
                    _cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
                    logger.info("Loaded cross-encoder model: ms-marco-MiniLM-L-6-v2")
                except Exception as e:
                    logger.warning(f"Failed to load cross-encoder: {e}")
    return _cross_encoder


@dataclass
class RetrievedChunk:
    content: str
    metadata: dict
    relevance_score: float
    source_file: str


MULTI_QUERY_PROMPT = """You are an AI assistant helping to retrieve relevant documents.
Given the user's question, generate 3 alternative versions of the question that capture
different aspects or phrasings. This helps find more relevant documents.

Reply with ONLY the 3 alternative questions, one per line. No numbering, no extra text.

Original question: {question}"""


def _tokenize(text: str) -> list[str]:
    """Simple tokenization for BM25."""
    return re.findall(r'\w+', text.lower())


def retrieve(
    query: str,
    collection_name: str | None = None,
    collection_names: list[str] | None = None,
    top_k: int | None = None,
    use_multi_query: bool = True,
    use_hybrid: bool = True,
) -> list[RetrievedChunk]:
    """
    Hybrid retrieval: combines semantic search (ChromaDB) with keyword search (BM25).

    Uses Reciprocal Rank Fusion (RRF) to merge rankings from both methods.
    """
    top_k = top_k or settings.top_k
    fetch_k = settings.max_context_chunks

    # Build list of queries (original + alternatives)
    queries = [query]
    if use_multi_query:
        try:
            alt_queries = _generate_alternative_queries(query)
            queries.extend(alt_queries)
            logger.info(f"Multi-query: searching with {len(queries)} queries")
        except Exception as e:
            logger.warning(f"Multi-query generation failed, using original only: {e}")

    # --- Semantic search ---
    query_embeddings = embed_batch(queries)

    semantic_results: list[RetrievedChunk] = []
    for query_embedding in query_embeddings:
        if collection_names:
            results = _search_multiple_collections(collection_names, query_embedding, fetch_k)
        elif collection_name:
            results = _search_collection(collection_name, query_embedding, fetch_k)
        else:
            results = _search_all_collections(query_embedding, fetch_k)
        semantic_results.extend(results)

    # Deduplicate semantic results
    semantic_deduped = _deduplicate_chunks(semantic_results)
    semantic_deduped.sort(key=lambda x: x.relevance_score)

    # --- BM25 keyword search (if enabled and there are semantic results to compare against) ---
    if use_hybrid and semantic_deduped:
        bm25_results = _bm25_search(query, collection_name, collection_names, fetch_k)

        if bm25_results:
            # Reciprocal Rank Fusion
            fused = _reciprocal_rank_fusion(semantic_deduped, bm25_results, k=60)
            logger.info(
                f"Hybrid search: {len(semantic_deduped)} semantic + {len(bm25_results)} BM25 "
                f"= {len(fused)} fused results"
            )
        else:
            fused = semantic_deduped
    else:
        fused = semantic_deduped

    # Dynamic threshold on semantic score
    threshold = settings.similarity_threshold
    relevant = [c for c in fused if c.relevance_score <= threshold]

    if not relevant and fused:
        relevant = fused[:3]

    # Cross-encoder re-ranking for better precision
    if len(relevant) > 1:
        relevant = _cross_encoder_rerank(query, relevant)

    result = relevant[:top_k]

    # Expand top results with surrounding chunks for richer context
    result = _expand_with_neighbors(result, collection_name, collection_names)

    logger.info(f"Retrieved {len(result)} chunks (threshold={threshold})")
    return result


def _cross_encoder_rerank(
    query: str,
    chunks: list[RetrievedChunk],
    max_candidates: int = 30,
) -> list[RetrievedChunk]:
    """Re-rank chunks using a cross-encoder for better precision.

    Cross-encoders score (query, passage) pairs jointly, which is much
    more accurate than bi-encoder similarity alone.  We re-rank the top
    candidates and return them sorted by cross-encoder score.
    """
    reranker = _get_cross_encoder()
    if reranker is None:
        return chunks  # fallback: keep original order

    candidates = chunks[:max_candidates]
    rest = chunks[max_candidates:]

    try:
        pairs = [(query, c.content[:512]) for c in candidates]
        scores = reranker.predict(pairs)

        for chunk, score in zip(candidates, scores):
            # Normalize cross-encoder logit to 0-1 range (lower = better to match cosine distance convention)
            chunk.relevance_score = max(0.0, 1.0 - (float(score) + 10) / 20.0)

        candidates.sort(key=lambda c: c.relevance_score)
        logger.info(f"Cross-encoder re-ranked {len(candidates)} chunks")
        return candidates + rest
    except Exception as e:
        logger.warning(f"Cross-encoder re-ranking failed: {e}")
        return chunks


def _bm25_search(
    query: str,
    collection_name: str | None,
    collection_names: list[str] | None,
    top_k: int,
) -> list[RetrievedChunk]:
    """Keyword search using BM25 over collection documents."""
    BM25_MAX_DOCS = 10_000  # Cap to prevent OOM on large collections

    try:
        # Gather all documents from target collections
        target_collections = []
        if collection_names:
            target_collections = collection_names
        elif collection_name:
            target_collections = [collection_name]
        else:
            collections = list_collections()
            target_collections = [c.name if hasattr(c, "name") else str(c) for c in collections]

        all_docs = []
        all_metadatas = []
        all_collection_names = []

        for col_name in target_collections:
            if len(all_docs) >= BM25_MAX_DOCS:
                logger.warning(f"BM25: hit {BM25_MAX_DOCS} doc cap, skipping remaining collections")
                break
            try:
                col = get_or_create_collection(col_name)
                count = col.count()
                if count == 0:
                    continue
                # Get documents from collection (capped to prevent OOM)
                fetch_limit = min(count, BM25_MAX_DOCS - len(all_docs))
                result = col.get(include=["documents", "metadatas"], limit=fetch_limit)
                if result["documents"]:
                    all_docs.extend(result["documents"])
                    all_metadatas.extend(result["metadatas"] or [{}] * len(result["documents"]))
                    all_collection_names.extend([col_name] * len(result["documents"]))
            except Exception as e:
                logger.warning(f"BM25: failed to read collection '{col_name}': {e}")

        if not all_docs:
            return []

        # Build BM25 index
        tokenized_docs = [_tokenize(doc) for doc in all_docs]
        bm25 = BM25Okapi(tokenized_docs)

        # Score
        tokenized_query = _tokenize(query)
        scores = bm25.get_scores(tokenized_query)

        # Get top results
        scored = list(enumerate(scores))
        scored.sort(key=lambda x: x[1], reverse=True)

        results = []
        for idx, score in scored[:top_k]:
            if score <= 0:
                continue
            metadata = all_metadatas[idx] if idx < len(all_metadatas) else {}
            results.append(RetrievedChunk(
                content=all_docs[idx],
                metadata=metadata,
                # Normalize BM25 score to a 0-1 range (lower = better, to match cosine distance)
                relevance_score=max(0.0, 1.0 - min(score / 20.0, 1.0)),
                source_file=metadata.get("source_file", "unknown"),
            ))

        return results
    except Exception as e:
        logger.warning(f"BM25 search failed: {e}")
        return []


def _reciprocal_rank_fusion(
    semantic: list[RetrievedChunk],
    keyword: list[RetrievedChunk],
    k: int = 60,
) -> list[RetrievedChunk]:
    """
    Reciprocal Rank Fusion (RRF) to merge semantic and keyword rankings.

    RRF score = sum(1 / (k + rank_i)) for each ranking system.
    Higher RRF score = more relevant.
    """
    # Build a lookup by content key
    chunk_map: dict[str, RetrievedChunk] = {}
    rrf_scores: dict[str, float] = {}

    # Score from semantic ranking
    for rank, chunk in enumerate(semantic):
        key = chunk.content[:200]
        rrf_scores[key] = rrf_scores.get(key, 0) + 1.0 / (k + rank + 1)
        if key not in chunk_map or chunk.relevance_score < chunk_map[key].relevance_score:
            chunk_map[key] = chunk

    # Score from keyword ranking
    for rank, chunk in enumerate(keyword):
        key = chunk.content[:200]
        rrf_scores[key] = rrf_scores.get(key, 0) + 1.0 / (k + rank + 1)
        if key not in chunk_map:
            chunk_map[key] = chunk

    # Sort by RRF score (descending = best first)
    sorted_keys = sorted(rrf_scores.keys(), key=lambda k: rrf_scores[k], reverse=True)

    # Build result with updated relevance scores
    results = []
    for i, key in enumerate(sorted_keys):
        chunk = chunk_map[key]
        # Use RRF rank position as the relevance score (lower = better)
        # Map to 0-1 range based on position
        chunk.relevance_score = min(chunk.relevance_score, i / max(len(sorted_keys), 1))
        results.append(chunk)

    return results


def _generate_alternative_queries(question: str) -> list[str]:
    """Generate alternative phrasings of the question for better retrieval."""
    response = generate(
        prompt=MULTI_QUERY_PROMPT.format(question=question),
        temperature=0.4,
    )
    alternatives = [line.strip() for line in response.strip().split("\n") if line.strip()]
    return alternatives[:3]


def _search_multiple_collections(
    collection_names: list[str],
    query_embedding: list[float],
    top_k: int,
) -> list[RetrievedChunk]:
    """Search across a specific set of collections (for Agent mode)."""
    all_results: list[RetrievedChunk] = []
    for name in collection_names:
        results = _search_collection(name, query_embedding, top_k)
        all_results.extend(results)
    return all_results


def _search_all_collections(
    query_embedding: list[float],
    top_k: int,
) -> list[RetrievedChunk]:
    """Search across all collections."""
    all_results: list[RetrievedChunk] = []
    collections = list_collections()
    for col in collections:
        name = col.name if hasattr(col, "name") else str(col)
        results = _search_collection(name, query_embedding, top_k)
        all_results.extend(results)
    return all_results


def _search_collection(
    collection_name: str,
    query_embedding: list[float],
    top_k: int,
) -> list[RetrievedChunk]:
    """Search a single collection."""
    try:
        collection = get_or_create_collection(collection_name)

        if collection.count() == 0:
            return []

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, collection.count()),
            include=["documents", "metadatas", "distances"],
        )

        chunks: list[RetrievedChunk] = []
        if results["documents"] and results["documents"][0]:
            for i, doc in enumerate(results["documents"][0]):
                metadata = results["metadatas"][0][i] if results["metadatas"] else {}
                distance = results["distances"][0][i] if results["distances"] else 1.0

                chunks.append(RetrievedChunk(
                    content=doc,
                    metadata=metadata,
                    relevance_score=distance,
                    source_file=metadata.get("source_file", "unknown"),
                ))

        return chunks
    except Exception as e:
        logger.error(f"Search failed in collection '{collection_name}': {e}")
        return []


def _deduplicate_chunks(chunks: list[RetrievedChunk]) -> list[RetrievedChunk]:
    """
    Remove duplicate chunks, keeping the one with the best relevance score.
    Deduplicates based on content similarity (exact match on first 200 chars).
    """
    seen: dict[str, RetrievedChunk] = {}
    for chunk in chunks:
        key = chunk.content[:200]
        if key not in seen or chunk.relevance_score < seen[key].relevance_score:
            seen[key] = chunk
    return list(seen.values())


def _expand_with_neighbors(
    chunks: list[RetrievedChunk],
    collection_name: str | None,
    collection_names: list[str] | None,
    window: int = 1,
) -> list[RetrievedChunk]:
    """Expand top-ranked chunks with their neighboring chunks from the same document.

    When a chunk matches, the surrounding chunks often contain important
    context.  This fetches chunk_index ± window from the same document
    and merges them into a single expanded chunk, giving the LLM a
    wider view of the passage.
    """
    if not chunks:
        return chunks

    # Only expand the top 5 most relevant chunks to avoid bloating context
    MAX_EXPAND = 5
    to_expand = chunks[:MAX_EXPAND]
    rest = chunks[MAX_EXPAND:]

    # Group chunks by (collection_name_hint, document_id)
    expand_requests: list[tuple[RetrievedChunk, str, int]] = []
    for chunk in to_expand:
        doc_id = chunk.metadata.get("document_id", "")
        chunk_idx = chunk.metadata.get("chunk_index")
        if doc_id and chunk_idx is not None:
            expand_requests.append((chunk, doc_id, int(chunk_idx)))

    if not expand_requests:
        return chunks

    # Determine which collections to search
    target_collections = []
    if collection_names:
        target_collections = collection_names
    elif collection_name:
        target_collections = [collection_name]
    else:
        cols = list_collections()
        target_collections = [c.name if hasattr(c, "name") else str(c) for c in cols]

    # Build a cache of neighbor chunks per collection
    neighbor_cache: dict[str, dict] = {}  # col_name -> {doc_id -> {chunk_idx -> content}}

    needed_lookups: dict[str, set[tuple[str, int]]] = {}  # col -> set of (doc_id, idx)
    for chunk, doc_id, chunk_idx in expand_requests:
        for col in target_collections:
            if col not in needed_lookups:
                needed_lookups[col] = set()
            for offset in range(-window, window + 1):
                if offset != 0:
                    needed_lookups[col].add((doc_id, chunk_idx + offset))

    for col_name, lookups in needed_lookups.items():
        if not lookups:
            continue
        try:
            collection = get_or_create_collection(col_name)
            # Group by document_id
            doc_ids_needed = {doc_id for doc_id, _ in lookups}
            for doc_id in doc_ids_needed:
                indices_needed = {idx for d, idx in lookups if d == doc_id}
                result = collection.get(
                    where={"document_id": doc_id},
                    include=["documents", "metadatas"],
                )
                if not result["ids"]:
                    continue
                if col_name not in neighbor_cache:
                    neighbor_cache[col_name] = {}
                if doc_id not in neighbor_cache[col_name]:
                    neighbor_cache[col_name][doc_id] = {}
                for i, meta in enumerate(result["metadatas"] or []):
                    ci = meta.get("chunk_index")
                    if ci is not None and int(ci) in indices_needed:
                        neighbor_cache[col_name][doc_id][int(ci)] = result["documents"][i]
        except Exception as e:
            logger.debug(f"Neighbor lookup failed for '{col_name}': {e}")

    # Merge neighbors into expanded chunks
    expanded = []
    seen_content = set()
    for chunk, doc_id, chunk_idx in expand_requests:
        parts = []
        for col in target_collections:
            cache = neighbor_cache.get(col, {}).get(doc_id, {})
            # Previous chunk
            for offset in range(-window, 0):
                prev = cache.get(chunk_idx + offset)
                if prev and prev[:100] not in seen_content:
                    parts.append(prev)

        parts.append(chunk.content)

        for col in target_collections:
            cache = neighbor_cache.get(col, {}).get(doc_id, {})
            for offset in range(1, window + 1):
                nxt = cache.get(chunk_idx + offset)
                if nxt and nxt[:100] not in seen_content:
                    parts.append(nxt)

        merged_content = "\n\n".join(parts)
        seen_content.add(merged_content[:100])

        expanded.append(RetrievedChunk(
            content=merged_content,
            metadata=chunk.metadata,
            relevance_score=chunk.relevance_score,
            source_file=chunk.source_file,
        ))

    # Add non-expanded chunks, skipping duplicates
    for chunk in rest:
        if chunk.content[:100] not in seen_content:
            expanded.append(chunk)
            seen_content.add(chunk.content[:100])

    return expanded
