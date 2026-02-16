import re

from fastapi import APIRouter, HTTPException

from app.core.database import list_agents
from app.models.schemas import CollectionCreate, CollectionInfo, CollectionListResponse
from app.services.collection_service import (
    get_all_collections,
    create_collection,
    remove_collection,
    get_collection_documents,
    delete_document,
    cleanup_micro_chunks,
)

router = APIRouter(prefix="/collections", tags=["collections"])


@router.get("", response_model=CollectionListResponse)
def list_all_collections():
    collections = get_all_collections()
    return CollectionListResponse(collections=collections)


# Only allow safe collection names: alphanumeric, dash, underscore, 1-64 chars
_COLLECTION_NAME_RE = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$")


def _validate_collection_name(name: str):
    """Validate collection name on all endpoints that accept a name parameter."""
    if not _COLLECTION_NAME_RE.match(name):
        raise HTTPException(
            status_code=400,
            detail="Invalid collection name. Use only letters, numbers, dashes and underscores (1-64 chars, must start with alphanumeric).",
        )


@router.post("", response_model=CollectionInfo)
def create_new_collection(body: CollectionCreate):
    _validate_collection_name(body.name)
    return create_collection(body.name)


@router.get("/{name}")
def get_collection(name: str):
    _validate_collection_name(name)
    documents = get_collection_documents(name)
    collections = get_all_collections()
    info = next((c for c in collections if c.name == name), None)
    if not info:
        raise HTTPException(status_code=404, detail=f"Collection '{name}' not found")
    return {
        "name": info.name,
        "document_count": info.document_count,
        "total_chunks": info.total_chunks,
        "documents": documents,
    }


@router.delete("/{name}")
def delete_collection_endpoint(name: str):
    _validate_collection_name(name)
    # Check which agents reference this collection
    affected_agents = [
        a["name"] for a in list_agents()
        if name in a.get("collections", [])
    ]

    success = remove_collection(name)
    if not success:
        raise HTTPException(status_code=404, detail=f"Collectie '{name}' niet gevonden of kon niet worden verwijderd")

    result = {"deleted": True, "name": name}
    if affected_agents:
        result["warning"] = f"Let op: deze collectie werd gebruikt door agent(s): {', '.join(affected_agents)}"
        result["affected_agents"] = affected_agents
    return result


@router.get("/{name}/documents/{document_id}/chunks")
def get_document_chunks(name: str, document_id: str, limit: int = 100):
    """Get all chunks for a specific document — used for document preview."""
    _validate_collection_name(name)
    from app.core.vectorstore import get_or_create_collection

    try:
        collection = get_or_create_collection(name)
        results = collection.get(
            where={"document_id": document_id},
            include=["documents", "metadatas"],
            limit=limit,
        )

        chunks = []
        if results and results["ids"]:
            for i, chunk_id in enumerate(results["ids"]):
                meta = results["metadatas"][i] if results["metadatas"] else {}
                chunks.append({
                    "id": chunk_id,
                    "content": results["documents"][i] if results["documents"] else "",
                    "chunk_index": meta.get("chunk_index", i),
                    "metadata": meta,
                })

        # Sort by chunk_index
        chunks.sort(key=lambda c: c.get("chunk_index", 0))

        return {
            "document_id": document_id,
            "collection": name,
            "total_chunks": len(chunks),
            "chunks": chunks,
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{name}/cleanup")
def cleanup_collection_endpoint(name: str, min_chars: int = 50):
    """Remove junk micro-chunks below min_chars threshold."""
    _validate_collection_name(name)
    return cleanup_micro_chunks(name, min_chars)


@router.delete("/{name}/documents/{document_id}")
def delete_document_endpoint(name: str, document_id: str):
    _validate_collection_name(name)
    chunks_removed = delete_document(name, document_id)
    return {"deleted": True, "document_id": document_id, "chunks_removed": chunks_removed}
