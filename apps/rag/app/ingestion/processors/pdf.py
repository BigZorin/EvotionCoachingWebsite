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
        # boundaries naturally.  This prevents sentences that cross pages
        # from being split into incoherent fragments.
        page_texts: list[str] = []
        for page_num in range(total_pages):
            page = doc[page_num]
            text = page.get_text("text").strip()
            if text:
                page_texts.append(text)

        doc.close()

        if not page_texts:
            return [TextBlock(
                content="[No extractable text found in PDF]",
                metadata={"file_type": "pdf", "total_pages": total_pages},
            )]

        full_text = "\n\n".join(page_texts)

        return [TextBlock(
            content=full_text,
            metadata={
                "file_type": "pdf",
                "total_pages": total_pages,
            },
        )]
