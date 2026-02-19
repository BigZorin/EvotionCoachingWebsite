import logging
import threading
import time

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
                _ollama_client = OllamaClient(host=settings.ollama_base_url, timeout=120.0)
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


# Ollama bge-m3 produces 1024-dim vectors; sentence-transformers fallback
# produces 384-dim. ChromaDB rejects mismatched dimensions, so we must NEVER
# silently switch between the two once a collection exists.
OLLAMA_EMBEDDING_DIM = 1024
FALLBACK_EMBEDDING_DIM = 384


EMBED_BATCH_SIZE = 50  # Max texts per Ollama batch call to avoid OOM


def embed_text(text: str) -> list[float]:
    try:
        client = _get_ollama_client()
        response = client.embed(
            model=settings.embedding_model,
            input=text,
        )
        return response["embeddings"][0]
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


def embed_batch(texts: list[str], max_retries: int = 3) -> list[list[float]]:
    """Batch-embed texts using Ollama's native batch API.

    Processes in batches of EMBED_BATCH_SIZE to avoid memory issues.
    Retries with exponential backoff on transient failures (timeout, connection).
    """
    client = _get_ollama_client()
    all_embeddings = []

    for i in range(0, len(texts), EMBED_BATCH_SIZE):
        batch = texts[i:i + EMBED_BATCH_SIZE]
        last_error = None

        for attempt in range(max_retries):
            try:
                response = client.embed(
                    model=settings.embedding_model,
                    input=batch,
                )
                all_embeddings.extend(response["embeddings"])
                last_error = None
                break
            except Exception as e:
                last_error = e
                if attempt < max_retries - 1:
                    wait = 2 ** attempt  # 1s, 2s, 4s
                    logger.warning(
                        f"Ollama embed batch {i // EMBED_BATCH_SIZE + 1} failed (attempt {attempt + 1}/{max_retries}): {e}. "
                        f"Retrying in {wait}s..."
                    )
                    time.sleep(wait)

        if last_error is not None:
            logger.error(
                f"Ollama batch embedding failed after {max_retries} attempts: {last_error}. "
                "Refusing fallback to avoid dimension mismatch in ChromaDB."
            )
            raise RuntimeError(
                f"Embedding service unavailable. Ollama ({settings.embedding_model}) is down "
                "and fallback model has incompatible dimensions."
            ) from last_error

    return all_embeddings


def check_ollama_embeddings() -> bool:
    try:
        client = _get_ollama_client()
        client.embed(model=settings.embedding_model, input="test")
        return True
    except Exception:
        return False
