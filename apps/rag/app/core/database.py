import json
import logging
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from app.config import settings

logger = logging.getLogger(__name__)

DB_PATH = Path(settings.chroma_persist_dir).parent / "chat.db"


def _get_conn() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


@contextmanager
def _conn():
    """Context manager that guarantees connection cleanup."""
    conn = _get_conn()
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    with _conn() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL DEFAULT 'Nieuwe chat',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                collection TEXT DEFAULT NULL,
                metadata TEXT DEFAULT '{}'
            );

            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                sources TEXT DEFAULT '[]',
                created_at TEXT NOT NULL,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
            CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at DESC);

            CREATE TABLE IF NOT EXISTS agents (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT DEFAULT '',
                system_prompt TEXT NOT NULL,
                collections TEXT DEFAULT '[]',
                temperature REAL DEFAULT 0.7,
                top_k INTEGER DEFAULT 15,
                icon TEXT DEFAULT 'E',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        """)

        # Migration: add agent_id to sessions if not present
        try:
            conn.execute("ALTER TABLE sessions ADD COLUMN agent_id TEXT DEFAULT NULL")
        except Exception:
            pass  # Column already exists

        # Migration: feedback table
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS feedback (
                id TEXT PRIMARY KEY,
                message_id TEXT NOT NULL,
                session_id TEXT,
                feedback TEXT NOT NULL CHECK(feedback IN ('positive', 'negative')),
                created_at TEXT NOT NULL,
                FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_feedback_message ON feedback(message_id);
            CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
        """)

        conn.commit()


# --- Sessions ---

def create_session(title: str = "Nieuwe chat", collection: str | None = None, agent_id: str | None = None) -> dict:
    with _conn() as conn:
        session_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "INSERT INTO sessions (id, title, created_at, updated_at, collection, agent_id) VALUES (?, ?, ?, ?, ?, ?)",
            (session_id, title, now, now, collection, agent_id),
        )
        conn.commit()
        return {"id": session_id, "title": title, "created_at": now, "collection": collection, "agent_id": agent_id}


def list_sessions(limit: int = 50) -> list[dict]:
    with _conn() as conn:
        rows = conn.execute(
            "SELECT s.*, COUNT(m.id) as message_count FROM sessions s "
            "LEFT JOIN messages m ON m.session_id = s.id "
            "GROUP BY s.id ORDER BY s.updated_at DESC LIMIT ?",
            (limit,),
        ).fetchall()
        return [dict(r) for r in rows]


def get_session(session_id: str) -> dict | None:
    with _conn() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
        return dict(row) if row else None


def update_session_title(session_id: str, title: str):
    with _conn() as conn:
        now = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "UPDATE sessions SET title = ?, updated_at = ? WHERE id = ?",
            (title, now, session_id),
        )
        conn.commit()


def delete_session(session_id: str):
    with _conn() as conn:
        conn.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
        conn.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
        conn.commit()


# --- Messages ---

def add_message(
    session_id: str,
    role: str,
    content: str,
    sources: list | None = None,
) -> dict:
    with _conn() as conn:
        msg_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        sources_json = json.dumps(sources or [])

        conn.execute(
            "INSERT INTO messages (id, session_id, role, content, sources, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (msg_id, session_id, role, content, sources_json, now),
        )
        conn.execute(
            "UPDATE sessions SET updated_at = ? WHERE id = ?",
            (now, session_id),
        )
        conn.commit()
        return {"id": msg_id, "role": role, "content": content, "sources": sources or [], "created_at": now}


def get_messages(session_id: str, limit: int = 100) -> list[dict]:
    with _conn() as conn:
        rows = conn.execute(
            "SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC LIMIT ?",
            (session_id, limit),
        ).fetchall()

    messages = []
    for r in rows:
        msg = dict(r)
        msg["sources"] = json.loads(msg.get("sources", "[]"))
        messages.append(msg)
    return messages


