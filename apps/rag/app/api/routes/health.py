from fastapi import APIRouter

from app.core.embeddings import check_ollama_embeddings
from app.core.llm import check_ollama_generation, check_groq, list_available_models, get_active_provider
from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    ollama_embed = check_ollama_embeddings()
    groq_ok = check_groq()
    ollama_gen = check_ollama_generation()

    # System is OK if embeddings work AND at least one LLM is available
    llm_ok = groq_ok or ollama_gen

    return {
        "status": "ok" if (ollama_embed and llm_ok) else "degraded",
        "ollama_embeddings": ollama_embed,
        "groq": groq_ok,
        "ollama_generation": ollama_gen,
        "active_provider": get_active_provider(),
        "chroma": True,
    }


@router.get("/health/models")
def list_models():
    available = list_available_models()
    return {
        "embedding_model": settings.embedding_model,
        "active_provider": get_active_provider(),
        "available_models": available,
    }
