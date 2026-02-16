from dataclasses import dataclass

from app.config import settings


@dataclass
class Chunk:
    """A chunk of text ready for embedding."""
    content: str
    metadata: dict


MIN_CHUNK_CHARS = 50  # Skip junk chunks (page numbers, headers, etc.)


class RecursiveCharacterChunker:
    """Split text by trying progressively smaller separators."""

    def __init__(
        self,
        chunk_size: int | None = None,
        chunk_overlap: int | None = None,
        separators: list[str] | None = None,
    ):
        self.chunk_size = chunk_size or settings.chunk_size
        self.chunk_overlap = chunk_overlap or settings.chunk_overlap
        self.separators = separators or ["\n\n", "\n", ". ", " "]

    def chunk(self, text: str, base_metadata: dict | None = None) -> list[Chunk]:
        base_metadata = base_metadata or {}
        pieces = self._split_recursive(text, self.separators)
        chunks = self._merge_with_overlap(pieces)

        return [
            Chunk(
                content=c,
                metadata={**base_metadata, "chunk_index": i, "char_count": len(c)},
            )
            for i, c in enumerate(chunks)
            if c.strip() and len(c.strip()) >= MIN_CHUNK_CHARS
        ]

    def _split_recursive(self, text: str, separators: list[str]) -> list[str]:
        if not separators:
            return [text]

        sep = separators[0]
        remaining_seps = separators[1:]
        parts = text.split(sep)

        result = []
        for part in parts:
            if len(part) <= self.chunk_size:
                result.append(part)
            elif remaining_seps:
                result.extend(self._split_recursive(part, remaining_seps))
            else:
                # Force split at chunk_size boundaries
                for i in range(0, len(part), self.chunk_size):
                    result.append(part[i:i + self.chunk_size])

        return result

    def _merge_with_overlap(self, pieces: list[str]) -> list[str]:
        chunks: list[str] = []
        current = ""

        for piece in pieces:
            if len(current) + len(piece) <= self.chunk_size:
                current = f"{current} {piece}".strip() if current else piece
            else:
                if current:
                    chunks.append(current)
                    # Create overlap from end of current chunk
                    overlap = current[-self.chunk_overlap:] if len(current) > self.chunk_overlap else current
                    current = f"{overlap} {piece}".strip()
                else:
                    current = piece

        if current:
            chunks.append(current)

        return chunks


class MarkdownChunker:
    """Split markdown by headers and then apply recursive chunking."""

    def __init__(self, chunk_size: int | None = None, chunk_overlap: int | None = None):
        self.recursive = RecursiveCharacterChunker(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    def chunk(self, text: str, base_metadata: dict | None = None) -> list[Chunk]:
        # The TextProcessor already splits by headers,
        # so we just apply recursive chunking to each block
        return self.recursive.chunk(text, base_metadata)


class CodeChunker:
    """Code-aware chunking with larger chunk sizes."""

    def __init__(self):
        self.recursive = RecursiveCharacterChunker(
            chunk_size=1500,
            chunk_overlap=300,
            separators=["\n\n", "\n"],
        )

    def chunk(self, text: str, base_metadata: dict | None = None) -> list[Chunk]:
        return self.recursive.chunk(text, base_metadata)


class TabularChunker:
    """For spreadsheet data - the SpreadsheetProcessor already handles row grouping."""

    def __init__(self):
        self.recursive = RecursiveCharacterChunker(
            chunk_size=1200,
            chunk_overlap=100,
        )

    def chunk(self, text: str, base_metadata: dict | None = None) -> list[Chunk]:
        return self.recursive.chunk(text, base_metadata)


def get_chunker(file_type: str) -> RecursiveCharacterChunker:
    """Get the appropriate chunker based on file type."""
    chunkers = {
        "md": MarkdownChunker(),
        "code": CodeChunker(),
        "csv": TabularChunker(),
        "xlsx": TabularChunker(),
        "xls": TabularChunker(),
    }
    return chunkers.get(file_type, RecursiveCharacterChunker())
