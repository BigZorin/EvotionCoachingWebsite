from fastapi import APIRouter, File, Form, UploadFile

from app.models.schemas import DocumentUploadResponse, BatchUploadResponse
from app.services.ingestion_service import process_upload, process_batch_upload, get_supported_extensions

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    collection: str = Form(default="default"),
):
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


@router.get("/supported-types")
def list_supported_types():
    return {"extensions": get_supported_extensions()}
