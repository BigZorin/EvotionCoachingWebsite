import re

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.models.schemas import DocumentUploadResponse, BatchUploadResponse
from app.services.ingestion_service import process_upload, process_batch_upload, process_url, get_supported_extensions

router = APIRouter(prefix="/documents", tags=["documents"])

# Must match collections.py validation
_COLLECTION_NAME_RE = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$")
MAX_BATCH_FILES = 20


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    collection: str = Form(default="default"),
):
    if not _COLLECTION_NAME_RE.match(collection):
        raise HTTPException(status_code=400, detail="Invalid collection name (alphanumeric, hyphens, underscores, 1-64 chars)")
    result = await process_upload(file, collection)
    return DocumentUploadResponse(
        document_id=result.get("document_id", ""),
        filename=result.get("filename", ""),
        file_type=result.get("file_type", ""),
        chunks_created=result.get("chunks_created", 0),
        collection=result.get("collection", collection),
        content_hash=result.get("content_hash", ""),
        status=result.get("status", "error"),
    )


@router.post("/upload-batch", response_model=BatchUploadResponse)
async def upload_batch(
    files: list[UploadFile] = File(...),
    collection: str = Form(default="default"),
):
    if not _COLLECTION_NAME_RE.match(collection):
        raise HTTPException(status_code=400, detail="Invalid collection name")
    if len(files) > MAX_BATCH_FILES:
        raise HTTPException(status_code=400, detail=f"Too many files (max {MAX_BATCH_FILES} per batch)")
    results = await process_batch_upload(files, collection)
    documents = [
        DocumentUploadResponse(
            document_id=r.get("document_id", ""),
            filename=r.get("filename", ""),
            file_type=r.get("file_type", ""),
            chunks_created=r.get("chunks_created", 0),
            collection=r.get("collection", collection),
            content_hash=r.get("content_hash", ""),
            status=r.get("status", "error"),
        )
        for r in results
    ]
    total_chunks = sum(d.chunks_created for d in documents)
    return BatchUploadResponse(documents=documents, total_chunks=total_chunks)


class UrlUploadRequest(BaseModel):
    url: str
    collection: str = "default"


@router.post("/upload-url", response_model=DocumentUploadResponse)
def upload_url(body: UrlUploadRequest):
    """Ingest content from a URL (web page or YouTube video)."""
    result = process_url(body.url, body.collection)
    return DocumentUploadResponse(
        document_id=result.get("document_id", ""),
        filename=result.get("filename", ""),
        file_type=result.get("file_type", ""),
        chunks_created=result.get("chunks_created", 0),
        collection=result.get("collection", body.collection),
        content_hash=result.get("content_hash", ""),
        status=result.get("status", "error"),
    )


@router.get("/supported-types")
def list_supported_types():
    return {"extensions": get_supported_extensions()}
