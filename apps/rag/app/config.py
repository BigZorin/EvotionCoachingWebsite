from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Authentication
    auth_token: str = ""
    auth_enabled: bool = True

    # Groq (primary LLM)
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"

    # Ollama (embeddings + fallback LLM)
    ollama_base_url: str = "http://localhost:11434"
    embedding_model: str = "nomic-embed-text"
    ollama_generation_model: str = "llama3.1:8b"

    # LLM provider: "groq" or "ollama"
    llm_provider: str = "groq"

    # ChromaDB
    chroma_persist_dir: str = "./data/chroma_db"

    # Chunking
    chunk_size: int = 1000
    chunk_overlap: int = 200

    # Upload
    max_file_size_mb: int = 100
    upload_dir: str = "./data/uploads"

    # Retrieval
    top_k: int = 15
    max_top_k: int = 50
    similarity_threshold: float = 0.65

    # Chat
    max_context_chunks: int = 30
    max_history_messages: int = 20
    summarize_after_messages: int = 10

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
