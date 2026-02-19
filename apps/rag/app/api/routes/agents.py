import logging

from fastapi import APIRouter, HTTPException

from app.core.database import (
    create_agent,
    list_agents,
    get_agent,
    update_agent,
    delete_agent,
)
from app.core.vectorstore import list_collections
from app.models.schemas import AgentCreate, AgentUpdate, AgentInfo

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/agents", tags=["agents"])


def _get_existing_collection_names() -> set[str]:
    """Get all collection names currently in ChromaDB."""
    try:
        collections = list_collections()
        return {c.name if hasattr(c, "name") else str(c) for c in collections}
    except Exception:
        return set()


def _validate_agent_collections(collections: list[str]) -> list[str]:
    """Return list of collection names that don't exist in ChromaDB."""
    if not collections:
        return []
    existing = _get_existing_collection_names()
    return [c for c in collections if c not in existing]


@router.get("", response_model=list[AgentInfo])
def list_all_agents():
    return list_agents()


@router.post("", response_model=AgentInfo)
def create_new_agent(body: AgentCreate):
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="Agent naam is verplicht")
    if not body.system_prompt.strip():
        raise HTTPException(status_code=400, detail="System prompt is verplicht")

    # Warn about missing collections (don't block creation)
    missing = _validate_agent_collections(body.collections)
    if missing:
        logger.warning(f"Agent '{body.name}' references non-existent collections: {missing}")

    agent = create_agent(
        name=body.name.strip(),
        description=body.description.strip(),
        system_prompt=body.system_prompt.strip(),
        collections=body.collections,
        temperature=body.temperature,
        top_k=body.top_k,
        icon=body.icon.strip() or "E",
        use_multi_query=body.use_multi_query,
    )
    return agent


@router.get("/{agent_id}", response_model=AgentInfo)
def get_agent_by_id(agent_id: str):
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent niet gevonden")
    return agent


@router.put("/{agent_id}", response_model=AgentInfo)
def update_agent_by_id(agent_id: str, body: AgentUpdate):
    existing = get_agent(agent_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Agent niet gevonden")

    data = body.model_dump(exclude_none=True)

    # Validate non-empty required fields if provided
    if "name" in data and not data["name"].strip():
        raise HTTPException(status_code=400, detail="Agent naam mag niet leeg zijn")
    if "system_prompt" in data and not data["system_prompt"].strip():
        raise HTTPException(status_code=400, detail="System prompt mag niet leeg zijn")

    # Strip text fields
    for field in ("name", "description", "system_prompt", "icon"):
        if field in data and isinstance(data[field], str):
            data[field] = data[field].strip()

    # Warn about missing collections
    if "collections" in data:
        missing = _validate_agent_collections(data["collections"])
        if missing:
            logger.warning(f"Agent update references non-existent collections: {missing}")

    updated = update_agent(agent_id, **data)
    return updated


@router.delete("/{agent_id}")
def delete_agent_by_id(agent_id: str):
    existing = get_agent(agent_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Agent niet gevonden")
    delete_agent(agent_id)
    return {"deleted": True, "id": agent_id}
