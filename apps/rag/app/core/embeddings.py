import logging
import threading

from ollama import Client as OllamaClient

from app.config import settings

logger = logging.getLogger(__name__)

_ollama_client: OllamaClient | None = None
_ollama_lock = threading.Lock()
_st_model = None
_st_lock = threading.Lock()


def _get_ollama_client() -> OllamaClient:
    global _ollama_client
    if _ollama_client is None:
        with _ollama_lock:
            if _ollama_client is None:
                _ollama_client = OllamaClient(host=settings.ollama_base_url, timeout=30.0)
    return _ollama_client


def _get_sentence_transformer():
    global _st_model
    if _st_model is None:
        with _st_lock:
            if _st_model is None:
                from sentence_transformers import SentenceTransformer
                _st_model = SentenceTransformer("all-MiniLM-L6-v2")
                logger.info("Loaded sentence-transformers fallback model: all-MiniLM-L6-v2")
    return _st_model


# Ollama nomic-embed-text produces 768-dim vectors; sentence-transformers fallback
# produces 384-dim. ChromaDB rejects mismatched dimensions, so we must NEVER
# silently switch between the two once a collection exists.
OLLAMA_EMBEDDING_DIM = 768
FALLBACK_EMBEDDING_DIM = 384


def embed_text(text: str) -> list[float]:
    try:
        client = _get_ollama_client()
        response = client.embeddings(
            model=settings.embedding_model,
            prompt=text,
        )
        return response["embedding"]
    except Exception as e:
        logger.error(
            f"Ollama embedding failed: {e}. "
            f"Sentence-transformers fallback produces {FALLBACK_EMBEDDING_DIM}-dim vectors "
            f"which are INCOMPATIBLE with existing {OLLAMA_EMBEDDING_DIM}-dim collections. "
            "Refusing to fall back to avoid dimension mismatch."
        )
        raise RuntimeError(
            f"Embedding service unavailable. Ollama ({settings.embedding_model}) is down "
            "and fallback model has incompatible dimensions."
        ) from e


def embed_batch(texts: list[str]) -> list[list[float]]:
    try:
        client = _get_ollama_client()
        embeddings = []
        for text in texts:
            response = client.embeddings(
                model=settings.embedding_model,
                prompt=text,
            )
            embeddings.append(response["embedding"])
        return embeddings
    except Exception as e:
        logger.error(
            f"Ollama batch embedding failed: {e}. "
            "Refusing fallback to avoid dimension mismatch in ChromaDB."
        )
        raise RuntimeError(
            f"Embedding service unavailable. Ollama ({settings.embedding_model}) is down "
            "and fallback model has incompatible dimensions."
        ) from e


def check_ollama_embeddings() -> bool:
    try:
        client = _get_ollama_client()
        client.embeddings(model=settings.embedding_model, prompt="test")
        return True
    except Exception:
        return False
