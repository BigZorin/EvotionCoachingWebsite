"""
Bulk ingest: upload een hele folder recursief naar het RAG systeem.

Usage:
    cd apps/rag
    python -m scripts.bulk_ingest /pad/naar/documenten
    python -m scripts.bulk_ingest /pad/naar/documenten --collection mijn-project
    python -m scripts.bulk_ingest /pad/naar/documenten --collection mijn-project --extensions .pdf .docx .md
"""
import argparse
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.ingestion.pipeline import ingest_file
from app.ingestion.processors.registry import registry


def main():
    parser = argparse.ArgumentParser(description="Bulk ingest documenten naar het RAG systeem")
    parser.add_argument("path", help="Map met documenten om te verwerken")
    parser.add_argument("--collection", "-c", default="default", help="Collectienaam (default: 'default')")
    parser.add_argument("--extensions", "-e", nargs="*", help="Alleen deze extensies verwerken (bijv. .pdf .md)")
    parser.add_argument("--dry-run", action="store_true", help="Toon wat er verwerkt zou worden zonder het uit te voeren")
    args = parser.parse_args()

    source_dir = Path(args.path)
    if not source_dir.exists():
        print(f"Map niet gevonden: {source_dir}")
        sys.exit(1)

    # Collect all supported files
    supported = set(registry.supported_extensions())
    if args.extensions:
        filter_exts = set(e if e.startswith(".") else f".{e}" for e in args.extensions)
        supported = supported & filter_exts

    files = []
    for f in source_dir.rglob("*"):
        if f.is_file() and f.suffix.lower() in supported:
            files.append(f)

    if not files:
        print(f"Geen ondersteunde bestanden gevonden in {source_dir}")
        print(f"Ondersteunde extensies: {sorted(supported)}")
        sys.exit(0)

    files.sort(key=lambda f: f.name)

    print(f"Gevonden: {len(files)} bestanden")
    print(f"Collectie: {args.collection}")
    print(f"Extensies: {sorted(set(f.suffix.lower() for f in files))}")
    print()

    if args.dry_run:
        for f in files:
            print(f"  [DRY RUN] {f.relative_to(source_dir)}")
        print(f"\nTotaal: {len(files)} bestanden zouden worden verwerkt")
        return

    # Process files
    success = 0
    failed = 0
    total_chunks = 0
    start_time = time.time()

    for i, file_path in enumerate(files, 1):
        rel_path = file_path.relative_to(source_dir)
        progress = f"[{i}/{len(files)}]"

        try:
            result = ingest_file(file_path, collection_name=args.collection)
            status = result.get("status", "unknown")
            chunks = result.get("chunks_created", 0)
            total_chunks += chunks

            if status == "success":
                success += 1
                print(f"  {progress} OK  {rel_path} ({chunks} chunks)")
            else:
                failed += 1
                print(f"  {progress} SKIP {rel_path} ({status})")

        except Exception as e:
            failed += 1
            print(f"  {progress} FAIL {rel_path}: {e}")

    elapsed = time.time() - start_time
    print(f"\n{'='*50}")
    print(f"Klaar in {elapsed:.1f}s")
    print(f"  Geslaagd: {success}")
    print(f"  Mislukt:  {failed}")
    print(f"  Totaal chunks: {total_chunks}")
    print(f"  Collectie: {args.collection}")


if __name__ == "__main__":
    main()
