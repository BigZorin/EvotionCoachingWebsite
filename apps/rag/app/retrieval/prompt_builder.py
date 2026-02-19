from app.retrieval.retriever import RetrievedChunk

RAG_SYSTEM_PROMPT = """You are an expert knowledge assistant. You answer questions accurately based on the provided document context.

STRICT RULES:
1. ONLY use facts explicitly stated in the context below. Never add information from your own knowledge.
2. Use inline citations like [1], [2] etc. to reference source passages. Place them directly after the relevant claim.
3. If the context doesn't contain enough information to fully answer, explicitly state what is missing.
4. When multiple sources discuss the same topic, synthesize them into one coherent answer.
5. If sources contradict each other, mention both perspectives with their respective citations.
6. Be thorough and well-structured. Use headers, bullet points, or numbered lists when it improves clarity.
7. Answer in the same language as the question."""

RAG_USER_PROMPT_TEMPLATE = """DOCUMENT CONTEXT:
{context}

SOURCES:
{sources}

QUESTION: {question}

Provide a comprehensive, well-structured answer with inline citations [1], [2] etc. Only use information from the context above."""


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
