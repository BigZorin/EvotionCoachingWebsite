import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.core.database import (
    list_sessions,
    get_session,
    delete_session,
    add_feedback,
    get_analytics,
    search_sessions,
)
from app.services.chat_service import start_session, chat, chat_stream, get_chat_history

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    top_k: int = Field(default=15, ge=1, le=50)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)


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
    sessions = list_sessions(limit=limit)
    return {"sessions": sessions}


@router.get("/sessions/search")
def search_chat_sessions(q: str = "", limit: int = 50):
    if not q.strip():
        return {"sessions": list_sessions(limit=limit)}
    sessions = search_sessions(q.strip(), limit=limit)
    return {"sessions": sessions}


@router.get("/sessions/{session_id}")
def get_chat_session(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = get_chat_history(session_id)
    return {"session": session, "messages": messages}


@router.delete("/sessions/{session_id}")
def delete_chat_session(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    delete_session(session_id)
    return {"deleted": True}


@router.post("/sessions/{session_id}/messages")
def send_message(session_id: str, body: ChatRequest):
    try:
        result = chat(
            session_id=session_id,
            question=body.message,
            top_k=body.top_k,
            temperature=body.temperature,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/sessions/{session_id}/messages/stream")
def send_message_stream(session_id: str, body: ChatRequest):
    """Stream chat response via Server-Sent Events."""

    def event_generator():
        try:
            for event in chat_stream(
                session_id=session_id,
                question=body.message,
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
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'detail': str(e)})}\n\n"

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