def get_recent_context(session_id: str, max_messages: int = 10) -> list[dict]:
    """Get recent messages for conversation context."""
    with _conn() as conn:
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE session_id = ? "
            "ORDER BY created_at DESC LIMIT ?",
            (session_id, max_messages),
        ).fetchall()
        return [dict(r) for r in reversed(rows)]


# --- Agents ---

def create_agent(
    name: str,
    system_prompt: str,
    description: str = "",
    collections: list[str] | None = None,
    temperature: float = 0.7,
    top_k: int = 15,
    icon: str = "E",
) -> dict:
    with _conn() as conn:
        agent_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        collections_json = json.dumps(collections or [])
        conn.execute(
            "INSERT INTO agents (id, name, description, system_prompt, collections, temperature, top_k, icon, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (agent_id, name, description, system_prompt, collections_json, temperature, top_k, icon, now, now),
        )
        conn.commit()
        return {
            "id": agent_id, "name": name, "description": description,
            "system_prompt": system_prompt, "collections": collections or [],
            "temperature": temperature, "top_k": top_k, "icon": icon,
            "created_at": now, "updated_at": now,
        }


def _safe_parse_collections(raw: str) -> list[str]:
    """Safely parse the collections JSON field with fallback to empty list."""
    try:
        result = json.loads(raw or "[]")
        return result if isinstance(result, list) else []
    except (json.JSONDecodeError, TypeError):
        logger.warning(f"Malformed collections JSON: {raw!r}, defaulting to empty list")
        return []


def list_agents() -> list[dict]:
    with _conn() as conn:
        rows = conn.execute("SELECT * FROM agents ORDER BY created_at ASC").fetchall()

    agents = []
    for r in rows:
        agent = dict(r)
        agent["collections"] = _safe_parse_collections(agent.get("collections", "[]"))
        agents.append(agent)
    return agents


def get_agent(agent_id: str) -> dict | None:
    with _conn() as conn:
        row = conn.execute("SELECT * FROM agents WHERE id = ?", (agent_id,)).fetchone()
        if not row:
            return None
        agent = dict(row)
        agent["collections"] = _safe_parse_collections(agent.get("collections", "[]"))
        return agent


def update_agent(agent_id: str, **kwargs) -> dict | None:
    now = datetime.now(timezone.utc).isoformat()

    allowed = {"name", "description", "system_prompt", "collections", "temperature", "top_k", "icon"}
    updates = {k: v for k, v in kwargs.items() if k in allowed and v is not None}

    if "collections" in updates:
        updates["collections"] = json.dumps(updates["collections"])

    if not updates:
        return get_agent(agent_id)

    updates["updated_at"] = now
    set_clause = ", ".join(f"{k} = ?" for k in updates)
    values = list(updates.values()) + [agent_id]

    with _conn() as conn:
        conn.execute(f"UPDATE agents SET {set_clause} WHERE id = ?", values)
        conn.commit()
    return get_agent(agent_id)


def delete_agent(agent_id: str):
    with _conn() as conn:
        conn.execute("DELETE FROM agents WHERE id = ?", (agent_id,))
        conn.commit()


# --- Session search ---

def search_sessions(query: str, limit: int = 50) -> list[dict]:
    """Search sessions by title or message content."""
    with _conn() as conn:
        pattern = f"%{query}%"
        rows = conn.execute(
            """
            SELECT DISTINCT s.*, COUNT(m.id) as message_count
            FROM sessions s
            LEFT JOIN messages m ON m.session_id = s.id
            WHERE s.title LIKE ? OR s.id IN (
                SELECT DISTINCT session_id FROM messages WHERE content LIKE ?
            )
            GROUP BY s.id
            ORDER BY s.updated_at DESC
            LIMIT ?
            """,
            (pattern, pattern, limit),
        ).fetchall()
        return [dict(r) for r in rows]


# --- Feedback ---

