from fastapi import APIRouter, HTTPException

from app.core.database import list_agents
from app.models.schemas import CollectionCreate, CollectionInfo, CollectionListResponse
from app.services.collection_service import (
    get_all_collections,
    create_collection,
    remove_collection,
    get_collection_documents,
    delete_document,
)

router = APIRouter(prefix="/collections", tags=["collections"])


@router.get("", response_model=CollectionListResponse)
def list_all_collections():
    collections = get_all_collections()
    return CollectionListResponse(collections=collections)


@router.post("", response_model=CollectionInfo)
def create_new_collection(body: CollectionCreate):
    return create_collection(body.name)


@router.get("/{name}")
def get_collection(name: str):
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


@router.delete("/{name}/documents/{document_id}")
def delete_document_endpoint(name: str, document_id: str):
    chunks_removed = delete_document(name, document_id)
    return {"deleted": True, "document_id": document_id, "chunks_removed": chunks_removed}
