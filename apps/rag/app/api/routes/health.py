from fastapi import APIRouter

from app.core.embeddings import check_ollama_embeddings
from app.core.llm import check_groq, check_cerebras, check_openrouter, list_available_models, get_active_provider
from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    ollama_embed = check_ollama_embeddings()
    groq_ok = check_groq()
    cerebras_ok = check_cerebras()
    openrouter_ok = check_openrouter()

    # System is OK if embeddings work AND at least one cloud LLM is available
    llm_ok = groq_ok or cerebras_ok or openrouter_ok

    return {
        "status": "ok" if (ollama_embed and llm_ok) else "degraded",
        "ollama_embeddings": ollama_embed,
        "groq": groq_ok,
        "cerebras": cerebras_ok,
        "openrouter": openrouter_ok,
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
                {"name": "Cerebras (Fallback 1)", "description": f"Cloud LLM fallback ({settings.cerebras_model}) — gratis, snel, automatisch actief als Groq faalt", "model": settings.cerebras_model},
                {"name": "OpenRouter (Fallback 2)", "description": f"Cloud LLM fallback ({settings.openrouter_model}) — automatisch actief als Groq én Cerebras falen", "model": settings.openrouter_model},
                {"name": "Ollama (Embeddings Only)", "description": f"Lokale Ollama wordt alleen gebruikt voor embeddings — niet voor LLM generatie (te traag op CPU)"},
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
                {"step": 1, "name": "Semantisch Zoeken", "description": f"Vector similarity search in ChromaDB (top {settings.max_context_chunks} resultaten). Multi-query expansie beschikbaar maar standaard uit voor snelheid"},
                {"step": 2, "name": "BM25 Keyword Search", "description": "Parallelle keyword-matching met BM25Okapi algoritme (max 10.000 documenten per zoekopdracht)"},
                {"step": 3, "name": "Reciprocal Rank Fusion (RRF)", "description": "Samenvoegen van semantische en keyword-resultaten met RRF (k=60) — documenten die in beide methoden hoog scoren worden geprioriteerd"},
                {"step": 4, "name": "Cross-Encoder Re-ranking", "description": "Top-10 resultaten worden opnieuw gerankt met cross-encoder model (ms-marco-MiniLM-L-6-v2) voor betere precisie"},
                {"step": 5, "name": "Threshold Filtering", "description": f"Alleen chunks met cosine distance <= {settings.similarity_threshold} worden behouden. Fallback: top 3 als niets de drempel haalt"},
                {"step": 6, "name": "Neighbor Expansion", "description": "Top 3 chunks worden uitgebreid met aangrenzende chunks (±1) uit hetzelfde document voor bredere context"},
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
                {"name": "Gespreksgeheugen", "description": f"Chat-modus onthoudt eerdere berichten, met gecachte samenvatting na {settings.summarize_after_messages} berichten (hergebruikt cache, alleen elke 10 berichten opnieuw samengevat)"},
                {"name": "Follow-up suggesties", "description": "Elk antwoord eindigt met 3 relevante vervolgvragen"},
            ],
        },
        "chat": {
            "title": "Chat Functies",
            "features": [
                {"name": "Sessie Management", "description": "Meerdere gesprekken opslaan en laden, automatische titels via LLM (eerste bericht → 6-woorden titel)"},
                {"name": "Smart History", "description": f"Laatste 6 berichten worden volledig meegestuurd, oudere berichten worden samengevat (na {settings.summarize_after_messages} berichten). Samenvatting wordt gecacht en alleen elke 10 nieuwe berichten vernieuwd — bespaart ~90% tokens bij lange gesprekken"},
                {"name": "Agent Modus", "description": "Gespecialiseerde AI-assistenten met eigen system prompt, collectie-scoping, temperatuur en top_k instellingen"},
                {"name": "Streaming", "description": "Real-time token-voor-token antwoorden via Server-Sent Events (SSE)"},
                {"name": "Feedback", "description": "Duim omhoog/omlaag per antwoord voor kwaliteitstracking"},
                {"name": "Export", "description": "Gesprekken exporteren als Markdown bestand"},
                {"name": "Analytics Dashboard", "description": "Gebruiksstatistieken: totaal sessies/berichten, feedback-scores, dagelijks gebruik, top-vragen, agent-gebruik en LLM kosten-tracking per provider (Groq/Cerebras/OpenRouter) inclusief streaming-calls"},
                {"name": "YouTube Transcripties", "description": "YouTube URLs worden verwerkt via de YouTube Transcript API (niet via Whisper) — sneller en gratis"},
                {"name": "Collection Cleanup", "description": "Micro-chunks (< 50 tekens) kunnen per collectie worden opgeruimd via de cleanup endpoint"},
            ],
        },
        "stability": {
            "title": "Stabiliteit & Beveiliging",
            "features": [
                {"name": "SSRF Bescherming", "description": "URL-ingestion blokkeert private IP-adressen (RFC 1918), loopback, link-local en cloud metadata endpoints. DNS-resolutie wordt gevalideerd vóór het opvragen."},
                {"name": "Upload Limiet", "description": f"Bestanden groter dan {settings.max_file_size_mb} MB worden geweigerd vóór verwerking om geheugen- en opslagmisbruik te voorkomen"},
                {"name": "CORS Restrictie", "description": "Alleen verzoeken van rag.evotiondata.com en localhost worden geaccepteerd met beperkte HTTP-methoden (GET/POST/PUT/DELETE/OPTIONS) en headers (Content-Type/Authorization)"},
                {"name": "Embedding Dimensie-check", "description": "Fallback naar sentence-transformers (384-dim) wordt geblokkeerd als de collectie 768-dim vectors verwacht — voorkomt ChromaDB-fouten"},
                {"name": "Triple-Provider Failover", "description": "Automatische fallback: Groq → Cerebras → OpenRouter. Als alle cloud-providers falen (rate limit), krijgt de gebruiker een duidelijke foutmelding i.p.v. een eindeloos wachtende Ollama-request"},
                {"name": "Collectienaam Validatie", "description": "Alle collectie-endpoints valideren namen op alfanumerieke tekens, streepjes en underscores (1-64 chars, moet starten met alfanumeriek)"},
                {"name": "Auth Startup Check", "description": "Server weigert te starten als AUTH_ENABLED=true maar AUTH_TOKEN leeg is — voorkomt onbeveiligde API"},
                {"name": "API Timeouts", "description": f"Groq: 60s, Cerebras: {settings.cerebras_timeout}s, OpenRouter: {settings.openrouter_timeout}s, Ollama embeddings: 30s — voorkomt hangende requests"},
                {"name": "Database Connection Management", "description": "Context managers (with-statement) garanderen dat SQLite-connecties altijd worden gesloten, ook bij fouten"},
                {"name": "BM25 Memory Cap", "description": "Maximum 10.000 documenten per BM25-zoekopdracht om geheugenoverloop te voorkomen bij grote collecties"},
                {"name": "SSE Error Handling", "description": "Streaming responses sturen een error-event naar de client bij onverwachte fouten in plaats van stil te crashen"},
                {"name": "Thread-Safe Singletons", "description": "Alle lazy-loaded clients (Groq, Cerebras, OpenRouter, Ollama, embeddings, cross-encoder) gebruiken double-check locking om race conditions bij concurrent requests te voorkomen"},
                {"name": "Query Parameter Limieten", "description": "Alle paginatie-parameters zijn geclampt: sessies max 500, chunks max 500, cleanup min_chars 0-10.000 — voorkomt resource exhaustion via onbegrensde queries"},
                {"name": "Generieke Foutmeldingen", "description": "SSE streaming stuurt generieke foutberichten naar de client — volledige foutdetails worden alleen server-side gelogd, geen systeeminfo-lekkage"},
                {"name": "Non-Root Container", "description": "Docker container draait als appuser (UID 1000) in plaats van root — beperkt impact van container-escapes"},
                {"name": "Zero-Cost Health Checks", "description": "Health checks gebruiken models.list() in plaats van chat completions — kost geen API-quota (voorheen ~2880 Groq-requests/dag)"},
                {"name": "Per-Response Provider Tracking", "description": "Elke streaming response bevat in het 'done' event de daadwerkelijk gebruikte LLM provider — UI toont dit als label onder elk antwoord. Elke API-call wordt in de usage database opgeslagen met provider label (groq/cerebras/openrouter) voor per-provider kostenanalyse"},
                {"name": "RRF Score Blending", "description": "Reciprocal Rank Fusion gebruikt gewogen gemiddelde (40% origineel + 60% RRF positie) voor nauwkeurigere relevantie-scores"},
                {"name": "SSRF Redirect Validatie", "description": "Na HTTP-redirects wordt het eindpunt opnieuw gevalideerd tegen private IP-adressen — voorkomt SSRF bypass via open-redirect chains"},
                {"name": "Chat History Truncatie", "description": "Lange assistant-antwoorden in gesprekshistorie worden afgekapt op 800 tekens — gebalanceerde kwaliteit vs. efficiëntie (volledige document-context blijft ongewijzigd op 15 chunks × 1000 chars)"},
                {"name": "Gecachte Samenvatting", "description": "Conversatie-samenvattingen worden opgeslagen in session metadata en pas elke 10 nieuwe berichten vernieuwd — bespaart ~90% tokens bij lange gesprekken (voorheen: elke bericht opnieuw samengevat)"},
                {"name": "Rate Limit Memory Cleanup", "description": "Verlopen IP-entries worden automatisch opgeruimd uit de rate limit store — voorkomt geheugengroei bij langdurige uptime"},
                {"name": "XSS Sanitatie", "description": "Alle LLM-gegenereerde markdown wordt gesaniteerd met DOMPurify voordat het in de DOM wordt geplaatst — voorkomt XSS via geïnjecteerde HTML/scripts in documenten"},
                {"name": "HTML→Markdown Conversie", "description": "HTML tags in LLM-output worden driedubbel gefilterd: (1) system prompt verbiedt HTML, (2) server-side _clean_llm_output() converteert HTML→Markdown (strong→**, li→-, p→paragraaf) en stuurt schone 'content' SSE events, (3) client-side stripHtmlToMarkdown() past dezelfde regex-keten toe als extra vangnet — ook bij incomplete streaming HTML en entity-encoded tags"},
                {"name": "SSE Foutbestendigheid", "description": "JSON.parse in de SSE-streamlezer is gewrapped in try/catch — malformed events worden overgeslagen i.p.v. de hele UI te crashen"},
                {"name": "Auth Bypass Preventie", "description": "Bij onbereikbare server wordt de login-scherm getoond met foutmelding i.p.v. de app zonder authenticatie te tonen"},
                {"name": "Upload Pre-Check", "description": "Bestandsgrootte wordt gecontroleerd via Content-Length header vóór het inlezen in geheugen — voorkomt OOM bij grote uploads"},
                {"name": "Graceful OCR Degradatie", "description": "ImageProcessor wordt alleen geregistreerd als easyocr daadwerkelijk geïnstalleerd is — geen crash bij ontbrekende dependency"},
                {"name": "Performance-Optimized Pipeline", "description": "Multi-query expansie standaard uit (bespaart 1-2s LLM call), cross-encoder beperkt tot top 10 (i.p.v. 30), neighbor expansion beperkt tot top 3 (i.p.v. 5), context chunks verlaagd naar 15 — samen ~50% snellere response tijd"},
                {"name": "API Docs Uitgeschakeld", "description": "Swagger UI (/docs), ReDoc (/redoc) en OpenAPI schema (/openapi.json) zijn uitgeschakeld in productie — voorkomt volledige API-reconnaissance door aanvallers"},
                {"name": "Security Headers", "description": "Alle responses bevatten X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy, X-XSS-Protection en HSTS (via X-Forwarded-Proto achter Caddy) — beschermt tegen clickjacking, MIME-sniffing en token-lekkage"},
                {"name": "Rate Limiting", "description": "In-memory rate limiter met X-Forwarded-For IP-detectie (werkt correct achter Caddy reverse proxy): auth endpoint max 5 pogingen/minuut per IP, API endpoints max 60 requests/minuut per IP — voorkomt brute-force en API-misbruik"},
                {"name": "SRI Integrity Hashes", "description": "Alle externe CDN-scripts (marked, DOMPurify, highlight.js) laden met Subresource Integrity hashes en gepinde versies — voorkomt supply-chain aanvallen via gecompromitteerde CDN's"},
                {"name": "Batch Upload Limiet", "description": "Maximaal 20 bestanden per batch-upload, met collectienaam-validatie op alle upload-endpoints — voorkomt resource exhaustion"},
                {"name": "Veilige Temp-Bestanden", "description": "Audio/video processing gebruikt NamedTemporaryFile i.p.v. het onveilige mktemp — voorkomt race conditions bij tijdelijke bestanden"},
            ],
        },
        "config": {
            "title": "Huidige Configuratie",
            "values": {
                "LLM Provider (Primair)": settings.llm_provider,
                "Groq Model": settings.groq_model,
                "Cerebras Model (Fallback 1)": settings.cerebras_model,
                "OpenRouter Model (Fallback 2)": settings.openrouter_model,
                "Embedding Model": f"{settings.embedding_model} (768-dim via Ollama)",
                "Chunk Size": f"{settings.chunk_size} tekens",
                "Chunk Overlap": f"{settings.chunk_overlap} tekens",
                "Top K (standaard)": settings.top_k,
                "Similarity Threshold": settings.similarity_threshold,
                "Max Context Chunks": settings.max_context_chunks,
                "Max History Messages": settings.max_history_messages,
                "Summarize After": f"{settings.summarize_after_messages} berichten",
                "Max Upload Size": f"{settings.max_file_size_mb} MB",
                "Groq Timeout": "60 seconden",
                "Cerebras Timeout": f"{settings.cerebras_timeout} seconden",
                "OpenRouter Timeout": f"{settings.openrouter_timeout} seconden",
                "Ollama Embedding Timeout": "30 seconden",
                "Max Output Tokens": "2048",
                "BM25 Max Documents": "10.000",
            },
        },
    }
