import logging
import shutil
import threading
from pathlib import Path
from urllib.parse import urlparse

from fastapi import UploadFile

from app.config import settings
from app.ingestion.pipeline import ingest_file, ingest_batch, ingest_text_blocks
from app.ingestion.processors.registry import registry, UnsupportedFileType
from app.services.job_store import create_job, update_job

logger = logging.getLogger(__name__)


async def save_and_validate_upload(
    file: UploadFile,
    collection: str = "default",
) -> dict:
    """Save uploaded file to disk and validate it. Returns file_path + metadata.

    Does NOT run ingestion — that's handled either synchronously or in background.
    Returns dict with 'file_path' on success, or 'status': 'error' on failure.
    """
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Sanitize filename to prevent path traversal
    raw_name = file.filename or "unknown"
    filename = Path(raw_name).name  # Strip any directory components
    filename = filename.lstrip(".")  # Remove leading dots
    if not filename:
        filename = "unknown"
    file_path = upload_dir / filename

    try:
        registry.get_processor(file_path)
    except UnsupportedFileType as e:
        return {
            "filename": filename,
            "status": "error",
            "error": str(e),
            "document_id": "",
            "chunks_created": 0,
            "collection": collection,
        }

    # Save file to disk
    try:
        max_bytes = settings.max_file_size_mb * 1024 * 1024
        if file.size and file.size > max_bytes:
            return {
                "filename": filename,
                "status": "error",
                "error": f"File too large: {file.size / 1024 / 1024:.1f}MB (max {settings.max_file_size_mb}MB)",
                "document_id": "",
                "chunks_created": 0,
                "collection": collection,
            }

        content = await file.read()

        if len(content) > max_bytes:
            return {
                "filename": filename,
                "status": "error",
                "error": f"File too large: {len(content) / 1024 / 1024:.1f}MB (max {settings.max_file_size_mb}MB)",
                "document_id": "",
                "chunks_created": 0,
                "collection": collection,
            }

        file_path.write_bytes(content)
    except Exception as e:
        logger.error(f"Failed to save file {filename}: {e}")
        return {
            "filename": filename,
            "status": "error",
            "error": f"Failed to save file: {e}",
            "document_id": "",
            "chunks_created": 0,
            "collection": collection,
        }

    return {"file_path": file_path, "filename": filename, "collection": collection}


def _run_ingestion(file_path: Path, collection: str, job_id: str):
    """Run ingestion pipeline in a background thread and update job store."""
    try:
        result = ingest_file(file_path, collection_name=collection)
        update_job(job_id, status=result.get("status", "success"), result=result)
        logger.info(f"Background job {job_id} completed: {result.get('chunks_created', 0)} chunks")
    except Exception as e:
        logger.error(f"Background job {job_id} failed: {e}")
        update_job(job_id, status="error", error=str(e))
    finally:
        if file_path.exists():
            file_path.unlink()


async def process_upload(
    file: UploadFile,
    collection: str = "default",
) -> dict:
    """Save uploaded file and process it in a background thread.

    Returns immediately with job_id + status 'processing'.
    Client polls GET /documents/jobs/{job_id} for completion.
    """
    saved = await save_and_validate_upload(file, collection)
    if saved.get("status") == "error":
        return saved

    file_path = saved["file_path"]
    filename = saved["filename"]

    # Create background job
    job_id = create_job(filename, collection)

    # Start ingestion in background thread (doesn't block the event loop)
    thread = threading.Thread(
        target=_run_ingestion,
        args=(file_path, collection, job_id),
        daemon=True,
    )
    thread.start()

    logger.info(f"Started background ingestion job {job_id} for {filename}")

    return {
        "document_id": "",
        "filename": filename,
        "file_type": file_path.suffix,
        "chunks_created": 0,
        "collection": collection,
        "content_hash": "",
        "status": "processing",
        "job_id": job_id,
    }


async def process_batch_upload(
    files: list[UploadFile],
    collection: str = "default",
) -> list[dict]:
    """Process multiple uploaded files — each one starts a background job."""
    results = []
    for file in files:
        result = await process_upload(file, collection)
        results.append(result)
    return results


def process_url(url: str, collection: str = "default") -> dict:
    """Fetch and ingest content from a URL (web page or YouTube video)."""
    from app.ingestion.processors.web import WebProcessor, is_youtube_url, is_valid_url
    from app.ingestion.processors.youtube import YouTubeProcessor

    if not is_valid_url(url):
        return {
            "filename": url,
            "status": "error",
            "error": "Invalid URL. Must be a valid HTTP(S) URL.",
            "document_id": "",
            "chunks_created": 0,
            "collection": collection,
        }

    try:
        if is_youtube_url(url):
            processor = YouTubeProcessor()
            text_blocks = processor.process_url(url)
            # Use video ID as source name
            from app.ingestion.processors.youtube import extract_video_id
            video_id = extract_video_id(url) or "unknown"
            source_name = f"youtube:{video_id}"
            file_type = "youtube"
        else:
            processor = WebProcessor()
            text_blocks = processor.process_url(url)
            parsed = urlparse(url)
            domain = parsed.hostname or "unknown"
            path = parsed.path.strip("/").replace("/", "_") or "index"
            source_name = f"{domain}/{path}"
            file_type = "web"

        # Check if extraction had errors
        if text_blocks and text_blocks[0].metadata.get("error"):
            return {
                "filename": source_name,
                "status": "error",
                "error": text_blocks[0].content,
                "document_id": "",
                "chunks_created": 0,
                "collection": collection,
                "file_type": file_type,
            }

        result = ingest_text_blocks(
            text_blocks=text_blocks,
            source_name=source_name,
            collection_name=collection,
            extra_metadata={"source_url": url, "source_type": file_type},
        )
        result["file_type"] = file_type
        return result

    except Exception as e:
        logger.error(f"URL ingestion failed for {url}: {e}")
        return {
            "filename": url[:100],
            "status": "error",
            "error": str(e),
            "document_id": "",
            "chunks_created": 0,
            "collection": collection,
        }


def get_supported_extensions() -> list[str]:
    return registry.supported_extensions()
