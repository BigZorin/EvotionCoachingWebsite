from pathlib import Path

import fitz  # PyMuPDF

from app.ingestion.processors.base import BaseProcessor, TextBlock


class PDFProcessor(BaseProcessor):
    def supported_extensions(self) -> list[str]:
        return [".pdf"]

    def extract(self, file_path: Path) -> list[TextBlock]:
        doc = fitz.open(str(file_path))
        total_pages = len(doc)

        # Join ALL pages into one continuous text so chunks can span page
        # boundaries naturally.  Page markers (<!-- PAGE N -->) are inserted
        # so the pipeline can assign page numbers to each chunk later.
        parts: list[str] = []
        for page_num in range(total_pages):
            page = doc[page_num]
            text = page.get_text("text").strip()
            if text:
                parts.append(f"<!-- PAGE {page_num + 1} -->")
                parts.append(text)

        doc.close()

        if not parts:
            return [TextBlock(
                content="[No extractable text found in PDF]",
                metadata={"file_type": "pdf", "total_pages": total_pages},
            )]

        full_text = "\n\n".join(parts)

        return [TextBlock(
            content=full_text,
            metadata={
                "file_type": "pdf",
                "total_pages": total_pages,
                "has_page_markers": True,
            },
        )]
