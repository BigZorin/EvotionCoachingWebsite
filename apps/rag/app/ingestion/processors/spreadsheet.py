from pathlib import Path

import pandas as pd

from app.ingestion.processors.base import BaseProcessor, TextBlock

ROWS_PER_CHUNK = 20


class SpreadsheetProcessor(BaseProcessor):
    def supported_extensions(self) -> list[str]:
        return [".csv", ".xlsx", ".xls"]

    def extract(self, file_path: Path) -> list[TextBlock]:
        ext = file_path.suffix.lower()

        if ext == ".csv":
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        blocks: list[TextBlock] = []
        columns = list(df.columns)
        column_header = " | ".join(str(c) for c in columns)
        total_rows = len(df)

        for start in range(0, total_rows, ROWS_PER_CHUNK):
            end = min(start + ROWS_PER_CHUNK, total_rows)
            chunk_df = df.iloc[start:end]

            rows_text = []
            for _, row in chunk_df.iterrows():
                row_str = " | ".join(f"{col}: {val}" for col, val in zip(columns, row.values))
                rows_text.append(row_str)

            content = f"Columns: {column_header}\n\n" + "\n".join(rows_text)

            blocks.append(TextBlock(
                content=content,
                metadata={
                    "file_type": ext.lstrip("."),
                    "row_range": f"{start + 1}-{end}",
                    "total_rows": total_rows,
                    "columns": columns,
                },
            ))

        if not blocks:
            blocks.append(TextBlock(
                content="[Empty spreadsheet]",
                metadata={"file_type": ext.lstrip(".")},
            ))

        return blocks