def add_feedback(message_id: str, feedback: str):
    """Add or update feedback for a message."""
    with _conn() as conn:
        now = datetime.now(timezone.utc).isoformat()

        # Find session_id for this message
        row = conn.execute("SELECT session_id FROM messages WHERE id = ?", (message_id,)).fetchone()
        session_id = row["session_id"] if row else None

        # Upsert: delete existing feedback for this message, then insert
        conn.execute("DELETE FROM feedback WHERE message_id = ?", (message_id,))
        feedback_id = str(uuid.uuid4())
        conn.execute(
            "INSERT INTO feedback (id, message_id, session_id, feedback, created_at) VALUES (?, ?, ?, ?, ?)",
            (feedback_id, message_id, session_id, feedback, now),
        )
        conn.commit()


def get_feedback_for_message(message_id: str) -> str | None:
    """Get feedback for a specific message."""
    with _conn() as conn:
        row = conn.execute("SELECT feedback FROM feedback WHERE message_id = ?", (message_id,)).fetchone()
        return row["feedback"] if row else None


# --- Analytics ---

def get_analytics() -> dict:
    """Get analytics data for the dashboard."""
    with _conn() as conn:
        # Total counts
        total_sessions = conn.execute("SELECT COUNT(*) as c FROM sessions").fetchone()["c"]
        total_messages = conn.execute("SELECT COUNT(*) as c FROM messages").fetchone()["c"]
        total_user_msgs = conn.execute("SELECT COUNT(*) as c FROM messages WHERE role = 'user'").fetchone()["c"]
        total_agents = conn.execute("SELECT COUNT(*) as c FROM agents").fetchone()["c"]

        # Feedback stats
        positive = conn.execute("SELECT COUNT(*) as c FROM feedback WHERE feedback = 'positive'").fetchone()["c"]
        negative = conn.execute("SELECT COUNT(*) as c FROM feedback WHERE feedback = 'negative'").fetchone()["c"]

        # Messages per day (last 30 days)
        messages_per_day = conn.execute(
            """
            SELECT DATE(created_at) as day, COUNT(*) as count
            FROM messages
            WHERE created_at >= DATE('now', '-30 days')
            GROUP BY DATE(created_at)
            ORDER BY day ASC
            """
        ).fetchall()

        # Top questions (most common user messages)
        top_questions = conn.execute(
            """
            SELECT content, COUNT(*) as count
            FROM messages
            WHERE role = 'user'
            GROUP BY content
            ORDER BY count DESC
            LIMIT 10
            """
        ).fetchall()

        # Agent usage
        agent_usage = conn.execute(
            """
            SELECT a.name, a.icon, COUNT(s.id) as session_count
            FROM agents a
            LEFT JOIN sessions s ON s.agent_id = a.id
            GROUP BY a.id
            ORDER BY session_count DESC
            """
        ).fetchall()

        # Recent feedback
        recent_feedback = conn.execute(
            """
            SELECT f.feedback, f.created_at, m.content as message_preview,
                   s.title as session_title
            FROM feedback f
            JOIN messages m ON m.id = f.message_id
            LEFT JOIN sessions s ON s.id = f.session_id
            ORDER BY f.created_at DESC
            LIMIT 20
            """
        ).fetchall()

    return {
        "totals": {
            "sessions": total_sessions,
            "messages": total_messages,
            "questions": total_user_msgs,
            "agents": total_agents,
        },
        "feedback": {
            "positive": positive,
            "negative": negative,
            "total": positive + negative,
            "satisfaction_rate": round(positive / (positive + negative) * 100, 1) if (positive + negative) > 0 else None,
        },
        "messages_per_day": [{"day": r["day"], "count": r["count"]} for r in messages_per_day],
        "top_questions": [{"question": r["content"][:100], "count": r["count"]} for r in top_questions],
        "agent_usage": [{"name": r["name"], "icon": r["icon"], "sessions": r["session_count"]} for r in agent_usage],
        "recent_feedback": [
            {
                "feedback": r["feedback"],
                "created_at": r["created_at"],
                "message_preview": r["message_preview"][:120] + "..." if len(r["message_preview"]) > 120 else r["message_preview"],
                "session_title": r["session_title"],
            }
            for r in recent_feedback
        ],
    }
