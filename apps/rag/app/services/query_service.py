import logging
from collections.abc import Generator

from app.config import settings
from app.core.llm import generate, generate_stream, get_active_provider
from app.models.schemas import QueryRequest, QueryResponse, SourceReference
from app.retrieval.prompt_builder import build_rag_prompt
from app.retrieval.retriever import retrieve

logger = logging.getLogger(__name__)


def execute_query(request: QueryRequest) -> QueryResponse:
    """Execute a RAG query: retrieve -> build prompt -> generate answer."""
    # 1. Retrieve relevant chunks
    chunks = retrieve(
        query=request.question,
        collection_name=request.collection,
        top_k=request.top_k,
    )

    if not chunks:
        return QueryResponse(
            answer="Ik kon geen relevante informatie vinden in de documenten. "
                   "Controleer of er documenten zijn geupload in de juiste collectie.",
            sources=[],
            model_used=get_active_provider(),
        )

    # 2. Build RAG prompt
    system_prompt, user_prompt = build_rag_prompt(request.question, chunks)

    # 3. Generate answer
    answer = generate(
        prompt=user_prompt,
        system=system_prompt,
        temperature=request.temperature,
    )

    # 4. Build source references
    sources = []
    if request.include_sources:
        for chunk in chunks:
            sources.append(SourceReference(
                filename=chunk.source_file,
                chunk_text=chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content,
                relevance_score=round(1 - chunk.relevance_score, 4),  # Convert distance to similarity
                metadata=chunk.metadata,
            ))

    return QueryResponse(
        answer=answer,
        sources=sources,
        model_used=get_active_provider(),
    )


def execute_query_stream(request: QueryRequest) -> Generator[str, None, None]:
    """Execute a RAG query with streaming response."""
    # 1. Retrieve
    chunks = retrieve(
        query=request.question,
        collection_name=request.collection,
        top_k=request.top_k,
    )

    if not chunks:
        yield "Ik kon geen relevante informatie vinden in de documenten."
        return

    # 2. Build prompt
    system_prompt, user_prompt = build_rag_prompt(request.question, chunks)

    # 3. Stream answer
    yield from generate_stream(
        prompt=user_prompt,
        system=system_prompt,
        temperature=request.temperature,
    )
