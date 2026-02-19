import os
import tempfile
from pathlib import Path

import pytest


@pytest.fixture
def tmp_dir():
    with tempfile.TemporaryDirectory() as d:
        yield Path(d)


@pytest.fixture
def sample_txt_file(tmp_dir):
    f = tmp_dir / "sample.txt"
    f.write_text("This is a sample text file.\nIt has multiple lines.\nUsed for testing.", encoding="utf-8")
    return f


@pytest.fixture
def sample_md_file(tmp_dir):
    content = """# Title

Introduction paragraph.

## Section One

Content of section one with some details.

### Subsection

More detailed content here.

## Section Two

Content of section two.
"""
    f = tmp_dir / "sample.md"
    f.write_text(content, encoding="utf-8")
    return f


@pytest.fixture
def sample_json_file(tmp_dir):
    import json
    data = {
        "name": "Test",
        "nested": {"key1": "value1", "key2": 42},
        "list": [1, 2, 3],
    }
    f = tmp_dir / "sample.json"
    f.write_text(json.dumps(data), encoding="utf-8")
    return f


@pytest.fixture
def sample_csv_file(tmp_dir):
    content = "name,age,city\nAlice,30,Amsterdam\nBob,25,Rotterdam\nCharlie,35,Utrecht\n"
    f = tmp_dir / "sample.csv"
    f.write_text(content, encoding="utf-8")
    return f


@pytest.fixture
def sample_py_file(tmp_dir):
    content = '''import os
from pathlib import Path


def hello(name: str) -> str:
    """Say hello."""
    return f"Hello, {name}!"


class Calculator:
    def add(self, a: int, b: int) -> int:
        return a + b

    def subtract(self, a: int, b: int) -> int:
        return a - b
'''
    f = tmp_dir / "sample.py"
    f.write_text(content, encoding="utf-8")
    return f
