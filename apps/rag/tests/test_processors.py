from app.ingestion.processors.text import TextProcessor
from app.ingestion.processors.json_proc import JSONProcessor
from app.ingestion.processors.code import CodeProcessor
from app.ingestion.processors.spreadsheet import SpreadsheetProcessor
from app.ingestion.processors.registry import registry, UnsupportedFileType

import pytest
from pathlib import Path


class TestTextProcessor:
    def test_txt_extraction(self, sample_txt_file):
        processor = TextProcessor()
        blocks = processor.extract(sample_txt_file)
        assert len(blocks) >= 1
        assert "sample text" in blocks[0].content

    def test_md_extraction_splits_by_headers(self, sample_md_file):
        processor = TextProcessor()
        blocks = processor.extract(sample_md_file)
        assert len(blocks) >= 2
        # Check that headers are preserved in metadata
        has_section = any(b.metadata.get("section_header") for b in blocks)
        assert has_section

    def test_supported_extensions(self):
        processor = TextProcessor()
        exts = processor.supported_extensions()
        assert ".txt" in exts
        assert ".md" in exts


class TestJSONProcessor:
    def test_json_extraction(self, sample_json_file):
        processor = JSONProcessor()
        blocks = processor.extract(sample_json_file)
        assert len(blocks) == 1
        content = blocks[0].content
        assert "name: Test" in content
        assert "nested.key1: value1" in content
        assert "nested.key2: 42" in content

    def test_supported_extensions(self):
        processor = JSONProcessor()
        assert ".json" in processor.supported_extensions()


class TestCodeProcessor:
    def test_python_extraction(self, sample_py_file):
        processor = CodeProcessor()
        blocks = processor.extract(sample_py_file)
        assert len(blocks) >= 1
        # Should detect python language
        has_python = any(b.metadata.get("language") == "python" for b in blocks)
        assert has_python

    def test_supported_extensions(self):
        processor = CodeProcessor()
        exts = processor.supported_extensions()
        assert ".py" in exts
        assert ".ts" in exts
        assert ".js" in exts


class TestSpreadsheetProcessor:
    def test_csv_extraction(self, sample_csv_file):
        processor = SpreadsheetProcessor()
        blocks = processor.extract(sample_csv_file)
        assert len(blocks) >= 1
        content = blocks[0].content
        assert "Alice" in content
        assert "name" in content.lower()

    def test_supported_extensions(self):
        processor = SpreadsheetProcessor()
        exts = processor.supported_extensions()
        assert ".csv" in exts
        assert ".xlsx" in exts


class TestProcessorRegistry:
    def test_get_processor_for_known_type(self, tmp_dir):
        file = tmp_dir / "test.txt"
        file.write_text("hello")
        processor = registry.get_processor(file)
        assert processor is not None

    def test_get_processor_for_unknown_type(self, tmp_dir):
        file = tmp_dir / "test.xyz"
        with pytest.raises(UnsupportedFileType):
            registry.get_processor(file)

    def test_supported_extensions_list(self):
        exts = registry.supported_extensions()
        assert len(exts) > 10  # Should support many extensions
        assert ".pdf" in exts
        assert ".py" in exts
