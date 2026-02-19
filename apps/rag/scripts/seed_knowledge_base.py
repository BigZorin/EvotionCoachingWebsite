"""
Seed the RAG system with existing knowledge base markdown files.

Usage:
    cd apps/rag
    python -m scripts.seed_knowledge_base
"""
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.ingestion.pipeline import ingest_file


def main():
    kb_dir = Path(__file__).parent.parent.parent / "web" / "knowledge-base"

    if not kb_dir.exists():
        print(f"Knowledge base directory not found: {kb_dir}")
        return

    md_files = list(kb_dir.glob("*.md"))
    if not md_files:
        print(f"No markdown files found in {kb_dir}")
        return

    print(f"Found {len(md_files)} knowledge base files")
    print(f"Ingesting into collection: 'coaching-knowledge'\n")

    for file_path in md_files:
        try:
            result = ingest_file(file_path, collection_name="coaching-knowledge")
            status = result.get("status", "unknown")
            chunks = result.get("chunks_created", 0)
            print(f"  {file_path.name}: {status} ({chunks} chunks)")
        except Exception as e:
            print(f"  {file_path.name}: ERROR - {e}")

    print("\nDone! Knowledge base seeded into 'coaching-knowledge' collection.")


if __name__ == "__main__":
    main()
