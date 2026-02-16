# ============================================================
# Evotion RAG — Production Dockerfile
# Runs alongside Ollama container (see docker-compose.yml)
# ============================================================

FROM python:3.12-slim AS base

# Prevent Python from buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install PyTorch (CPU-only index for x86, default for ARM64)
RUN ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then \
        pip install --no-cache-dir torch --extra-index-url https://download.pytorch.org/whl/cpu; \
    else \
        pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu; \
    fi

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ============================================================
# Production stage
# ============================================================
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install ffmpeg for audio/video processing + CA certificates for HTTPS
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy installed packages from build stage
COPY --from=base /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=base /usr/local/bin /usr/local/bin

# Create data directories
RUN mkdir -p /app/data/chroma_db /app/data/uploads

# Copy application code
COPY app/ ./app/
COPY ui/ ./ui/

# Default environment variables
ENV CHROMA_PERSIST_DIR=/app/data/chroma_db \
    UPLOAD_DIR=/app/data/uploads \
    AUTH_ENABLED=true \
    LLM_PROVIDER=groq \
    PORT=8000

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health')" || exit 1

# Start the server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
