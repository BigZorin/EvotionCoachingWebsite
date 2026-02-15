#!/bin/bash
# ============================================================
# Evotion RAG — Server Setup Script
# Run this on a fresh Ubuntu 24.04 VPS (Hetzner CX32)
# Usage: bash setup.sh
# ============================================================
set -e

REPO_URL="https://github.com/BigZorin/EvotionCoachingWebsite.git"
INSTALL_DIR="/opt/evotion-rag"
RAG_DIR="$INSTALL_DIR/apps/rag"

echo ""
echo "========================================="
echo "  Evotion RAG — Server Setup"
echo "========================================="
echo ""

# --- 1. System update ---
echo "[1/7] Updating system..."
apt-get update -qq && apt-get upgrade -y -qq

# --- 2. Install Docker ---
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "  Docker installed."
else
    echo "  Docker already installed."
fi

# Ensure Docker Compose v2 plugin
if ! docker compose version &> /dev/null; then
    apt-get install -y -qq docker-compose-plugin
fi

# --- 3. Install useful tools ---
echo "[3/7] Installing tools..."
apt-get install -y -qq git curl ufw

# --- 4. Firewall ---
echo "[4/7] Configuring firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo "  Firewall: SSH + HTTP + HTTPS open."

# --- 5. Clone repository ---
echo "[5/7] Cloning repository..."
if [ -d "$INSTALL_DIR/.git" ]; then
    echo "  Repository exists, pulling latest..."
    cd "$INSTALL_DIR" && git pull
else
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

# --- 6. Create production .env ---
echo "[6/7] Setting up environment..."
cd "$RAG_DIR"

if [ ! -f .env ]; then
    cp .env.production.example .env
    echo ""
    echo "  ================================================"
    echo "  IMPORTANT: Edit .env with your production values!"
    echo "  ================================================"
    echo "  Run: nano $RAG_DIR/.env"
    echo ""
    echo "  Required changes:"
    echo "    AUTH_TOKEN=<choose a strong password>"
    echo "    GROQ_API_KEY=<your groq api key>"
    echo ""
    read -p "  Press Enter after editing .env (or Ctrl+C to edit later)..."
else
    echo "  .env already exists, keeping current values."
fi

# --- 7. Build and start ---
echo "[7/7] Building and starting services..."
cd "$RAG_DIR"
docker compose up -d --build

# --- 8. Pull Ollama models ---
echo ""
echo "Pulling Ollama models (this takes 2-5 minutes)..."
echo "  Waiting for Ollama to be ready..."
sleep 10

# Wait for Ollama to be ready
for i in {1..30}; do
    if docker compose exec -T ollama ollama list > /dev/null 2>&1; then
        echo "  Ollama is ready!"
        break
    fi
    echo "  Waiting for Ollama... ($i/30)"
    sleep 5
done

echo "  Pulling nomic-embed-text (embeddings, ~274MB)..."
docker compose exec -T ollama ollama pull nomic-embed-text

echo "  Pulling llama3.1:8b (fallback LLM, ~4.7GB)..."
docker compose exec -T ollama ollama pull llama3.1:8b

# --- 9. Restart RAG to pick up Ollama ---
echo ""
echo "Restarting RAG app to connect to Ollama..."
docker compose restart rag

# --- Done ---
SERVER_IP=$(hostname -I | awk '{print $1}')
echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "  RAG URL:    http://$SERVER_IP"
echo "  Login:      Use the AUTH_TOKEN from .env"
echo ""
echo "  Useful commands:"
echo "    cd $RAG_DIR"
echo "    docker compose logs -f          # View logs"
echo "    docker compose ps               # Service status"
echo "    docker compose restart           # Restart all"
echo "    bash deploy/update.sh            # Update to latest"
echo ""
