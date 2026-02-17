import logging
import re
from collections.abc import Generator

from app.config import settings
from app.core.database import (
    create_session,
    get_session,
    get_agent,
    add_message,
    get_messages,
    get_recent_context,
    update_session_title,
    get_session_metadata,
    update_session_metadata,
)
from app.core.llm import generate, generate_stream, get_active_provider
from app.retrieval.retriever import retrieve

# HTML → Markdown conversion for LLMs that output HTML despite instructions
_STRIP_TAG_RE = re.compile(r"<\/?(div|span|br|table|tr|td|th|thead|tbody|blockquote|hr)[\s/]*>", re.IGNORECASE)


def _clean_llm_output(text: str) -> str:
    """Convert HTML in LLM output to clean Markdown."""
    # 0. Preserve <followup> tags — extract them before cleaning
    followups = re.findall(r"<followup>.*?</followup>", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<followup>.*?</followup>", "", text, flags=re.DOTALL | re.IGNORECASE)

    # 1. Convert semantic HTML to Markdown equivalents (handle tags with attributes)
    text = re.sub(r"<strong[^>]*>(.*?)</strong>", r"**\1**", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<b[^>]*>(.*?)</b>", r"**\1**", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<em[^>]*>(.*?)</em>", r"*\1*", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<i[^>]*>(.*?)</i>", r"*\1*", text, flags=re.DOTALL | re.IGNORECASE)
    for level in range(1, 7):
        hashes = "#" * min(level + 1, 4)
        text = re.sub(rf"<h{level}[^>]*>(.*?)</h{level}>", rf"\n{hashes} \1\n", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<li[^>]*>(.*?)</li>", r"\n- \1", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<p[^>]*>(.*?)</p>", r"\1\n\n", text, flags=re.DOTALL | re.IGNORECASE)

    # 2. Strip remaining non-semantic HTML tags
    text = re.sub(r"<\/?(ul|ol)[^>]*>", "\n", text, flags=re.IGNORECASE)
    text = _STRIP_TAG_RE.sub("\n", text)

    # 3. Clean up any leftover HTML tags (with or without attributes)
    text = re.sub(r"<\/?[a-z][a-z0-9]*[^>]*>", "", text, flags=re.IGNORECASE)

    # 4. Normalize whitespace
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"(\n- )\n+(?=- )", r"\1", text)

    # 5. Re-append followup tags
    text = text.strip()
    if followups:
        text += "\n" + "\n".join(followups)
    return text

logger = logging.getLogger(__name__)

TITLE_PROMPT = (
    "Generate a short title (max 6 words) for a conversation that starts with this question. "
    "Reply with ONLY the title, nothing else. Question: {question}"
)

SUMMARIZE_PROMPT = """Summarize the following conversation into a concise summary that captures all key topics, questions asked, and answers given. Keep it under 500 words. This summary will be used as context for future questions.

Conversation:
{conversation}

Summary:"""

CHAT_SYSTEM_PROMPT = """Je bent een deskundige assistent voor fitness, coaching en voeding. Je voert een natuurlijk gesprek op basis van de beschikbare documenten en je eigen expertise.

ANTWOORDSTIJL — pas aan op de vraag:
- **Feitelijke vragen** ("wat is de naam?", "hoeveel sets?"): kort en direct antwoorden.
- **Analyse/adviesvragen** ("maak een programma", "wat zou je aanraden?", "analyseer deze intake"): ga de diepte in. Gebruik kopjes, bullets, concrete aanbevelingen en onderbouw ELKE keuze met bronverwijzingen [1], [2] etc. Laat zien dat je de documenten grondig hebt doorgenomen.
- **Open vragen** ("vertel me over...", "wat valt je op?"): geef een gestructureerd overzicht met de belangrijkste punten.

BRONVERWIJZINGEN — BELANGRIJK:
- Citeer met [1], [2] etc. bij ELKE inhoudelijke keuze, aanbeveling of onderbouwing.
- Dit geldt voor ALLE antwoorden — ook bij vervolgvragen in een gesprek. Zolang je documentcontext hebt, citeer je.
- Bij programma's en schema's: citeer waarom je een oefening kiest, waarom een bepaalde set/rep-range, waarom een periodiseringsmodel, waarom een voedingsrichtlijn. Dus niet alleen bij de samenvatting, maar ook bij individuele oefeningen, fases en voedingskeuzes.
- Voorbeeld: "Back Squat 4×8 @ 70% 1RM [3] met 2s pause [7]" of "Periodisering in 3 blokken van 4 weken (hypertrofie → kracht → piek) [9][13]"
- Hoe meer citaties hoe beter — de gebruiker wil zien waar elke keuze vandaan komt.

FORMATTERING:
- Gebruik Markdown: ## kopjes, **bold**, - bullets, genummerde lijsten.
- NOOIT HTML tags. Alleen Markdown.
- Antwoord in dezelfde taal als de vraag.
- TABELLEN: maximaal 4-5 kolommen. Elke rij MOET compleet op één regel staan — breek NOOIT een tabelrij over meerdere regels. Als een cel te lang wordt, verkort de tekst.
- TRAININGSSCHEMA'S: gebruik een Markdown-tabel per trainingsdag met korte celinhoud. Hou cellen beknopt: alleen oefening + sets×reps (bijv. "Back Squat 4×8"). Zet langere uitleg, tempo-notaties of opmerkingen ONDER de tabel als bullets, niet IN de tabelcellen. Voorbeeld:

  | Oefening | Sets × Reps | Opmerking |
  |---|---|---|
  | Back Squat | 4×8 @70% | pause-rep [3] |
  | Leg Curl | 3×12 | |

  *Opmerking: 2s pauze onderaan bij squat voor extra TUT [7]*

INHOUD:
- Baseer je op de meegeleverde documentcontext. Combineer de informatie uit de documenten met logische coaching-kennis. Wees concreet en praktisch.
- Als informatie ontbreekt, benoem wat je mist en geef aan wat je extra nodig hebt.
- Gebruik de gesprekshistorie om de context te begrijpen.

Eindig elk antwoord met precies 3 relevante vervolgvragen:
<followup>Eerste vervolgvraag</followup>
<followup>Tweede vervolgvraag</followup>
<followup>Derde vervolgvraag</followup>"""

CHAT_PROMPT_TEMPLATE = """DOCUMENTCONTEXT:
{context}

BRONNEN:
{sources}

{history_section}

VRAAG: {question}

Beantwoord de vraag. Pas je diepgang aan op wat er gevraagd wordt — kort bij feitelijke vragen, uitgebreid bij analyse/advies. Onderbouw ALTIJD met [1], [2] citaties wanneer je informatie uit de documentcontext gebruikt — ook bij vervolgvragen. Eindig met 3 vervolgvragen in <followup> tags."""

CHAT_PROMPT_TEMPLATE_WITH_ATTACHMENTS = """BIJGEVOEGDE DOCUMENTEN (door de gebruiker geüpload):
{attachment_context}

AANVULLENDE CONTEXT UIT KENNISBANK:
{kb_context}

BRONNEN:
{sources}

{history_section}

VRAAG: {question}

De gebruiker heeft documenten bijgevoegd. Beantwoord de vraag primair op basis van deze documenten, aangevuld met kennisbank-context. Bij adviesvragen (programma maken, analyse, aanbevelingen): ga de diepte in met concrete, onderbouwde antwoorden. Citeer ELKE keuze met [1], [2] etc. — oefeningen, set/rep-schema's, periodisering, voedingsrichtlijnen. Hoe meer citaties hoe beter. Bij feitelijke vragen: wees direct. Eindig met 3 vervolgvragen in <followup> tags."""


def start_session(collection: str | None = None, agent_id: str | None = None) -> dict:
    """Create a new chat session, optionally linked to an agent."""
    return create_session(collection=collection, agent_id=agent_id)


def chat(
    session_id: str,
    question: str,
    top_k: int | None = None,
    temperature: float = 0.3,
) -> dict:
    """
    Full chat pipeline with conversation memory:
    1. Get conversation history (with auto-summarization for long chats)
    2. Retrieve relevant document chunks
    3. Build prompt with history + context
    4. Generate answer
    5. Save messages to DB
    """
    top_k = top_k or settings.top_k
    session = get_session(session_id)
    if not session:
        raise ValueError(f"Session '{session_id}' not found")

    collection = session.get("collection")

    # Load agent if linked
    agent = None
    agent_id = session.get("agent_id")
    if agent_id:
        agent = get_agent(agent_id)
        if agent:
            top_k = agent.get("top_k", top_k)
            temperature = agent.get("temperature", temperature)
            logger.info(f"Using agent '{agent.get('name', 'unknown')}' (collections: {agent.get('collections', [])})")

    # 1. Get conversation history with smart context management
    all_messages = get_messages(session_id, limit=200)
    history_section = _build_history_section(all_messages, session_id)

    # 2. Retrieve relevant chunks using question + recent context
    recent = get_recent_context(session_id, max_messages=6)
    search_query = _build_search_query(question, recent)

    # Determine collection search scope from agent + attachments
    agent_collections = agent.get("collections", []) if agent else []
    session_meta = get_session_metadata(session_id)
    attachment_collection = session_meta.get("attachment_collection")

    # Retrieve: separate passes for attachments and KB for better coverage
    att_chunks = []
    kb_chunks = []

    if attachment_collection:
        # Pass 1: Get generous amount of attachment chunks
        att_chunks = retrieve(
            query=search_query,
            collection_name=attachment_collection,
            top_k=min(top_k * 2, 30),
            use_multi_query=False,
        )
        # Pass 2: KB chunks — from selected collection, agent collections, or global search
        if agent_collections:
            kb_chunks = retrieve(
                query=search_query,
                collection_names=agent_collections,
                top_k=top_k,
                use_multi_query=False,
            )
        elif collection:
            kb_chunks = retrieve(
                query=search_query,
                collection_name=collection,
                top_k=top_k,
                use_multi_query=False,
            )
        else:
            # No collection selected — search all KB collections
            kb_chunks = retrieve(
                query=search_query,
                top_k=top_k,
                use_multi_query=False,
            )
    else:
        # No attachments — standard retrieval
        search_collection_name = collection if not agent_collections else None
        search_collection_names = agent_collections if agent_collections else None
        kb_chunks = retrieve(
            query=search_query,
            collection_name=search_collection_name,
            collection_names=search_collection_names,
            top_k=top_k,
            use_multi_query=False,
        )
        if not kb_chunks and agent_collections:
            kb_chunks = retrieve(query=search_query, top_k=top_k, use_multi_query=False)

    chunks = att_chunks + kb_chunks

    # 3. Build prompt
    source_parts = []
    seen_sources = set()

    def _build_context(chunk_list, start_idx=1):
        parts = []
        nonlocal seen_sources
        idx = start_idx
        for chunk in chunk_list:
            parts.append(f"[{idx}] {chunk.content}")
            key = chunk.source_file
            if key not in seen_sources:
                seen_sources.add(key)
                mi = []
                if chunk.metadata.get("page_number"):
                    mi.append(f"page {chunk.metadata['page_number']}")
                if chunk.metadata.get("section_header"):
                    mi.append(f"section: {chunk.metadata['section_header']}")
                s = f"- [{idx}] {key}"
                if mi:
                    s += f" ({', '.join(mi)})"
                source_parts.append(s)
            idx += 1
        return "\n\n".join(parts), idx

    if att_chunks:
        att_context, next_idx = _build_context(att_chunks, 1)
        kb_context, _ = _build_context(kb_chunks, next_idx)
        sources_text = "\n".join(source_parts) if source_parts else "(geen bronnen)"
        user_prompt = CHAT_PROMPT_TEMPLATE_WITH_ATTACHMENTS.format(
            attachment_context=att_context or "(geen passages uit bijlage)",
            kb_context=kb_context or "(geen aanvullende context)",
            sources=sources_text,
            history_section=history_section,
            question=question,
        )
    else:
        context, _ = _build_context(kb_chunks, 1)
        context = context or "(geen documenten gevonden)"
        sources_text = "\n".join(source_parts) if source_parts else "(geen bronnen)"
        user_prompt = CHAT_PROMPT_TEMPLATE.format(
            context=context,
            sources=sources_text,
            history_section=history_section,
            question=question,
        )

    # 4. Generate answer (use agent system prompt if available)
    system_prompt = agent["system_prompt"] if agent else CHAT_SYSTEM_PROMPT
    answer = _clean_llm_output(generate(
        prompt=user_prompt,
        system=system_prompt,
        temperature=temperature,
    ))

    # 5. Build source references
    sources = []
    for chunk in chunks:
        sources.append({
            "filename": chunk.source_file,
            "chunk_text": chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content,
            "relevance_score": round(1 - chunk.relevance_score, 4),
            "metadata": chunk.metadata,
        })

    # 6. Save messages to DB
    add_message(session_id, "user", question)
    add_message(session_id, "assistant", answer, sources=sources)

    # 7. Auto-generate title for new sessions
    if not all_messages:
        _auto_title(session_id, question)

    return {
        "answer": answer,
        "sources": sources,
        "session_id": session_id,
        "model_used": get_active_provider(),
    }


def chat_stream(
    session_id: str,
    question: str,
    top_k: int | None = None,
    temperature: float = 0.3,
) -> Generator[dict, None, None]:
    """
    Streaming chat pipeline - yields SSE events:
    - {"event": "sources", "data": [...]}   (retrieved sources)
    - {"event": "token", "data": "..."}     (each token)
    - {"event": "done", "data": {...}}      (final metadata)
    """
    top_k = top_k or settings.top_k
    session = get_session(session_id)
    if not session:
        raise ValueError(f"Session '{session_id}' not found")

    collection = session.get("collection")

    # Load agent if linked
    agent = None
    agent_id = session.get("agent_id")
    if agent_id:
        agent = get_agent(agent_id)
        if agent:
            top_k = agent.get("top_k", top_k)
            temperature = agent.get("temperature", temperature)

    # 1. Get conversation history
    all_messages = get_messages(session_id, limit=200)
    history_section = _build_history_section(all_messages, session_id)

    # 2. Yield search status
    yield {"event": "status", "data": "Documenten doorzoeken..."}

    # 3. Retrieve relevant chunks
    recent = get_recent_context(session_id, max_messages=6)
    search_query = _build_search_query(question, recent)

    agent_collections = agent.get("collections", []) if agent else []
    session_meta = get_session_metadata(session_id)
    attachment_collection = session_meta.get("attachment_collection")

    # Retrieve: separate passes for attachments and KB
    att_chunks = []
    kb_chunks = []

    if attachment_collection:
        att_chunks = retrieve(
            query=search_query,
            collection_name=attachment_collection,
            top_k=min(top_k * 2, 30),
            use_multi_query=False,
        )
        # KB chunks — from selected collection, agent collections, or global search
        if agent_collections:
            kb_chunks = retrieve(
                query=search_query,
                collection_names=agent_collections,
                top_k=top_k,
                use_multi_query=False,
            )
        elif collection:
            kb_chunks = retrieve(
                query=search_query,
                collection_name=collection,
                top_k=top_k,
                use_multi_query=False,
            )
        else:
            # No collection selected — search all KB collections
            kb_chunks = retrieve(
                query=search_query,
                top_k=top_k,
                use_multi_query=False,
            )
    else:
        search_collection_name = collection if not agent_collections else None
        search_collection_names = agent_collections if agent_collections else None
        kb_chunks = retrieve(
            query=search_query,
            collection_name=search_collection_name,
            collection_names=search_collection_names,
            top_k=top_k,
            use_multi_query=False,
        )
        if not kb_chunks and agent_collections:
            kb_chunks = retrieve(query=search_query, top_k=top_k, use_multi_query=False)

    chunks = att_chunks + kb_chunks

    # Build source references
    sources = []
    for chunk in chunks:
        sources.append({
            "filename": chunk.source_file,
            "chunk_text": chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content,
            "relevance_score": round(1 - chunk.relevance_score, 4),
            "metadata": chunk.metadata,
        })

    # Yield status + sources with quality indication
    if not chunks:
        yield {"event": "status", "data": "Geen relevante documenten gevonden — antwoord op basis van algemene kennis"}
    else:
        n_sources = len(set(s["filename"] for s in sources))
        avg_score = sum(s["relevance_score"] for s in sources) / len(sources) if sources else 0
        if att_chunks:
            yield {"event": "status", "data": f"{len(att_chunks)} passages uit bijlage + {len(kb_chunks)} uit kennisbank"}
        elif avg_score < 0.4:
            yield {"event": "status", "data": f"{len(chunks)} passages gevonden (lage relevantie) in {n_sources} document(en)"}
        else:
            yield {"event": "status", "data": f"{len(chunks)} passages gevonden in {n_sources} document(en)"}
    yield {"event": "sources", "data": sources}
    yield {"event": "status", "data": "Antwoord genereren..."}

    # 3. Build prompt — attachment chunks first for priority
    source_parts = []
    seen_sources = set()

    def _build_ctx(chunk_list, start_idx=1):
        parts = []
        nonlocal seen_sources
        idx = start_idx
        for chunk in chunk_list:
            parts.append(f"[{idx}] {chunk.content}")
            key = chunk.source_file
            if key not in seen_sources:
                seen_sources.add(key)
                mi = []
                if chunk.metadata.get("page_number"):
                    mi.append(f"page {chunk.metadata['page_number']}")
                if chunk.metadata.get("section_header"):
                    mi.append(f"section: {chunk.metadata['section_header']}")
                s = f"- [{idx}] {key}"
                if mi:
                    s += f" ({', '.join(mi)})"
                source_parts.append(s)
            idx += 1
        return "\n\n".join(parts), idx

    if att_chunks:
        att_context, next_idx = _build_ctx(att_chunks, 1)
        kb_context, _ = _build_ctx(kb_chunks, next_idx)
        sources_text = "\n".join(source_parts) if source_parts else "(geen bronnen)"
        user_prompt = CHAT_PROMPT_TEMPLATE_WITH_ATTACHMENTS.format(
            attachment_context=att_context or "(geen passages uit bijlage)",
            kb_context=kb_context or "(geen aanvullende context)",
            sources=sources_text,
            history_section=history_section,
            question=question,
        )
    else:
        context, _ = _build_ctx(kb_chunks, 1)
        context = context or "(geen documenten gevonden)"
        sources_text = "\n".join(source_parts) if source_parts else "(geen bronnen)"
        user_prompt = CHAT_PROMPT_TEMPLATE.format(
            context=context,
            sources=sources_text,
            history_section=history_section,
            question=question,
        )

    system_prompt = agent["system_prompt"] if agent else CHAT_SYSTEM_PROMPT

    # 4. Stream the answer — server cleans HTML, client just displays
    full_answer = []
    provider_info = {"name": "unknown"}
    prev_clean = ""
    token_count = 0
    for token in generate_stream(
        prompt=user_prompt, system=system_prompt,
        temperature=temperature, provider_info=provider_info,
    ):
        full_answer.append(token)
        token_count += 1
        # Every 3 tokens, send the full cleaned text so far
        if token_count % 3 == 0 or token.endswith(("\n", ".", "!", "?")):
            raw = "".join(full_answer)
            # Chop off any incomplete HTML tag at the end (but not math like "< 5")
            last_lt = raw.rfind("<")
            if last_lt != -1 and ">" not in raw[last_lt:]:
                tail = raw[last_lt:]
                if len(tail) > 1 and (tail[1:2].isalpha() or tail[1:2] == "/"):
                    raw = raw[:last_lt]
            clean = _clean_llm_output(raw)
            if clean != prev_clean:
                yield {"event": "content", "data": clean}
                prev_clean = clean

    raw_answer = "".join(full_answer)
    answer = _clean_llm_output(raw_answer)

    # 5. Save messages to DB
    add_message(session_id, "user", question)
    assistant_msg = add_message(session_id, "assistant", answer, sources=sources)

    # 6. Auto-title
    if not all_messages:
        _auto_title(session_id, question)

    yield {"event": "done", "data": {
        "session_id": session_id,
        "message_id": assistant_msg["id"],
        "model_used": provider_info["name"],
        "answer": answer,
    }}


def get_chat_history(session_id: str) -> list[dict]:
    """Get all messages in a session."""
    return get_messages(session_id)


def _build_history_section(messages: list[dict], session_id: str) -> str:
    """
    Build the history section for the prompt.
    For long conversations, summarizes older messages and keeps recent ones verbatim.
    Summary is CACHED in session metadata to avoid regenerating on every message.
    Only re-summarizes every 10 new messages.
    """
    if not messages:
        return "CONVERSATION: (first question in this conversation)"

    total = len(messages)

    if total <= settings.summarize_after_messages:
        # Short conversation: include everything
        history_text = _format_messages(messages)
        return f"CONVERSATION HISTORY:\n{history_text}"

    # Long conversation: summarize older messages, keep recent ones
    split_point = total - 6  # Keep last 6 messages verbatim
    older_messages = messages[:split_point]
    recent_messages = messages[split_point:]

    # Check for cached summary — only regenerate every 10 new messages
    meta = get_session_metadata(session_id)
    cached_summary = meta.get("summary")
    summary_at_count = meta.get("summary_at_count", 0)

    if cached_summary and (total - summary_at_count) < 10:
        # Use cached summary (no LLM call)
        summary = cached_summary
    else:
        # Generate new summary and cache it
        summary = _summarize_conversation(older_messages)
        update_session_metadata(session_id, {
            "summary": summary,
            "summary_at_count": total,
        })

    recent_text = _format_messages(recent_messages)

    return (
        f"CONVERSATION SUMMARY (earlier in this chat):\n{summary}\n\n"
        f"RECENT MESSAGES:\n{recent_text}"
    )


def _summarize_conversation(messages: list[dict]) -> str:
    """Summarize a list of messages into a concise summary."""
    conversation = _format_messages(messages)
    try:
        summary = generate(
            prompt=SUMMARIZE_PROMPT.format(conversation=conversation),
            temperature=0.3,
        )
        return summary.strip()
    except Exception as e:
        logger.warning(f"Summarization failed: {e}")
        # Fallback: just take user messages
        user_msgs = [m["content"] for m in messages if m["role"] == "user"]
        return "Topics discussed: " + "; ".join(user_msgs[:5])


def _format_messages(messages: list[dict]) -> str:
    """Format messages for the prompt."""
    lines = []
    for msg in messages:
        role = "User" if msg["role"] == "user" else "Assistant"
        content = msg["content"]
        # Truncate very long assistant responses in history
        if role == "Assistant" and len(content) > 800:
            content = content[:800] + "..."
        lines.append(f"{role}: {content}")
    return "\n".join(lines)


def _build_search_query(question: str, history: list[dict]) -> str:
    """
    Combine the current question with recent context for better retrieval.
    """
    if not history:
        return question

    # Take recent user messages for context
    recent_user = [msg["content"] for msg in history if msg["role"] == "user"]
    recent_user.append(question)
    return " ".join(recent_user[-3:])


def _auto_title(session_id: str, question: str):
    """Generate a short title for the session based on the first question."""
    try:
        title = generate(
            prompt=TITLE_PROMPT.format(question=question),
            temperature=0.3,
        )
        title = title.strip().strip('"').strip("'")[:60]
        if title:
            update_session_title(session_id, title)
    except Exception as e:
        logger.warning(f"Failed to auto-generate title: {e}")
