import logging
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
)
from app.core.llm import generate, generate_stream, get_active_provider
from app.retrieval.retriever import retrieve

logger = logging.getLogger(__name__)

TITLE_PROMPT = (
    "Generate a short title (max 6 words) for a conversation that starts with this question. "
    "Reply with ONLY the title, nothing else. Question: {question}"
)

SUMMARIZE_PROMPT = """Summarize the following conversation into a concise summary that captures all key topics, questions asked, and answers given. Keep it under 500 words. This summary will be used as context for future questions.

Conversation:
{conversation}

Summary:"""

CHAT_SYSTEM_PROMPT = """You are an expert knowledge assistant. You answer questions accurately based on the provided document context and conversation history.

STRICT RULES:
1. ONLY use facts explicitly stated in the document context. Never add information from your own knowledge.
2. Use inline citations like [1], [2] etc. to reference the numbered source passages. Place them directly after the relevant claim.
3. Use conversation history and summary to understand the full conversation arc.
4. If the context doesn't contain enough information, explicitly state what is missing.
5. When multiple sources discuss the same topic, synthesize them into one coherent answer.
6. If sources contradict each other, mention both perspectives with their respective citations.
7. Be thorough and well-structured. Use headers, bullet points, or numbered lists when it improves clarity.
8. Answer in the same language as the question.
9. At the very end of your response, add a blank line and then exactly 3 follow-up questions the user might want to ask, formatted as:
  <followup>First follow-up question here</followup>
  <followup>Second follow-up question here</followup>
  <followup>Third follow-up question here</followup>"""

CHAT_PROMPT_TEMPLATE = """DOCUMENT CONTEXT (from your knowledge base):
{context}

SOURCES:
{sources}

{history_section}

CURRENT QUESTION: {question}

Provide a comprehensive, well-structured answer with inline citations [1], [2] etc. Synthesize information from multiple sources when applicable. End with 3 follow-up questions in <followup> tags."""


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

    # Determine collection search scope from agent
    agent_collections = agent.get("collections", []) if agent else []

    chunks = retrieve(
        query=search_query,
        collection_name=collection if not agent_collections else None,
        collection_names=agent_collections if agent_collections else None,
        top_k=top_k,
    )

    # Fallback: if agent collections yielded nothing, try all collections
    if not chunks and agent_collections:
        logger.warning(f"Agent collections {agent_collections} returned no results, falling back to all collections")
        chunks = retrieve(
            query=search_query,
            collection_name=None,
            collection_names=None,
            top_k=top_k,
        )

    # 3. Build prompt
    context_parts = []
    source_parts = []
    seen_sources = set()

    for i, chunk in enumerate(chunks, 1):
        context_parts.append(f"[{i}] {chunk.content}")
        source_key = chunk.source_file
        if source_key not in seen_sources:
            seen_sources.add(source_key)
            meta_info = []
            if chunk.metadata.get("page_number"):
                meta_info.append(f"page {chunk.metadata['page_number']}")
            if chunk.metadata.get("section_header"):
                meta_info.append(f"section: {chunk.metadata['section_header']}")
            source_str = f"- [{i}] {source_key}"
            if meta_info:
                source_str += f" ({', '.join(meta_info)})"
            source_parts.append(source_str)

    context = "\n\n".join(context_parts) if context_parts else "(geen documenten gevonden)"
    sources_text = "\n".join(source_parts) if source_parts else "(geen bronnen)"

    user_prompt = CHAT_PROMPT_TEMPLATE.format(
        context=context,
        sources=sources_text,
        history_section=history_section,
        question=question,
    )

    # 4. Generate answer (use agent system prompt if available)
    system_prompt = agent["system_prompt"] if agent else CHAT_SYSTEM_PROMPT
    answer = generate(
        prompt=user_prompt,
        system=system_prompt,
        temperature=temperature,
    )

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
    chunks = retrieve(
        query=search_query,
        collection_name=collection if not agent_collections else None,
        collection_names=agent_collections if agent_collections else None,
        top_k=top_k,
    )

    # Fallback
    if not chunks and agent_collections:
        chunks = retrieve(query=search_query, top_k=top_k)

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
        if avg_score < 0.4:
            yield {"event": "status", "data": f"{len(chunks)} passages gevonden (lage relevantie) in {n_sources} document(en)"}
        else:
            yield {"event": "status", "data": f"{len(chunks)} passages gevonden in {n_sources} document(en)"}
    yield {"event": "sources", "data": sources}
    yield {"event": "status", "data": "Antwoord genereren..."}

    # 3. Build prompt
    context_parts = []
    source_parts = []
    seen_sources = set()
    for i, chunk in enumerate(chunks, 1):
        context_parts.append(f"[{i}] {chunk.content}")
        source_key = chunk.source_file
        if source_key not in seen_sources:
            seen_sources.add(source_key)
            meta_info = []
            if chunk.metadata.get("page_number"):
                meta_info.append(f"page {chunk.metadata['page_number']}")
            if chunk.metadata.get("section_header"):
                meta_info.append(f"section: {chunk.metadata['section_header']}")
            source_str = f"- [{i}] {source_key}"
            if meta_info:
                source_str += f" ({', '.join(meta_info)})"
            source_parts.append(source_str)

    context = "\n\n".join(context_parts) if context_parts else "(geen documenten gevonden)"
    sources_text = "\n".join(source_parts) if source_parts else "(geen bronnen)"

    user_prompt = CHAT_PROMPT_TEMPLATE.format(
        context=context,
        sources=sources_text,
        history_section=history_section,
        question=question,
    )

    system_prompt = agent["system_prompt"] if agent else CHAT_SYSTEM_PROMPT

    # 4. Stream the answer
    full_answer = []
    provider_info = {"name": "unknown"}
    for token in generate_stream(
        prompt=user_prompt, system=system_prompt,
        temperature=temperature, provider_info=provider_info,
    ):
        full_answer.append(token)
        yield {"event": "token", "data": token}

    answer = "".join(full_answer)

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
    }}


def get_chat_history(session_id: str) -> list[dict]:
    """Get all messages in a session."""
    return get_messages(session_id)


def _build_history_section(messages: list[dict], session_id: str) -> str:
    """
    Build the history section for the prompt.
    For long conversations, summarizes older messages and keeps recent ones verbatim.
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

    # Summarize older messages
    summary = _summarize_conversation(older_messages)
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
        if role == "Assistant" and len(content) > 2000:
            content = content[:2000] + "..."
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
