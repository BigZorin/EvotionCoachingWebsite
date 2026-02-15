import json
from pathlib import Path

from app.ingestion.processors.base import BaseProcessor, TextBlock


class JSONProcessor(BaseProcessor):
    def supported_extensions(self) -> list[str]:
        return [".json"]

    def extract(self, file_path: Path) -> list[TextBlock]:
        content = file_path.read_text(encoding="utf-8")
        data = json.loads(content)
        flattened = self._flatten(data)

        if not flattened:
            return [TextBlock(content="[Empty JSON]", metadata={"file_type": "json"})]

        text = "\n".join(f"{key}: {value}" for key, value in flattened)
        return [TextBlock(
            content=text,
            metadata={"file_type": "json", "keys_count": len(flattened)},
        )]

    def _flatten(self, data, prefix: str = "") -> list[tuple[str, str]]:
        """Recursively flatten nested JSON into key-value pairs."""
        items: list[tuple[str, str]] = []

        if isinstance(data, dict):
            for key, value in data.items():
                new_key = f"{prefix}.{key}" if prefix else key
                if isinstance(value, (dict, list)):
                    items.extend(self._flatten(value, new_key))
                else:
                    items.append((new_key, str(value)))
        elif isinstance(data, list):
            for i, item in enumerate(data):
                new_key = f"{prefix}[{i}]"
                if isinstance(item, (dict, list)):
                    items.extend(self._flatten(item, new_key))
                else:
                    items.append((new_key, str(item)))
        else:
            items.append((prefix or "value", str(data)))

        return items
