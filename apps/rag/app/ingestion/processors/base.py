from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class TextBlock:
    """A block of extracted text with metadata."""
    content: str
    metadata: dict = field(default_factory=dict)


class BaseProcessor(ABC):
    @abstractmethod
    def extract(self, file_path: Path) -> list[TextBlock]:
        """Extract text blocks from a file."""
        ...

    @abstractmethod
    def supported_extensions(self) -> list[str]:
        """Return list of supported file extensions (with dot, e.g. '.pdf')."""
        ...
