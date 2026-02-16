import hmac
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from app.api.router import api_router
from app.config import settings
from app.core.vectorstore import get_chroma_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths that don't require authentication
PUBLIC_PATHS = {"/api/v1/health", "/api/v1/auth/verify"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting RAG service...")

    # Ensure directories exist
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    Path(settings.chroma_persist_dir).mkdir(parents=True, exist_ok=True)

    # Initialize ChromaDB
    get_chroma_client()
    logger.info("ChromaDB initialized")

    # Initialize chat database
    from app.core.database import init_db
    init_db()
    logger.info("Chat database initialized")

    # Initialize usage tracking
    from app.core.usage_tracker import init_usage_table
    init_usage_table()
    logger.info("Usage tracking initialized")

    # Check LLM connectivity
    from app.core.embeddings import check_ollama_embeddings
    from app.core.llm import check_ollama_generation, check_groq, get_active_provider

    if check_ollama_embeddings():
        logger.info(f"Ollama embeddings ready ({settings.embedding_model})")
    else:
        logger.warning(f"Ollama embedding model '{settings.embedding_model}' not available - will use fallback")

    if settings.groq_api_key and check_groq():
        logger.info(f"Groq ready ({settings.groq_model})")
    elif settings.groq_api_key:
        logger.warning("Groq API key set but connection failed")

    if check_ollama_generation():
        logger.info(f"Ollama generation ready ({settings.ollama_generation_model})")

    logger.info(f"Active LLM provider: {get_active_provider()}")

    # Auth safety: if auth is enabled but no token is set, refuse to start unprotected
    if settings.auth_enabled and not settings.auth_token:
        logger.critical(
            "AUTH_ENABLED=true but AUTH_TOKEN is empty! "
            "API is UNPROTECTED. Set AUTH_TOKEN in .env or disable auth with AUTH_ENABLED=false."
        )
        raise SystemExit("Refusing to start: AUTH_ENABLED=true but AUTH_TOKEN is not set.")
    logger.info(f"Authentication: {'enabled' if settings.auth_enabled else 'disabled'}")

    yield

    # Shutdown
    logger.info("Shutting down RAG service...")


app = FastAPI(
    title="Evotion RAG Service",
    description="Local RAG system for document processing and intelligent Q&A",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS: restrict to our own domain (Caddy proxies from this origin)
_allowed_origins = [
    "https://rag.evotiondata.com",
    "http://localhost:8000",   # local development
    "http://127.0.0.1:8000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Authentication middleware ---
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    path = request.url.path

    # Skip auth for: UI pages, static files, public API paths
    if (
        not settings.auth_enabled
        or not settings.auth_token
        or path in ("/", "")
        or path.startswith("/ui")
        or path in PUBLIC_PATHS
    ):
        return await call_next(request)

    # All other /api/ routes require auth
    if path.startswith("/api/"):
        auth_header = request.headers.get("authorization", "")
        if not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Authentication required"})
        token = auth_header[7:]
        if not hmac.compare_digest(token, settings.auth_token):
            return JSONResponse(status_code=401, content={"detail": "Invalid token"})

    return await call_next(request)


# --- Auth verify endpoint ---
@app.post("/api/v1/auth/verify")
async def verify_token(request: Request):
    """Check if a token is valid. Returns 200 if OK, 401 if not."""
    if not settings.auth_enabled or not settings.auth_token:
        return {"authenticated": True, "auth_required": False}

    auth_header = request.headers.get("authorization", "")
    if not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Token required"})
    token = auth_header[7:]
    if not hmac.compare_digest(token, settings.auth_token):
        return JSONResponse(status_code=401, content={"detail": "Invalid token"})
    return {"authenticated": True}


@app.get("/")
async def root_redirect():
    return RedirectResponse(url="/ui/")


app.include_router(api_router, prefix="/api/v1")

# Mount custom static UI (replaces Gradio)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

UI_DIR = Path(__file__).resolve().parent.parent / "ui" / "static"


@app.get("/ui")
@app.get("/ui/")
async def serve_ui():
    return FileResponse(UI_DIR / "index.html")


app.mount("/ui/static", StaticFiles(directory=str(UI_DIR)), name="static")
