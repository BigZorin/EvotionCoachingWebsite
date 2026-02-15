import logging
from pathlib import Path

from app.ingestion.processors.base import BaseProcessor, TextBlock

logger = logging.getLogger(__name__)

_reader = None


def _get_easyocr_reader():
    global _reader
    if _reader is None:
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
