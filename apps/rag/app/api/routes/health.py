from fastapi import APIRouter

from app.core.embeddings import check_ollama_embeddings
from app.core.llm import check_ollama_generation, check_groq, check_openrouter, list_available_models, get_active_provider
from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    ollama_embed = check_ollama_embeddings()
    groq_ok = check_groq()
    openrouter_ok = check_openrouter()
    ollama_gen = check_ollama_generation()

    # System is OK if embeddings work AND at least one LLM is available
    llm_ok = groq_ok or openrouter_ok or ollama_gen

    return {
        "status": "ok" if (ollama_embed and llm_ok) else "degraded",
        "ollama_embeddings": ollama_embed,
        "groq": groq_ok,
        "openrouter": openrouter_ok,
        "ollama_generation": ollama_gen,
        "active_provider": get_active_provider(),
        "chroma": True,
    }


@router.get("/health/models")
def list_models():
    available = list_available_models()
    return {
        "embedding_model": settings.embedding_model,
        "active_provider": get_active_provider(),
        "available_models": available,
    }


@router.get("/health/system-info")
def system_info():
    """Return comprehensive system documentation for the UI docs page."""
    return {
        "architecture": {
            "title": "Systeem Architectuur",
            "components": [
                {"name": "FastAPI Backend", "description": "REST API server die alle verzoeken afhandelt", "status": "active"},
                {"name": "Groq LLM (Primair)", "description": f"Cloud LLM ({settings.groq_model}) voor snelle antwoordgeneratie", "model": settings.groq_model},
                {"name": "OpenRouter (Fallback)", "description": f"Cloud LLM fallback ({settings.openrouter_model}) — automatisch actief als Groq faalt", "model": settings.openrouter_model},
                {"name": "Ollama LLM (Lokaal)", "description": f"Lokale LLM fallback ({settings.ollama_generation_model}) — laatste redmiddel als beide cloud providers falen", "model": settings.ollama_generation_model},
                {"name": "Ollama Embeddings", "description": f"Lokale embedding-engine ({settings.embedding_model}) voor vectorisatie", "model": settings.embedding_model},
                {"name": "ChromaDB", "description": "Lokale vector database voor opslag en zoeken van document-chunks"},
                {"name": "Cross-Encoder", "description": "Re-ranking model (ms-marco-MiniLM-L-6-v2) voor nauwkeurigere resultaten"},
                {"name": "BM25", "description": "Keyword-gebaseerde zoekindex voor hybride retrieval (max 10.000 docs per zoekopdracht)"},
            ],
        },
        "ingestion": {
            "title": "Document Verwerking (Ingestion Pipeline)",
            "steps": [
                {"step": 1, "name": "Bestandsdetectie", "description": "Automatische herkenning van bestandstype via extensie en MIME-type"},
                {"step": 2, "name": "Tekst Extractie", "description": "Processor-specifieke extractie: PyMuPDF (PDF), python-docx (DOCX), Pandas (CSV/XLSX), EasyOCR (afbeeldingen), Whisper/Groq (audio/video)"},
                {"step": 3, "name": "Chunking", "description": f"Tekst wordt opgesplitst in chunks van ~{settings.chunk_size} tekens met {settings.chunk_overlap} overlap. Sentence-aware overlap zorgt voor schone breekpunten"},
                {"step": 4, "name": "Contextual Headers", "description": "Elke chunk krijgt een verrijkte versie met bron + sectie header voor betere embeddings"},
                {"step": 5, "name": "Embedding", "description": f"Verrijkte tekst wordt gevectoriseerd met {settings.embedding_model} via Ollama (768 dimensies)"},
                {"step": 6, "name": "Opslag", "description": "Platte tekst + vector + metadata worden opgeslagen in ChromaDB"},
            ],
            "supported_types": [
                {"type": "PDF", "extensions": [".pdf"], "processor": "PyMuPDF — alle pagina's samengevoegd voor betere chunking"},
                {"type": "Word", "extensions": [".docx"], "processor": "python-docx — secties en headers als metadata"},
                {"type": "Tekst", "extensions": [".txt", ".md"], "processor": "Direct lezen, markdown headers als sectie-metadata"},
                {"type": "Spreadsheets", "extensions": [".csv", ".xlsx"], "processor": "Pandas — rij-gebaseerde chunks (20 rijen per chunk)"},
                {"type": "JSON", "extensions": [".json"], "processor": "Recursief flattenen naar leesbare tekst"},
                {"type": "Code", "extensions": [".py", ".ts", ".js", ".java", ".go"], "processor": "Functie/class-level splitting (1500 char chunks)"},
                {"type": "Afbeeldingen", "extensions": [".png", ".jpg", ".jpeg"], "processor": "EasyOCR tekst extractie (optioneel)"},
                {"type": "Audio/Video", "extensions": [".mp3", ".mp4", ".wav", ".m4a", ".webm"], "processor": "Groq Whisper transcriptie"},
                {"type": "URLs", "extensions": [], "processor": "Web scraping (BeautifulSoup) of YouTube transcript API"},
            ],
        },
        "retrieval": {
            "title": "Zoek & Retrieval Pipeline",
            "steps": [
                {"step": 1, "name": "Multi-Query Expansie", "description": "LLM genereert 3 alternatieve formuleringen van de vraag voor bredere dekking"},
                {"step": 2, "name": "Semantisch Zoeken", "description": f"Vector similarity search in ChromaDB over alle query-varianten (top {settings.max_context_chunks} per query)"},
                {"step": 3, "name": "BM25 Keyword Search", "description": "Parallelle keyword-matching met BM25Okapi algoritme (max 10.000 documenten per zoekopdracht)"},
                {"step": 4, "name": "Reciprocal Rank Fusion (RRF)", "description": "Samenvoegen van semantische en keyword-resultaten met RRF (k=60) — documenten die in beide methoden hoog scoren worden geprioriteerd"},
                {"step": 5, "name": "Cross-Encoder Re-ranking", "description": "Top-30 resultaten worden opnieuw gerankt met cross-encoder model (ms-marco-MiniLM-L-6-v2) voor 10-20% betere precisie"},
                {"step": 6, "name": "Threshold Filtering", "description": f"Alleen chunks met cosine distance <= {settings.similarity_threshold} worden behouden. Fallback: top 3 als niets de drempel haalt"},
                {"step": 7, "name": "Neighbor Expansion", "description": "Top 5 chunks worden uitgebreid met aangrenzende chunks (±1) uit hetzelfde document voor bredere context"},
            ],
            "settings": {
                "top_k": settings.top_k,
                "max_top_k": settings.max_top_k,
                "similarity_threshold": settings.similarity_threshold,
                "max_context_chunks": settings.max_context_chunks,
            },
        },
        "generation": {
            "title": "Antwoord Generatie",
            "features": [
                {"name": "Strikte context-binding", "description": "LLM mag ALLEEN feiten uit de aangeleverde documenten gebruiken — geen eigen kennis"},
                {"name": "Inline bronverwijzingen", "description": "Elk antwoord bevat [1], [2] etc. citaties die verwijzen naar specifieke bronpassages"},
                {"name": "Anti-hallucinatie regels", "description": "Expliciete instructies om ontbrekende informatie te benoemen i.p.v. te verzinnen"},
                {"name": "Temperatuur 0.3", "description": "Lage temperatuur voor feitelijke, consistente antwoorden (configureerbaar per agent)"},
                {"name": "Gespreksgeheugen", "description": "Chat-modus onthoudt eerdere berichten, met automatische samenvatting na 10 berichten"},
                {"name": "Follow-up suggesties", "description": "Elk antwoord eindigt met 3 relevante vervolgvragen"},
            ],
        },
        "chat": {
            "title": "Chat Functies",
            "features": [
                {"name": "Sessie Management", "description": "Meerdere gesprekken opslaan en laden, automatische titels"},
                {"name": "Smart History", "description": f"Laatste 6 berichten worden volledig meegestuurd, oudere berichten worden samengevat (na {settings.summarize_after_messages} berichten)"},
                {"name": "Agent Modus", "description": "Gespecialiseerde AI-assistenten met eigen system prompt, collecties en instellingen"},
                {"name": "Streaming", "description": "Real-time token-voor-token antwoorden via Server-Sent Events (SSE)"},
                {"name": "Feedback", "description": "Duim omhoog/omlaag per antwoord voor kwaliteitstracking"},
                {"name": "Export", "description": "Gesprekken exporteren als Markdown bestand"},
            ],
        },
        "stability": {
            "title": "Stabiliteit & Beveiliging",
            "features": [
                {"name": "SSRF Bescherming", "description": "URL-ingestion blokkeert private IP-adressen (RFC 1918), loopback, link-local en cloud metadata endpoints. DNS-resolutie wordt gevalideerd vóór het opvragen."},
                {"name": "Upload Limiet", "description": f"Bestanden groter dan {settings.max_file_size_mb} MB worden geweigerd vóór verwerking om geheugen- en opslagmisbruik te voorkomen"},
                {"name": "CORS Restrictie", "description": "Alleen verzoeken van rag.evotiondata.com en localhost worden geaccepteerd met beperkte HTTP-methoden (GET/POST/DELETE/OPTIONS) en headers (Content-Type/Authorization)"},
                {"name": "Embedding Dimensie-check", "description": "Fallback naar sentence-transformers (384-dim) wordt geblokkeerd als de collectie 768-dim vectors verwacht — voorkomt ChromaDB-fouten"},
                {"name": "Triple-Provider Failover", "description": "Automatische fallback-keten: Groq → OpenRouter → Ollama. Als alle drie falen, krijgt de client een duidelijke foutmelding"},
                {"name": "Collectienaam Validatie", "description": "Alle collectie-endpoints valideren namen op alfanumerieke tekens, streepjes en underscores (1-64 chars, moet starten met alfanumeriek)"},
                {"name": "Auth Startup Check", "description": "Server weigert te starten als AUTH_ENABLED=true maar AUTH_TOKEN leeg is — voorkomt onbeveiligde API"},
                {"name": "API Timeouts", "description": f"Groq: 60s, OpenRouter: {settings.openrouter_timeout}s, Ollama generatie: 120s, Ollama embeddings: 30s — voorkomt hangende requests"},
                {"name": "Database Connection Management", "description": "Context managers (with-statement) garanderen dat SQLite-connecties altijd worden gesloten, ook bij fouten"},
                {"name": "BM25 Memory Cap", "description": "Maximum 10.000 documenten per BM25-zoekopdracht om geheugenoverloop te voorkomen bij grote collecties"},
                {"name": "SSE Error Handling", "description": "Streaming responses sturen een error-event naar de client bij onverwachte fouten in plaats van stil te crashen"},
                {"name": "Thread-Safe Singletons", "description": "Alle lazy-loaded clients (Groq, OpenRouter, Ollama, embeddings, cross-encoder) gebruiken double-check locking om race conditions bij concurrent requests te voorkomen"},
                {"name": "Query Parameter Limieten", "description": "Alle paginatie-parameters zijn geclampt: sessies max 500, chunks max 500, cleanup min_chars 0-10.000 — voorkomt resource exhaustion via onbegrensde queries"},
                {"name": "Generieke Foutmeldingen", "description": "SSE streaming stuurt generieke foutberichten naar de client — volledige foutdetails worden alleen server-side gelogd, geen systeeminfo-lekkage"},
                {"name": "Non-Root Container", "description": "Docker container draait als appuser (UID 1000) in plaats van root — beperkt impact van container-escapes"},
                {"name": "Zero-Cost Health Checks", "description": "Health checks gebruiken models.list() in plaats van chat completions — kost geen API-quota (voorheen ~2880 Groq-requests/dag)"},
                {"name": "Per-Response Provider Tracking", "description": "Elke streaming response bevat in het 'done' event de daadwerkelijk gebruikte LLM provider — UI toont dit als label onder elk antwoord"},
                {"name": "RRF Score Blending", "description": "Reciprocal Rank Fusion gebruikt gewogen gemiddelde (40% origineel + 60% RRF positie) voor nauwkeurigere relevantie-scores"},
                {"name": "Chat History Truncatie", "description": "Lange assistant-antwoorden in gesprekshistorie worden afgekapt op 2000 tekens om prompt-overflow te voorkomen"},
            ],
        },
        "config": {
            "title": "Huidige Configuratie",
            "values": {
                "LLM Provider (Primair)": settings.llm_provider,
                "Groq Model": settings.groq_model,
                "OpenRouter Model (Fallback)": settings.openrouter_model,
                "Ollama Generation Model (Lokaal)": settings.ollama_generation_model,
                "Embedding Model": settings.embedding_model,
                "Chunk Size": f"{settings.chunk_size} tekens",
                "Chunk Overlap": f"{settings.chunk_overlap} tekens",
                "Top K (standaard)": settings.top_k,
                "Similarity Threshold": settings.similarity_threshold,
                "Max Context Chunks": settings.max_context_chunks,
                "Max History Messages": settings.max_history_messages,
                "Summarize After": f"{settings.summarize_after_messages} berichten",
                "Max Upload Size": f"{settings.max_file_size_mb} MB",
                "Groq Timeout": "60 seconden",
                "OpenRouter Timeout": f"{settings.openrouter_timeout} seconden",
                "Ollama Generation Timeout": "120 seconden",
                "Ollama Embedding Timeout": "30 seconden",
                "BM25 Max Documents": "10.000",
            },
        },
    }
