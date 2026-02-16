from fastapi import APIRouter

from app.core.usage_tracker import get_usage_stats

router = APIRouter(prefix="/usage", tags=["usage"])


@router.get("")
def get_usage():
    """Get Groq API usage statistics."""
    return get_usage_stats()
