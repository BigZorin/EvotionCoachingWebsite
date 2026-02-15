import chromadb
from pathlib import Path

from app.config import settings

_client: chromadb.ClientAPI | None = None


def get_chroma_client() -> chromadb.ClientAPI:
    global _client
    if _client is None:
        persist_dir = Path(settings.chroma_persist_dir)
        persist_dir.mkdir(parents=True, exist_ok=True)
        _client = chromadb.PersistentClient(path=str(persist_dir))
    return _client


def get_or_create_collection(name: str) -> chromadb.Collection:
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"},
    )


def list_collections() -> list[chromadb.Collection]:
    client = get_chroma_client()
    return client.list_collections()


def delete_collection(name: str) -> None:
    client = get_chroma_client()
    client.delete_collection(name=name)
