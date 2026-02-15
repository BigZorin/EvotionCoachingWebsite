from pathlib import Path

import fitz  # PyMuPDF

from app.ingestion.processors.base import BaseProcessor, TextBlock


class PDFProcessor(BaseProcessor):
    def supported_extensions(self) -> list[str]:
        return [".pdf"]

    def extract(self, file_path: Path) -> list[TextBlock]:
        blocks: list[TextBlock] = []
        doc = fitz.open(str(file_path))
        total_pages = len(doc)

        for page_num in range(total_pages):
            page = doc[page_num]
            text = page.get_text("text")
            if text.strip():
                blocks.append(TextBlock(
                    content=text.strip(),
                    metadata={
                        "file_type": "pdf",
                        "page_number": page_num + 1,
                        "total_pages": total_pages,
                    },
                ))

        doc.close()

        if not blocks:
            blocks.append(TextBlock(
                content="[No extractable text found in PDF]",
                metadata={"file_type": "pdf", "total_pages": total_pages},
            ))

        return blocks
