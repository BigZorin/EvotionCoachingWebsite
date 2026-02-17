import logging

from app.core.vectorstore import (
    get_chroma_client,
    get_or_create_collection,
    delete_collection,
    list_collections,
)
from app.models.schemas import CollectionInfo

logger = logging.getLogger(__name__)


def get_all_collections() -> list[CollectionInfo]:
    """List all collections with their stats."""
    collections = list_collections()
    result = []
    client = get_chroma_client()

    for col in collections:
        name = col.name if hasattr(col, "name") else str(col)
        if name.startswith("chatfiles-"):
            continue  # Skip session attachment collections
        try:
            collection = client.get_collection(name)
            count = collection.count()

            # Count unique documents
            doc_ids = set()
            if count > 0:
                all_meta = collection.get(include=["metadatas"])
                if all_meta["metadatas"]:
                    for meta in all_meta["metadatas"]:
                        doc_id = meta.get("document_id", "")
                        if doc_id:
                            doc_ids.add(doc_id)

            result.append(CollectionInfo(
                name=name,
                document_count=len(doc_ids),
                total_chunks=count,
            ))
        except Exception as e:
            logger.error(f"Error reading collection '{name}': {e}")
            result.append(CollectionInfo(name=name))

    return result


def create_collection(name: str) -> CollectionInfo:
    """Create a new collection."""
    get_or_create_collection(name)
    return CollectionInfo(name=name, document_count=0, total_chunks=0)


def remove_collection(name: str) -> bool:
    """Delete a collection and all its contents."""
    try:
        delete_collection(name)
        return True
    except Exception as e:
        logger.error(f"Failed to delete collection '{name}': {e}")
        return False


def get_collection_documents(name: str) -> list[dict]:
    """Get all unique documents in a collection."""
    client = get_chroma_client()
    try:
        collection = client.get_collection(name)
        if collection.count() == 0:
            return []

        all_data = collection.get(include=["metadatas"])
        documents = {}
        for meta in all_data["metadatas"]:
            doc_id = meta.get("document_id", "")
            if doc_id and doc_id not in documents:
                documents[doc_id] = {
                    "document_id": doc_id,
                    "filename": meta.get("source_file", "unknown"),
                    "file_type": meta.get("file_type", "unknown"),
                    "total_chunks": meta.get("total_chunks", 0),
                }

        return list(documents.values())
    except Exception as e:
        logger.error(f"Failed to get documents for '{name}': {e}")
        return []


def cleanup_micro_chunks(collection_name: str, min_chars: int = 50) -> dict:
    """Remove junk micro-chunks (page numbers, headers, etc.) below min_chars.

    Returns summary with count of removed chunks.
    """
    client = get_chroma_client()
    try:
        collection = client.get_collection(collection_name)
        all_data = collection.get(include=["documents", "metadatas"])

        if not all_data["ids"]:
            return {"collection": collection_name, "removed": 0, "remaining": 0}

        ids_to_delete = []
        for i, doc in enumerate(all_data["documents"]):
            if not doc or len(doc.strip()) < min_chars:
                ids_to_delete.append(all_data["ids"][i])

        if ids_to_delete:
            # ChromaDB delete has a batch limit, process in chunks of 500
            for batch_start in range(0, len(ids_to_delete), 500):
                batch = ids_to_delete[batch_start:batch_start + 500]
                collection.delete(ids=batch)

        remaining = collection.count()
        logger.info(
            f"Cleanup '{collection_name}': removed {len(ids_to_delete)} "
            f"micro-chunks (<{min_chars} chars), {remaining} remaining"
        )

        return {
            "collection": collection_name,
            "removed": len(ids_to_delete),
            "remaining": remaining,
        }
    except Exception as e:
        logger.error(f"Cleanup failed for '{collection_name}': {e}")
        return {"collection": collection_name, "error": str(e)}


def delete_document(collection_name: str, document_id: str) -> int:
    """Delete all chunks belonging to a document. Returns chunks removed."""
    client = get_chroma_client()
    try:
        collection = client.get_collection(collection_name)
        # Find all chunk IDs for this document
        all_data = collection.get(include=["metadatas"])
        ids_to_delete = []
        for i, meta in enumerate(all_data["metadatas"]):
            if meta.get("document_id") == document_id:
                ids_to_delete.append(all_data["ids"][i])

        if ids_to_delete:
            collection.delete(ids=ids_to_delete)

        return len(ids_to_delete)
    except Exception as e:
        logger.error(f"Failed to delete document '{document_id}': {e}")
        return 0
