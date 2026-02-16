import logging
from ollama import Client as OllamaClient

from app.config import settings

logger = logging.getLogger(__name__)

_ollama_client: OllamaClient | None = None
_st_model = None


def _get_ollama_client() -> OllamaClient:
    global _ollama_client
    if _ollama_client is None:
        _ollama_client = OllamaClient(host=settings.ollama_base_url, timeout=30.0)
    return _ollama_client


def _get_sentence_transformer():
    global _st_model
    if _st_model is None:
        from sentence_transformers import SentenceTransformer
        _st_model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Loaded sentence-transformers fallback model: all-MiniLM-L6-v2")
    return _st_model


def embed_text(text: str) -> list[float]:
    try:
        client = _get_ollama_client()
        response = client.embeddings(
            model=settings.embedding_model,
            prompt=text,
        )
        return response["embedding"]
    except Exception as e:
        logger.warning(f"Ollama embedding failed, using sentence-transformers fallback: {e}")
        model = _get_sentence_transformer()
        embedding = model.encode(text)
        return embedding.tolist()


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
        logger.warning(f"Ollama batch embedding failed, using sentence-transformers fallback: {e}")
        model = _get_sentence_transformer()
        embeddings = model.encode(texts)
        return [emb.tolist() for emb in embeddings]


def check_ollama_embeddings() -> bool:
    try:
        client = _get_ollama_client()
        client.embeddings(model=settings.embedding_model, prompt="test")
        return True
    except Exception:
        return False
