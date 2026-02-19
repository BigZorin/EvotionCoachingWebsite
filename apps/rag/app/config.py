from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Authentication
    auth_token: str = ""
    auth_enabled: bool = True

    # Groq (primary LLM)
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"

    # Cerebras (secondary cloud fallback — fast & free)
    cerebras_api_key: str = ""
    cerebras_model: str = "gpt-oss-120b"
    cerebras_timeout: int = 60

    # OpenRouter (tertiary cloud fallback)
    openrouter_api_key: str = ""
    openrouter_model: str = "google/gemma-3-27b-it:free"
    openrouter_timeout: int = 60

    # Ollama (embeddings only — generation is handled by cloud providers)
    ollama_base_url: str = "http://localhost:11434"
    embedding_model: str = "bge-m3"

    # LLM provider: "groq" (primary)
    llm_provider: str = "groq"

    # ChromaDB
    chroma_persist_dir: str = "./data/chroma_db"

    # Chunking
    chunk_size: int = 1000
    chunk_overlap: int = 200
    semantic_similarity_threshold: float = 0.5

    # Upload
    max_file_size_mb: int = 100
    upload_dir: str = "./data/uploads"

    # Retrieval
    top_k: int = 15
    max_top_k: int = 50
    similarity_threshold: float = 0.65

    # Chat
    max_context_chunks: int = 15
    max_history_messages: int = 20
    summarize_after_messages: int = 20

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
