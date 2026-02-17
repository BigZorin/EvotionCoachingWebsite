import json
import logging

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

from app.core.database import (
    list_sessions,
    get_session,
    delete_session,
    add_feedback,
    get_analytics,
    search_sessions,
    get_session_metadata,
    update_session_metadata,
)
from app.services.chat_service import start_session, chat, chat_stream, get_chat_history
from app.services.collection_service import remove_collection
from app.services.ingestion_service import process_upload

router = APIRouter(prefix="/chat", tags=["chat"])


def _attachment_collection(session_id: str) -> str:
    """Session-scoped ChromaDB collection for chat file attachments."""
    return f"chatfiles-{session_id[:8]}"


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    top_k: int = Field(default=15, ge=1, le=50)
    temperature: float = Field(default=0.3, ge=0.0, le=2.0)


class NewSessionRequest(BaseModel):
    collection: str | None = None
    agent_id: str | None = None


class FeedbackRequest(BaseModel):
    message_id: str
    feedback: str  # "positive" or "negative"


@router.post("/sessions")
def create_chat_session(body: NewSessionRequest | None = None):
    collection = body.collection if body else None
    agent_id = body.agent_id if body else None
    session = start_session(collection=collection, agent_id=agent_id)
    return session


@router.get("/sessions")
def list_chat_sessions(limit: int = 50):
    limit = min(max(limit, 1), 500)
    sessions = list_sessions(limit=limit)
    return {"sessions": sessions}


@router.get("/sessions/search")
def search_chat_sessions(q: str = "", limit: int = 50):
    limit = min(max(limit, 1), 500)
    if not q.strip():
        return {"sessions": list_sessions(limit=limit)}
    sessions = search_sessions(q.strip(), limit=limit)
    return {"sessions": sessions}


@router.get("/sessions/{session_id}")
def get_chat_session(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    # Parse metadata JSON string so frontend gets an object
    if isinstance(session.get("metadata"), str):
        try:
            session["metadata"] = json.loads(session["metadata"])
        except (json.JSONDecodeError, TypeError):
            session["metadata"] = {}
    messages = get_chat_history(session_id)
    return {"session": session, "messages": messages}


@router.delete("/sessions/{session_id}")
def delete_chat_session(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    # Clean up attachment collection if it exists
    try:
        remove_collection(_attachment_collection(session_id))
        logger.info(f"Cleaned up attachment collection for session {session_id[:8]}")
    except Exception as e:
        logger.debug(f"No attachment collection to clean for session {session_id[:8]}: {e}")
    delete_session(session_id)
    return {"deleted": True}


@router.post("/sessions/{session_id}/messages")
def send_message(session_id: str, body: ChatRequest):
    try:
        result = chat(
            session_id=session_id,
            question=body.message.strip(),
            top_k=body.top_k,
            temperature=body.temperature,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        # LLM provider errors (rate limit, all providers down)
        logger.warning(f"LLM provider error: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Chat failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Er is een fout opgetreden bij het genereren van het antwoord.")


@router.post("/sessions/{session_id}/messages/stream")
def send_message_stream(session_id: str, body: ChatRequest):
    """Stream chat response via Server-Sent Events."""

    def event_generator():
        try:
            for event in chat_stream(
                session_id=session_id,
                question=body.message.strip(),
                top_k=body.top_k,
                temperature=body.temperature,
            ):
                event_type = event["event"]
                data = event["data"]
                # Status events are plain strings, others are JSON
                if event_type == "status":
                    yield f"event: status\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"
                else:
                    yield f"event: {event_type}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"
        except ValueError as e:
            yield f"event: error\ndata: {json.dumps({'detail': str(e)})}\n\n"
        except RuntimeError as e:
            # LLM provider errors (rate limit, all providers down) — pass message to user
            logger.warning(f"LLM provider error: {e}")
            yield f"event: error\ndata: {json.dumps({'detail': str(e)}, ensure_ascii=False)}\n\n"
        except Exception as e:
            logger.error(f"Chat streaming failed: {e}", exc_info=True)
            yield f"event: error\ndata: {json.dumps({'detail': 'Er is een fout opgetreden bij het genereren van het antwoord.'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ============================================================
# File Attachments
# ============================================================

@router.post("/sessions/{session_id}/attachments")
async def upload_chat_attachment(session_id: str, file: UploadFile = File(...)):
    """Upload a file attachment in a chat session for the AI to analyze."""
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    collection_name = _attachment_collection(session_id)
    result = await process_upload(file, collection_name)

    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("error", "Upload failed"))

    # Track attachment in session metadata
    meta = get_session_metadata(session_id)
    attachments = meta.get("attachments", [])
    attachments.append({
        "filename": result.get("filename", ""),
        "document_id": result.get("document_id", ""),
        "chunks_created": result.get("chunks_created", 0),
    })
    update_session_metadata(session_id, {
        "attachments": attachments,
        "attachment_collection": collection_name,
    })

    return {
        "filename": result.get("filename", ""),
        "document_id": result.get("document_id", ""),
        "chunks_created": result.get("chunks_created", 0),
        "collection": collection_name,
        "status": "success",
    }


# ============================================================
# Feedback
# ============================================================

@router.post("/feedback")
def submit_feedback(body: FeedbackRequest):
    if body.feedback not in ("positive", "negative"):
        raise HTTPException(status_code=400, detail="Feedback moet 'positive' of 'negative' zijn")
    add_feedback(body.message_id, body.feedback)
    return {"ok": True}


# ============================================================
# Analytics
# ============================================================

@router.get("/analytics")
def get_chat_analytics():
    return get_analytics()
