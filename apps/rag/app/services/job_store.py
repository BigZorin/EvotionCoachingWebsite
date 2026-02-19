"""Simple thread-safe in-memory job store for background upload processing."""

import logging
import threading
import time
import uuid

logger = logging.getLogger(__name__)

_jobs: dict[str, dict] = {}
_lock = threading.Lock()

# Auto-expire completed/failed jobs after 1 hour
JOB_TTL_SECONDS = 3600


def create_job(filename: str, collection: str) -> str:
    """Create a new job and return its ID."""
    job_id = str(uuid.uuid4())
    with _lock:
        _jobs[job_id] = {
            "id": job_id,
            "status": "processing",
            "filename": filename,
            "collection": collection,
            "created_at": time.time(),
            "result": None,
            "error": None,
        }
    return job_id


def update_job(
    job_id: str,
    status: str,
    result: dict | None = None,
    error: str | None = None,
):
    """Update job status and result."""
    with _lock:
        if job_id in _jobs:
            _jobs[job_id]["status"] = status
            _jobs[job_id]["result"] = result
            _jobs[job_id]["error"] = error
            _jobs[job_id]["completed_at"] = time.time()


def get_job(job_id: str) -> dict | None:
    """Get job info. Returns None if job doesn't exist or expired."""
    with _lock:
        _cleanup_expired()
        return _jobs.get(job_id, {}).copy() if job_id in _jobs else None


def _cleanup_expired():
    """Remove completed/failed jobs older than TTL. Called under lock."""
    now = time.time()
    expired = [
        jid
        for jid, job in _jobs.items()
        if job["status"] != "processing"
        and now - job.get("completed_at", job["created_at"]) > JOB_TTL_SECONDS
    ]
    for jid in expired:
        del _jobs[jid]
