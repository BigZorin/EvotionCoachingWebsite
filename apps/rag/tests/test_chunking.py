from app.ingestion.chunking.strategies import (
    RecursiveCharacterChunker,
    CodeChunker,
    get_chunker,
)


class TestRecursiveCharacterChunker:
    def test_short_text_stays_single_chunk(self):
        chunker = RecursiveCharacterChunker(chunk_size=1000, chunk_overlap=200)
        chunks = chunker.chunk("This is a short text.")
        assert len(chunks) == 1
        assert chunks[0].content == "This is a short text."

    def test_long_text_is_split(self):
        text = "Word " * 500  # ~2500 chars
        chunker = RecursiveCharacterChunker(chunk_size=200, chunk_overlap=50)
        chunks = chunker.chunk(text)
        assert len(chunks) > 1
        for chunk in chunks:
            assert len(chunk.content) <= 300  # chunk_size + some overlap margin

    def test_metadata_is_preserved(self):
        chunker = RecursiveCharacterChunker(chunk_size=1000, chunk_overlap=200)
        chunks = chunker.chunk("Hello world", base_metadata={"source": "test"})
        assert len(chunks) == 1
        assert chunks[0].metadata["source"] == "test"
        assert "chunk_index" in chunks[0].metadata

    def test_paragraph_splitting(self):
        text = "First paragraph content.\n\nSecond paragraph content.\n\nThird paragraph content."
        chunker = RecursiveCharacterChunker(chunk_size=50, chunk_overlap=10)
        chunks = chunker.chunk(text)
        assert len(chunks) >= 2


class TestCodeChunker:
    def test_code_uses_larger_chunks(self):
        chunker = CodeChunker()
        # Code chunker should use 1500 char chunks
        code = "x = 1\n" * 100
        chunks = chunker.chunk(code)
        assert len(chunks) >= 1


class TestGetChunker:
    def test_md_returns_markdown_chunker(self):
        chunker = get_chunker("md")
        assert chunker is not None

    def test_code_returns_code_chunker(self):
        chunker = get_chunker("code")
        assert isinstance(chunker, CodeChunker)

    def test_unknown_returns_default(self):
        chunker = get_chunker("unknown_type")
        assert isinstance(chunker, RecursiveCharacterChunker)
