from pathlib import Path

from app.ingestion.processors.base import BaseProcessor
from app.ingestion.processors.text import TextProcessor
from app.ingestion.processors.pdf import PDFProcessor
from app.ingestion.processors.docx_proc import DocxProcessor
from app.ingestion.processors.spreadsheet import SpreadsheetProcessor
from app.ingestion.processors.json_proc import JSONProcessor
from app.ingestion.processors.code import CodeProcessor
from app.ingestion.processors.image import ImageProcessor


class UnsupportedFileType(Exception):
    pass


class ProcessorRegistry:
    def __init__(self):
        self._processors: list[BaseProcessor] = [
            TextProcessor(),
            PDFProcessor(),
            DocxProcessor(),
            SpreadsheetProcessor(),
            JSONProcessor(),
            CodeProcessor(),
            ImageProcessor(),
        ]
        self._extension_map: dict[str, BaseProcessor] = {}
        for processor in self._processors:
            for ext in processor.supported_extensions():
                self._extension_map[ext.lower()] = processor

    def get_processor(self, file_path: Path) -> BaseProcessor:
        ext = file_path.suffix.lower()
        processor = self._extension_map.get(ext)
        if processor is None:
            raise UnsupportedFileType(
                f"No processor for '{ext}'. Supported: {sorted(self._extension_map.keys())}"
            )
        return processor

    def supported_extensions(self) -> list[str]:
        return sorted(self._extension_map.keys())


# Singleton instance
registry = ProcessorRegistry()
