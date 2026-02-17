import hmac
import logging
import time
from collections import defaultdict
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

# --- Simple in-memory rate limiter ---
_rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_AUTH = 5      # max auth attempts per window
RATE_LIMIT_API = 60      # max API requests per window


def _is_trusted_proxy(ip: str) -> bool:
    """Check if IP is from Docker internal network (Caddy reverse proxy)."""
    # Docker Compose default bridge: 172.16-31.x.x, 192.168.x.x, 10.x.x.x
    return (
        ip.startswith("172.") or ip.startswith("192.168.") or ip.startswith("10.")
        or ip in ("127.0.0.1", "::1")
    )


def _get_client_ip(request: Request) -> str:
    """Get real client IP, only trusting X-Forwarded-For from known proxies.
    Caddy (in Docker) sets X-Forwarded-For — we only trust it from internal IPs."""
    direct_ip = request.client.host if request.client else "unknown"
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded and _is_trusted_proxy(direct_ip):
        # Only trust X-Forwarded-For when request came from Caddy (internal network)
        return forwarded.split(",")[0].strip()
    return direct_ip


def _check_rate_limit(key: str, max_requests: int) -> bool:
    """Returns True if request is allowed, False if rate-limited."""
    now = time.monotonic()
    window_start = now - RATE_LIMIT_WINDOW
    # Clean old entries
    timestamps = [t for t in _rate_limit_store[key] if t > window_start]
    if not timestamps:
        # Clean up stale key to prevent memory leak from old IPs
        _rate_limit_store.pop(key, None)
    else:
        _rate_limit_store[key] = timestamps
    if len(timestamps) >= max_requests:
        return False
    _rate_limit_store[key].append(now)
    return True

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
    from app.core.llm import check_groq, check_openrouter, get_active_provider

    if check_ollama_embeddings():
        logger.info(f"Ollama embeddings ready ({settings.embedding_model})")
    else:
        logger.warning(f"Ollama embedding model '{settings.embedding_model}' not available - will use fallback")

    if settings.groq_api_key and check_groq():
        logger.info(f"Groq ready ({settings.groq_model})")
    elif settings.groq_api_key:
        logger.warning("Groq API key set but connection failed")

    if settings.openrouter_api_key and check_openrouter():
        logger.info(f"OpenRouter ready ({settings.openrouter_model})")
    elif settings.openrouter_api_key:
        logger.warning("OpenRouter API key set but connection failed")

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
    # Disable public API docs — prevents full API schema reconnaissance
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
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
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# --- Content Security Policy ---
_CSP = "; ".join([
    "default-src 'self'",
    "script-src 'self' cdn.jsdelivr.net cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdnjs.cloudflare.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
])


# --- Security headers middleware ---
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = _CSP
    # Behind Caddy, internal scheme is always HTTP — check X-Forwarded-Proto
    if request.url.scheme == "https" or request.headers.get("x-forwarded-proto") == "https":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# --- Authentication middleware ---
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    path = request.url.path

    # Rate limit auth endpoint BEFORE skipping public paths (brute-force protection)
    if path == "/api/v1/auth/verify":
        client_ip = _get_client_ip(request)
        if not _check_rate_limit(f"auth:{client_ip}", RATE_LIMIT_AUTH):
            logger.warning(f"Auth rate limit exceeded for {client_ip}")
            return JSONResponse(status_code=429, content={"detail": "Too many attempts. Try again later."})

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
        client_ip = _get_client_ip(request)

        # Rate limit regular API calls (auth/verify already handled above)
        if not _check_rate_limit(f"api:{client_ip}", RATE_LIMIT_API):
            return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded. Try again later."})

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


@app.get("/robots.txt")
async def robots_txt():
    """Block all search engine indexing."""
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse("User-agent: *\nDisallow: /\n")


app.include_router(api_router, prefix="/api/v1")

# Mount custom static UI (replaces Gradio)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

UI_DIR = Path(__file__).resolve().parent.parent / "ui" / "static"


@app.get("/ui")
@app.get("/ui/")
async def serve_ui():
    return FileResponse(
        UI_DIR / "index.html",
        headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"},
    )


@app.get("/ui/static/app.js")
async def serve_app_js():
    """Serve app.js with no-cache to prevent stale JS issues."""
    return FileResponse(
        UI_DIR / "app.js",
        headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"},
        media_type="application/javascript",
    )


app.mount("/ui/static", StaticFiles(directory=str(UI_DIR)), name="static")
