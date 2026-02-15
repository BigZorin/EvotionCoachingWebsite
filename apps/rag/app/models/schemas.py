from pydantic import BaseModel, Field


# --- Document Schemas ---

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    file_type: str = ""
    chunks_created: int
    collection: str
    content_hash: str = ""
    status: str


class BatchUploadResponse(BaseModel):
    documents: list[DocumentUploadResponse]
    total_chunks: int


class DocumentInfo(BaseModel):
    document_id: str
    filename: str
    file_type: str
    chunks_count: int
    collection: str


class DocumentListResponse(BaseModel):
    documents: list[DocumentInfo]
    total: int


# --- Query Schemas ---

class QueryRequest(BaseModel):
    question: str
    collection: str | None = None
    top_k: int = Field(default=15, ge=1, le=50)
    include_sources: bool = True
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)


class SourceReference(BaseModel):
    filename: str
    chunk_text: str
    relevance_score: float
    metadata: dict = {}


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceReference] = []
    model_used: str = ""


# --- Collection Schemas ---

class CollectionCreate(BaseModel):
    name: str
    description: str = ""


class CollectionInfo(BaseModel):
    name: str
    document_count: int = 0
    total_chunks: int = 0


class CollectionListResponse(BaseModel):
    collections: list[CollectionInfo]


# --- Agent Schemas ---

class AgentCreate(BaseModel):
    name: str
    description: str = ""
    system_prompt: str
    collections: list[str] = []  # Empty = search all
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_k: int = Field(default=15, ge=1, le=50)
    icon: str = "E"


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    system_prompt: str | None = None
    collections: list[str] | None = None
    temperature: float | None = Field(default=None, ge=0.0, le=2.0)
    top_k: int | None = Field(default=None, ge=1, le=50)
    icon: str | None = None


class AgentInfo(BaseModel):
    id: str
    name: str
    description: str = ""
    system_prompt: str
    collections: list[str] = []
    temperature: float = 0.7
    top_k: int = 15
    icon: str = "E"
    created_at: str = ""
    updated_at: str = ""
