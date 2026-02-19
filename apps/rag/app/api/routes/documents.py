import re

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.models.schemas import DocumentUploadResponse
from app.services.ingestion_service import process_upload, process_batch_upload, process_url, get_supported_extensions
from app.services.job_store import get_job

router = APIRouter(prefix="/documents", tags=["documents"])

# Must match collections.py validation
_COLLECTION_NAME_RE = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$")
MAX_BATCH_FILES = 20


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    collection: str = Form(default="default"),
):
    if not _COLLECTION_NAME_RE.match(collection):
        raise HTTPException(status_code=400, detail="Invalid collection name (alphanumeric, hyphens, underscores, 1-64 chars)")
    result = await process_upload(file, collection)
    return result


@router.get("/jobs/{job_id}")
def get_job_status(job_id: str):
    """Poll for background upload job status."""
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or expired")

    if job["status"] == "processing":
        return {
            "job_id": job["id"],
            "status": "processing",
            "filename": job["filename"],
            "collection": job["collection"],
        }

    # Job completed (success, duplicate, error, empty)
    result = job.get("result") or {}
    return {
        "job_id": job["id"],
        "status": job["status"],
        "filename": job["filename"],
        "collection": job["collection"],
        "document_id": result.get("document_id", ""),
        "file_type": result.get("file_type", ""),
        "chunks_created": result.get("chunks_created", 0),
        "content_hash": result.get("content_hash", ""),
        "error": job.get("error"),
    }


@router.post("/upload-batch")
async def upload_batch(
    files: list[UploadFile] = File(...),
    collection: str = Form(default="default"),
):
    if not _COLLECTION_NAME_RE.match(collection):
        raise HTTPException(status_code=400, detail="Invalid collection name")
    if len(files) > MAX_BATCH_FILES:
        raise HTTPException(status_code=400, detail=f"Too many files (max {MAX_BATCH_FILES} per batch)")
    results = await process_batch_upload(files, collection)
    return {"documents": results, "total_chunks": sum(r.get("chunks_created", 0) for r in results)}


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
