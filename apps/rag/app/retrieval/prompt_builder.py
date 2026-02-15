from app.retrieval.retriever import RetrievedChunk

RAG_SYSTEM_PROMPT = """You are a knowledgeable assistant that answers questions based on the provided context.
Follow these rules:
- Answer ONLY based on the provided context
- If the context doesn't contain enough information, say so clearly
- Reference source documents when relevant
- Be concise but thorough
- Answer in the same language as the question"""

RAG_USER_PROMPT_TEMPLATE = """CONTEXT:
{context}

SOURCES:
{sources}

QUESTION: {question}

Provide a comprehensive answer based on the context above."""


def build_rag_prompt(
    question: str,
    chunks: list[RetrievedChunk],
) -> tuple[str, str]:
    """
    Build the RAG prompt from retrieved chunks.

    Returns (system_prompt, user_prompt) tuple.
    """
    # Build context from chunks
    context_parts = []
    source_parts = []
    seen_sources = set()

    for i, chunk in enumerate(chunks, 1):
        context_parts.append(f"[{i}] {chunk.content}")

        source_key = chunk.source_file
        if source_key not in seen_sources:
            seen_sources.add(source_key)
            meta_info = []
            if chunk.metadata.get("page_number"):
                meta_info.append(f"page {chunk.metadata['page_number']}")
            if chunk.metadata.get("section_header"):
                meta_info.append(f"section: {chunk.metadata['section_header']}")
            if chunk.metadata.get("language"):
                meta_info.append(f"lang: {chunk.metadata['language']}")

            source_str = f"- [{i}] {source_key}"
            if meta_info:
                source_str += f" ({', '.join(meta_info)})"
            source_parts.append(source_str)

    context = "\n\n".join(context_parts)
    sources = "\n".join(source_parts)

    user_prompt = RAG_USER_PROMPT_TEMPLATE.format(
        context=context,
        sources=sources,
        question=question,
    )

    return RAG_SYSTEM_PROMPT, user_prompt
