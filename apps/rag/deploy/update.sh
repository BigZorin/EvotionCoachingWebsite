#!/bin/bash
# ============================================================
# Evotion RAG — Update Script
# Pulls latest code and rebuilds the RAG container
# Usage: bash deploy/update.sh
# ============================================================
set -e

INSTALL_DIR="/opt/evotion-rag"
RAG_DIR="$INSTALL_DIR/apps/rag"

echo ""
echo "========================================="
echo "  Evotion RAG — Updating..."
echo "========================================="
echo ""

cd "$INSTALL_DIR"

# Pull latest code
echo "[1/3] Pulling latest code..."
git pull

# Rebuild and restart RAG (Ollama stays running)
echo "[2/3] Rebuilding RAG app..."
cd "$RAG_DIR"
docker compose up -d --build rag

# Wait for health check
echo "[3/3] Waiting for RAG to be healthy..."
for i in {1..20}; do
    if docker compose exec -T rag python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health')" > /dev/null 2>&1; then
        echo "  RAG is healthy!"
        break
    fi
    echo "  Waiting... ($i/20)"
    sleep 3
done

echo ""
echo "========================================="
echo "  Update Complete!"
echo "========================================="
docker compose ps
echo ""
