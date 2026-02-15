import re
from pathlib import Path

import chardet

from app.ingestion.processors.base import BaseProcessor, TextBlock

# Language detection by extension
LANGUAGE_MAP = {
    ".py": "python",
    ".js": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".jsx": "javascript",
    ".java": "java",
    ".go": "go",
    ".rs": "rust",
    ".rb": "ruby",
    ".php": "php",
    ".c": "c",
    ".cpp": "cpp",
    ".h": "c",
    ".hpp": "cpp",
    ".cs": "csharp",
    ".swift": "swift",
    ".kt": "kotlin",
    ".scala": "scala",
    ".r": "r",
    ".sql": "sql",
    ".sh": "shell",
    ".bash": "shell",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
    ".xml": "xml",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
}

# Patterns that indicate function/class boundaries per language
SPLIT_PATTERNS = {
    "python": r"^(?:class |def |async def )",
    "javascript": r"^(?:function |class |const \w+ = (?:async )?\(|export (?:default )?(?:function|class) )",
    "typescript": r"^(?:function |class |const \w+ = (?:async )?\(|export (?:default )?(?:function|class|interface|type) |interface |type )",
    "java": r"^(?:\s*(?:public|private|protected)?\s*(?:static\s+)?(?:class|interface|enum|void|int|String|boolean|double|float|long) )",
    "go": r"^(?:func |type )",
}


class CodeProcessor(BaseProcessor):
    def supported_extensions(self) -> list[str]:
        return list(LANGUAGE_MAP.keys())

    def extract(self, file_path: Path) -> list[TextBlock]:
        raw = file_path.read_bytes()
        detected = chardet.detect(raw)
        encoding = detected.get("encoding", "utf-8") or "utf-8"
        content = raw.decode(encoding, errors="replace")

        ext = file_path.suffix.lower()
        language = LANGUAGE_MAP.get(ext, "unknown")

        # Extract imports section
        lines = content.split("\n")
        import_lines = self._extract_imports(lines, language)
        imports_block = "\n".join(import_lines) if import_lines else ""

        # Split by function/class boundaries
        blocks = self._split_by_definitions(content, language, imports_block, file_path)

        if not blocks:
            blocks = [TextBlock(
                content=content,
                metadata={
                    "file_type": "code",
                    "language": language,
                    "file_path": str(file_path.name),
                },
            )]

        return blocks

    def _extract_imports(self, lines: list[str], language: str) -> list[str]:
        import_lines = []
        for line in lines:
            stripped = line.strip()
            if language == "python" and (stripped.startswith("import ") or stripped.startswith("from ")):
                import_lines.append(line)
            elif language in ("javascript", "typescript") and (
                stripped.startswith("import ") or stripped.startswith("const ") and "require(" in stripped
            ):
                import_lines.append(line)
            elif language == "go" and stripped.startswith("import"):
                import_lines.append(line)
            elif language == "java" and (stripped.startswith("import ") or stripped.startswith("package ")):
                import_lines.append(line)
        return import_lines

    def _split_by_definitions(
        self, content: str, language: str, imports_block: str, file_path: Path
    ) -> list[TextBlock]:
        pattern = SPLIT_PATTERNS.get(language)
        if not pattern:
            return []

        lines = content.split("\n")
        blocks: list[TextBlock] = []
        current_block: list[str] = []
        current_name = ""

        for line in lines:
            if re.match(pattern, line, re.MULTILINE):
                # Save previous block
                if current_block:
                    block_content = "\n".join(current_block).strip()
                    if block_content and len(block_content) > 20:
                        full_content = f"{imports_block}\n\n{block_content}" if imports_block else block_content
                        blocks.append(TextBlock(
                            content=full_content,
                            metadata={
                                "file_type": "code",
                                "language": language,
                                "definition_name": current_name,
                                "file_path": str(file_path.name),
                            },
                        ))
                current_block = [line]
                current_name = line.strip().split("(")[0].split(":")[0].strip()
            else:
                current_block.append(line)

        # Save last block
        if current_block:
            block_content = "\n".join(current_block).strip()
            if block_content and len(block_content) > 20:
                full_content = f"{imports_block}\n\n{block_content}" if imports_block else block_content
                blocks.append(TextBlock(
                    content=full_content,
                    metadata={
                        "file_type": "code",
                        "language": language,
                        "definition_name": current_name,
                        "file_path": str(file_path.name),
                    },
                ))

        return blocks
