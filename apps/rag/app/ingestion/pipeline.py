import hashlib
import logging
import uuid
from pathlib import Path

from app.core.embeddings import embed_batch
from app.core.vectorstore import get_or_create_collection
from app.ingestion.chunking.strategies import get_chunker, Chunk
from app.ingestion.processors.registry import registry

logger = logging.getLogger(__name__)


def compute_file_hash(file_path: Path) -> str:
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for block in iter(lambda: f.read(8192), b""):
            sha256.update(block)
    return sha256.hexdigest()


def ingest_file(
    file_path: Path,
    collection_name: str = "default",
    extra_metadata: dict | None = None,
) -> dict:
    """
    Full ingestion pipeline for a single file:
    1. Detect file type & get processor
    2. Extract text blocks
    3. Chunk the text
    4. Generate embeddings
    5. Store in ChromaDB

    Returns summary dict with document_id, chunks_created, etc.
    """
    extra_metadata = extra_metadata or {}
    document_id = str(uuid.uuid4())
    file_hash = compute_file_hash(file_path)

    logger.info(f"Ingesting {file_path.name} -> collection '{collection_name}'")

    # 1. Get processor and extract text
    processor = registry.get_processor(file_path)
    text_blocks = processor.extract(file_path)
    logger.info(f"Extracted {len(text_blocks)} text blocks from {file_path.name}")

    # 2. Chunk each text block
    all_chunks: list[Chunk] = []
    for block in text_blocks:
        file_type = block.metadata.get("file_type", "unknown")
        chunker = get_chunker(file_type)
        chunks = chunker.chunk(block.content, base_metadata=block.metadata)
        all_chunks.extend(chunks)

    if not all_chunks:
        logger.warning(f"No chunks created from {file_path.name}")
        return {
            "document_id": document_id,
            "filename": file_path.name,
            "chunks_created": 0,
            "collection": collection_name,
            "status": "empty",
        }

    logger.info(f"Created {len(all_chunks)} chunks from {file_path.name}")

    # 3. Build enriched texts for embedding (with source context)
    #    and plain texts for storage (clean, no header)
    plain_texts = [chunk.content for chunk in all_chunks]
    enriched_texts = [
        _build_embedding_text(chunk.content, {**chunk.metadata, "source_file": file_path.name})
        for chunk in all_chunks
    ]

    # 4. Generate embeddings from the enriched texts
    embeddings = embed_batch(enriched_texts)
    logger.info(f"Generated {len(embeddings)} embeddings")

    # 5. Store in ChromaDB (plain text as document, enriched used only for embedding)
    collection = get_or_create_collection(collection_name)

    ids = [f"{document_id}_chunk_{i}" for i in range(len(all_chunks))]
    metadatas = []
    for i, chunk in enumerate(all_chunks):
        meta = {
            **chunk.metadata,
            **extra_metadata,
            "document_id": document_id,
            "source_file": file_path.name,
            "content_hash": file_hash,
            "chunk_index": i,
            "total_chunks": len(all_chunks),
        }
        # ChromaDB only supports str, int, float, bool in metadata
        meta = {k: _sanitize_meta_value(v) for k, v in meta.items()}
        metadatas.append(meta)

    collection.add(
        ids=ids,
        documents=plain_texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    logger.info(f"Stored {len(all_chunks)} chunks in collection '{collection_name}'")

    return {
        "document_id": document_id,
        "filename": file_path.name,
        "file_type": file_path.suffix,
        "chunks_created": len(all_chunks),
        "collection": collection_name,
        "content_hash": file_hash,
        "status": "success",
    }


def ingest_text_blocks(
    text_blocks: list,
    source_name: str,
    collection_name: str = "default",
    extra_metadata: dict | None = None,
) -> dict:
    """
    Ingest pre-extracted TextBlocks directly (for URLs, YouTube, etc.).
    Skips the file-based processor step.
    """
    extra_metadata = extra_metadata or {}
    document_id = str(uuid.uuid4())
    content_hash = hashlib.sha256(
        "".join(b.content for b in text_blocks).encode()
    ).hexdigest()

    logger.info(f"Ingesting {source_name} -> collection '{collection_name}'")

    # Chunk each text block
    all_chunks: list[Chunk] = []
    for block in text_blocks:
        file_type = block.metadata.get("file_type", "text")
        chunker = get_chunker(file_type)
        chunks = chunker.chunk(block.content, base_metadata=block.metadata)
        all_chunks.extend(chunks)

    if not all_chunks:
        logger.warning(f"No chunks created from {source_name}")
        return {
            "document_id": document_id,
            "filename": source_name,
            "chunks_created": 0,
            "collection": collection_name,
            "status": "empty",
        }

    logger.info(f"Created {len(all_chunks)} chunks from {source_name}")

    # Build enriched texts for embedding, plain texts for storage
    plain_texts = [chunk.content for chunk in all_chunks]
    enriched_texts = [
        _build_embedding_text(chunk.content, {**chunk.metadata, "source_file": source_name})
        for chunk in all_chunks
    ]

    embeddings = embed_batch(enriched_texts)
    logger.info(f"Generated {len(embeddings)} embeddings")

    # Store in ChromaDB
    collection = get_or_create_collection(collection_name)
    ids = [f"{document_id}_chunk_{i}" for i in range(len(all_chunks))]
    metadatas = []
    for i, chunk in enumerate(all_chunks):
        meta = {
            **chunk.metadata,
            **extra_metadata,
            "document_id": document_id,
            "source_file": source_name,
            "content_hash": content_hash,
            "chunk_index": i,
            "total_chunks": len(all_chunks),
        }
        meta = {k: _sanitize_meta_value(v) for k, v in meta.items()}
        metadatas.append(meta)

    collection.add(
        ids=ids,
        documents=plain_texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    logger.info(f"Stored {len(all_chunks)} chunks in collection '{collection_name}'")

    return {
        "document_id": document_id,
        "filename": source_name,
        "file_type": "url",
        "chunks_created": len(all_chunks),
        "collection": collection_name,
        "content_hash": content_hash,
        "status": "success",
    }


def ingest_batch(
    file_paths: list[Path],
    collection_name: str = "default",
) -> list[dict]:
    """Ingest multiple files."""
    results = []
    for file_path in file_paths:
        try:
            result = ingest_file(file_path, collection_name)
            results.append(result)
        except Exception as e:
            logger.error(f"Failed to ingest {file_path.name}: {e}")
            results.append({
                "filename": file_path.name,
                "status": "error",
                "error": str(e),
            })
    return results


def _build_embedding_text(content: str, metadata: dict) -> str:
    """Build enriched text for embedding with source context.

    Prepends a short header with the document name and section so the
    embedding model understands *where* this chunk comes from.  The
    plain text (without header) is stored in ChromaDB for display.
    """
    parts = []

    source = metadata.get("source_file", "")
    if source:
        parts.append(f"Bron: {source}")

    section = metadata.get("section_header", "")
    if section:
        parts.append(f"Sectie: {section}")

    title = metadata.get("title", "")
    if title and title != source:
        parts.append(f"Titel: {title}")

    if parts:
        header = " | ".join(parts)
        return f"{header}\n\n{content}"
    return content


def _sanitize_meta_value(value):
    """Convert metadata values to ChromaDB-compatible types."""
    if isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, list):
        return str(value)
    return str(value)
