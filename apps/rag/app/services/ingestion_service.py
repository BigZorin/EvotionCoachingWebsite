import logging
import shutil
from pathlib import Path
from urllib.parse import urlparse

from fastapi import UploadFile

from app.config import settings
from app.ingestion.pipeline import ingest_file, ingest_batch, ingest_text_blocks
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
