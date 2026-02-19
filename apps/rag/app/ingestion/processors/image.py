import logging
from pathlib import Path

from app.ingestion.processors.base import BaseProcessor, TextBlock

logger = logging.getLogger(__name__)

_reader = None
_easyocr_available = None


def _check_easyocr():
    global _easyocr_available
    if _easyocr_available is None:
        try:
            import easyocr  # noqa: F401
            _easyocr_available = True
        except ImportError:
            _easyocr_available = False
            logger.warning("easyocr not installed — image OCR disabled. Install with: pip install easyocr")
    return _easyocr_available


def _get_easyocr_reader():
    global _reader
    if _reader is None:
        if not _check_easyocr():
            raise ImportError("easyocr is not installed. Install with: pip install easyocr")
        import easyocr
        _reader = easyocr.Reader(["en", "nl"], gpu=False)
        logger.info("EasyOCR reader initialized")
    return _reader


class ImageProcessor(BaseProcessor):
    def supported_extensions(self) -> list[str]:
        return [".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"]

    def extract(self, file_path: Path) -> list[TextBlock]:
        try:
            reader = _get_easyocr_reader()
            results = reader.readtext(str(file_path))

            if not results:
                return [TextBlock(
                    content="[No text detected in image]",
                    metadata={
                        "file_type": "image",
                        "ocr_status": "no_text",
                    },
                )]

            texts = []
            total_confidence = 0
            for bbox, text, confidence in results:
                texts.append(text)
                total_confidence += confidence

            avg_confidence = total_confidence / len(results) if results else 0
            content = " ".join(texts)

            return [TextBlock(
                content=content,
                metadata={
                    "file_type": "image",
                    "ocr_confidence": round(avg_confidence, 3),
                    "text_blocks_found": len(results),
                },
            )]
        except Exception as e:
            logger.error(f"OCR failed for {file_path}: {e}")
            return [TextBlock(
                content=f"[OCR failed: {e}]",
                metadata={"file_type": "image", "ocr_status": "error"},
            )]
