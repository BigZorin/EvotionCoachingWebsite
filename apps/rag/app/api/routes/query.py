from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import QueryRequest, QueryResponse
from app.services.query_service import execute_query, execute_query_stream

router = APIRouter(prefix="/query", tags=["query"])


@router.post("", response_model=QueryResponse)
def query_documents(request: QueryRequest):
    return execute_query(request)


@router.post("/stream")
def query_documents_stream(request: QueryRequest):
    def event_stream():
        for token in execute_query_stream(request):
            yield f"data: {token}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
    )
