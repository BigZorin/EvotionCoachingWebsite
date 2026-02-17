"""
LLM API usage tracker — logs every API call and provides usage stats.

Tracks: tokens used, request count, audio seconds, costs per day.
"""

import sqlite3
import logging
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from app.config import settings

logger = logging.getLogger(__name__)

DB_PATH = Path(settings.chroma_persist_dir).parent / "chat.db"

# Approximate pricing (pay-as-you-go)
PRICING = {
    "llama-3.3-70b-versatile": {"input": 0.59 / 1_000_000, "output": 0.79 / 1_000_000},
    "llama-3.1-8b-instant": {"input": 0.05 / 1_000_000, "output": 0.08 / 1_000_000},
    "whisper-large-v3-turbo": {"per_second": 0.04 / 3600},  # ~$0.04/hour
}

# Free models (Cerebras, OpenRouter :free, local Ollama)
FREE_MODELS = {"llama-3.3-70b", "meta-llama/llama-3.3-70b-instruct:free", "llama3.2:3b"}

# Default pricing for unknown models
DEFAULT_PRICING = {"input": 0.50 / 1_000_000, "output": 0.70 / 1_000_000}


@contextmanager
def _conn():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    try:
        yield conn
    finally:
        conn.close()


def init_usage_table():
    """Create usage tracking table if it doesn't exist."""
    with _conn() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS groq_usage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                call_type TEXT NOT NULL DEFAULT 'chat',
                model TEXT NOT NULL,
                input_tokens INTEGER DEFAULT 0,
                output_tokens INTEGER DEFAULT 0,
                total_tokens INTEGER DEFAULT 0,
                audio_seconds REAL DEFAULT 0,
                estimated_cost REAL DEFAULT 0,
                metadata TEXT DEFAULT '{}'
            );

            CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON groq_usage(timestamp);
            CREATE INDEX IF NOT EXISTS idx_usage_date ON groq_usage(DATE(timestamp));
        """)
        conn.commit()


def log_llm_usage(
    model: str,
    input_tokens: int = 0,
    output_tokens: int = 0,
    total_tokens: int = 0,
):
    """Log an LLM API call."""
    if model in FREE_MODELS:
        cost = 0.0
    else:
        pricing = PRICING.get(model, DEFAULT_PRICING)
        cost = input_tokens * pricing.get("input", 0) + output_tokens * pricing.get("output", 0)

    with _conn() as conn:
        now = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "INSERT INTO groq_usage (timestamp, call_type, model, input_tokens, output_tokens, total_tokens, estimated_cost) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (now, "chat", model, input_tokens, output_tokens, total_tokens or (input_tokens + output_tokens), cost),
        )
        conn.commit()


def log_whisper_usage(model: str, audio_seconds: float):
    """Log a Whisper transcription call."""
    pricing = PRICING.get(model, {})
    cost = audio_seconds * pricing.get("per_second", 0)

    with _conn() as conn:
        now = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "INSERT INTO groq_usage (timestamp, call_type, model, audio_seconds, estimated_cost) "
            "VALUES (?, ?, ?, ?, ?)",
            (now, "whisper", model, audio_seconds, cost),
        )
        conn.commit()


def get_usage_stats() -> dict:
    """Get comprehensive usage statistics."""
    with _conn() as conn:
        # Today's usage
        today_stats = conn.execute("""
            SELECT
                COUNT(*) as requests,
                COALESCE(SUM(input_tokens), 0) as input_tokens,
                COALESCE(SUM(output_tokens), 0) as output_tokens,
                COALESCE(SUM(total_tokens), 0) as total_tokens,
                COALESCE(SUM(audio_seconds), 0) as audio_seconds,
                COALESCE(SUM(estimated_cost), 0) as cost
            FROM groq_usage
            WHERE DATE(timestamp) = DATE('now')
        """).fetchone()

        # This month's usage
        month_stats = conn.execute("""
            SELECT
                COUNT(*) as requests,
                COALESCE(SUM(input_tokens), 0) as input_tokens,
                COALESCE(SUM(output_tokens), 0) as output_tokens,
                COALESCE(SUM(total_tokens), 0) as total_tokens,
                COALESCE(SUM(audio_seconds), 0) as audio_seconds,
                COALESCE(SUM(estimated_cost), 0) as cost
            FROM groq_usage
            WHERE strftime('%Y-%m', timestamp) = strftime('%Y-%m', 'now')
        """).fetchone()

        # All time
        total_stats = conn.execute("""
            SELECT
                COUNT(*) as requests,
                COALESCE(SUM(input_tokens), 0) as input_tokens,
                COALESCE(SUM(output_tokens), 0) as output_tokens,
                COALESCE(SUM(total_tokens), 0) as total_tokens,
                COALESCE(SUM(audio_seconds), 0) as audio_seconds,
                COALESCE(SUM(estimated_cost), 0) as cost
            FROM groq_usage
        """).fetchone()

        # Daily usage (last 30 days)
        daily_usage = conn.execute("""
            SELECT
                DATE(timestamp) as day,
                COUNT(*) as requests,
                COALESCE(SUM(total_tokens), 0) as tokens,
                COALESCE(SUM(audio_seconds), 0) as audio_seconds,
                COALESCE(SUM(estimated_cost), 0) as cost
            FROM groq_usage
            WHERE timestamp >= DATE('now', '-30 days')
            GROUP BY DATE(timestamp)
            ORDER BY day ASC
        """).fetchall()

        # Usage by model
        model_usage = conn.execute("""
            SELECT
                model,
                call_type,
                COUNT(*) as requests,
                COALESCE(SUM(total_tokens), 0) as tokens,
                COALESCE(SUM(audio_seconds), 0) as audio_seconds,
                COALESCE(SUM(estimated_cost), 0) as cost
            FROM groq_usage
            GROUP BY model, call_type
            ORDER BY requests DESC
        """).fetchall()

    def _row_to_dict(row):
        return {
            "requests": row["requests"],
            "input_tokens": row["input_tokens"],
            "output_tokens": row["output_tokens"],
            "total_tokens": row["total_tokens"],
            "audio_seconds": round(row["audio_seconds"], 1),
            "estimated_cost": round(row["cost"], 4),
        }

    return {
        "today": _row_to_dict(today_stats),
        "this_month": _row_to_dict(month_stats),
        "all_time": _row_to_dict(total_stats),
        "daily_usage": [
            {
                "day": r["day"],
                "requests": r["requests"],
                "tokens": r["tokens"],
                "audio_seconds": round(r["audio_seconds"], 1),
                "cost": round(r["cost"], 4),
            }
            for r in daily_usage
        ],
        "by_model": [
            {
                "model": r["model"],
                "type": r["call_type"],
                "requests": r["requests"],
                "tokens": r["tokens"],
                "audio_seconds": round(r["audio_seconds"], 1),
                "cost": round(r["cost"], 4),
            }
            for r in model_usage
        ],
    }
