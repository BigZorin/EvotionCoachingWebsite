#!/bin/bash
# ============================================================
# Evotion RAG — Daily Backup Script
# Backs up ChromaDB + SQLite databases from Docker volume
#
# Usage:
#   ./backup.sh                     # Manual backup
#   crontab: 0 3 * * * /opt/evotion-rag/apps/rag/scripts/backup.sh
#
# Backups are stored in /opt/evotion-backups/ with 30-day retention.
# ============================================================

set -euo pipefail

BACKUP_DIR="/opt/evotion-backups"
CONTAINER="evotion-rag"
DATE=$(date +%Y-%m-%d_%H%M)
RETAIN_DAYS=30

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting Evotion RAG backup..."

# Copy data from container to temp dir
TMPDIR=$(mktemp -d)
docker cp "$CONTAINER":/app/data "$TMPDIR/data" 2>/dev/null

if [ ! -d "$TMPDIR/data" ]; then
    echo "[$(date)] ERROR: Failed to copy data from container"
    rm -rf "$TMPDIR"
    exit 1
fi

# Create compressed archive
BACKUP_FILE="$BACKUP_DIR/evotion-rag-$DATE.tar.gz"
tar -czf "$BACKUP_FILE" -C "$TMPDIR" data

# Cleanup temp
rm -rf "$TMPDIR"

# Show backup size
SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup created: $BACKUP_FILE ($SIZE)"

# Remove backups older than retention period
DELETED=$(find "$BACKUP_DIR" -name "evotion-rag-*.tar.gz" -mtime +$RETAIN_DAYS -delete -print | wc -l)
if [ "$DELETED" -gt 0 ]; then
    echo "[$(date)] Cleaned up $DELETED old backup(s)"
fi

echo "[$(date)] Backup complete. Total backups:"
ls -lh "$BACKUP_DIR"/evotion-rag-*.tar.gz 2>/dev/null | wc -l
echo " backups stored in $BACKUP_DIR"
