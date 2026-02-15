from fastapi import APIRouter

from app.api.routes import health, documents, query, collections, chat, agents

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(documents.router)
api_router.include_router(query.router)
api_router.include_router(collections.router)
api_router.include_router(chat.router)
api_router.include_router(agents.router)
