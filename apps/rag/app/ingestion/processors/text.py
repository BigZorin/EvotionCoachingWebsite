import re
from pathlib import Path

import chardet

from app.ingestion.processors.base import BaseProcessor, TextBlock


class TextProcessor(BaseProcessor):
    def supported_extensions(self) -> list[str]:
        return [".txt", ".md"]

    def extract(self, file_path: Path) -> list[TextBlock]:
        raw = file_path.read_bytes()
        detected = chardet.detect(raw)
        encoding = detected.get("encoding", "utf-8") or "utf-8"
        content = raw.decode(encoding, errors="replace")

        if file_path.suffix == ".md":
            return self._extract_markdown(content, file_path)
        return [TextBlock(content=content, metadata={"file_type": "txt"})]

    def _extract_markdown(self, content: str, file_path: Path) -> list[TextBlock]:
        """Split markdown by headers, preserving header hierarchy."""
        blocks: list[TextBlock] = []
        current_headers: list[str] = []
        current_content: list[str] = []

        for line in content.split("\n"):
            header_match = re.match(r"^(#{1,6})\s+(.+)$", line)
            if header_match:
                # Save previous block
                if current_content:
                    text = "\n".join(current_content).strip()
                    if text:
                        blocks.append(TextBlock(
                            content=text,
                            metadata={
                                "file_type": "md",
                                "section_header": current_headers[-1] if current_headers else "",
                                "header_hierarchy": list(current_headers),
                            },
                        ))
                    current_content = []

                level = len(header_match.group(1))
                title = header_match.group(2).strip()

                # Update header hierarchy
                current_headers = current_headers[:level - 1]
                current_headers.append(title)
                current_content.append(line)
            else:
                current_content.append(line)

        # Save last block
        if current_content:
            text = "\n".join(current_content).strip()
            if text:
                blocks.append(TextBlock(
                    content=text,
                    metadata={
                        "file_type": "md",
                        "section_header": current_headers[-1] if current_headers else "",
                        "header_hierarchy": list(current_headers),
                    },
                ))

        if not blocks:
            blocks.append(TextBlock(content=content, metadata={"file_type": "md"}))

        return blocks
