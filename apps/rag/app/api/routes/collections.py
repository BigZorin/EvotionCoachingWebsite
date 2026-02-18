import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.database import (
    list_agents,
    create_folder,
    get_all_folders,
    list_folders,
    get_folder,
    update_folder,
    delete_folder,
    set_document_folder,
    unset_document_folder,
    get_folder_document_counts,
)
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
def get_collection(name: str, folder_id: str | None = None, root_only: bool = False):
    _validate_collection_name(name)
    documents = get_collection_documents(name, folder_id=folder_id, root_only=root_only)
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
def get_document_chunks(name: str, document_id: str, limit: int = 500):
    """Get all chunks for a specific document — used for document preview."""
    _validate_collection_name(name)
    limit = min(max(limit, 1), 1000)
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
    min_chars = min(max(min_chars, 0), 10000)
    return cleanup_micro_chunks(name, min_chars)


@router.delete("/{name}/documents/{document_id}")
def delete_document_endpoint(name: str, document_id: str):
    _validate_collection_name(name)
    # Also remove from document_folders if present
    unset_document_folder(document_id)
    chunks_removed = delete_document(name, document_id)
    return {"deleted": True, "document_id": document_id, "chunks_removed": chunks_removed}


# ============================================================
# Folders
# ============================================================

class CreateFolderRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    parent_id: str | None = None


class UpdateFolderRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)


class MoveDocumentRequest(BaseModel):
    folder_id: str | None = None  # None = move to root


@router.get("/{name}/folders")
def get_collection_folders(name: str):
    """Get all folders for a collection with document counts."""
    _validate_collection_name(name)
    folders = get_all_folders(name)
    doc_counts = get_folder_document_counts(name)
    return {
        "folders": [
            {**f, "document_count": doc_counts.get(f["id"], 0)}
            for f in folders
        ]
    }


@router.post("/{name}/folders")
def create_collection_folder(name: str, body: CreateFolderRequest):
    _validate_collection_name(name)
    if body.parent_id:
        parent = get_folder(body.parent_id)
        if not parent or parent["collection"] != name:
            raise HTTPException(status_code=404, detail="Parent folder not found in this collection")
    folder = create_folder(name, body.name, body.parent_id)
    return folder


@router.patch("/{name}/folders/{folder_id}")
def update_collection_folder(name: str, folder_id: str, body: UpdateFolderRequest):
    _validate_collection_name(name)
    folder = get_folder(folder_id)
    if not folder or folder["collection"] != name:
        raise HTTPException(status_code=404, detail="Folder not found")
    updated = update_folder(folder_id, name=body.name)
    return updated


@router.delete("/{name}/folders/{folder_id}")
def delete_collection_folder(name: str, folder_id: str):
    _validate_collection_name(name)
    folder = get_folder(folder_id)
    if not folder or folder["collection"] != name:
        raise HTTPException(status_code=404, detail="Folder not found")
    delete_folder(folder_id)
    return {"deleted": True, "folder_id": folder_id}


@router.patch("/{name}/documents/{document_id}/folder")
def move_document_to_folder(name: str, document_id: str, body: MoveDocumentRequest):
    """Move a document to a folder, or back to root (folder_id=null)."""
    _validate_collection_name(name)
    if body.folder_id:
        folder = get_folder(body.folder_id)
        if not folder or folder["collection"] != name:
            raise HTTPException(status_code=404, detail="Folder not found in this collection")
        result = set_document_folder(document_id, body.folder_id, name)
        return {"moved": True, **result}
    else:
        unset_document_folder(document_id)
        return {"moved": True, "document_id": document_id, "folder_id": None}
