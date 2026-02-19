import json
import logging

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import QueryRequest, QueryResponse
from app.services.query_service import execute_query, execute_query_stream

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/query", tags=["query"])


@router.post("", response_model=QueryResponse)
def query_documents(request: QueryRequest):
    return execute_query(request)


@router.post("/stream")
def query_documents_stream(request: QueryRequest):
    def event_stream():
        try:
            for token in execute_query_stream(request):
                yield f"data: {token}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Query stream error: {e}", exc_info=True)
            yield f"event: error\ndata: {json.dumps({'detail': 'Er is een fout opgetreden bij het verwerken van de zoekopdracht.'})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
