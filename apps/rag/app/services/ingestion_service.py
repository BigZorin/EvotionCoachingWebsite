import logging
import shutil
from pathlib import Path

from fastapi import UploadFile

from app.config import settings
from app.ingestion.pipeline import ingest_file, ingest_batch
from app.ingestion.processors.registry import registry, UnsupportedFileType

logger = logging.getLogger(__name__)


async def process_upload(
    file: UploadFile,
    collection: str = "default",
) -> dict:
    """Save uploaded file to disk and process it through the ingestion pipeline."""
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Sanitize filename to prevent path traversal
    raw_name = file.filename or "unknown"
    filename = Path(raw_name).name  # Strip any directory components
    filename = filename.lstrip(".")  # Remove leading dots
    if not filename:
        filename = "unknown"
    file_path = upload_dir / filename
    ext = file_path.suffix.lower()

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
        content = await file.read()
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

    # Process through pipeline
    try:
        result = ingest_file(file_path, collection_name=collection)
        return result
    except Exception as e:
        logger.error(f"Ingestion failed for {filename}: {e}")
        return {
            "filename": filename,
            "status": "error",
            "error": str(e),
            "document_id": "",
            "chunks_created": 0,
            "collection": collection,
        }
    finally:
        # Clean up uploaded file
        if file_path.exists():
            file_path.unlink()


async def process_batch_upload(
    files: list[UploadFile],
    collection: str = "default",
) -> list[dict]:
    """Process multiple uploaded files."""
    results = []
    for file in files:
        result = await process_upload(file, collection)
        results.append(result)
    return results


def get_supported_extensions() -> list[str]:
    return registry.supported_extensions()
