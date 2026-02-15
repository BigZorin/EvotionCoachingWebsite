import gradio as gr
import httpx

API_BASE = "http://localhost:8000/api/v1"


def _api_get(path: str) -> dict:
    r = httpx.get(f"{API_BASE}{path}", timeout=30)
    r.raise_for_status()
    return r.json()


def _api_post(path: str, **kwargs) -> dict:
    r = httpx.post(f"{API_BASE}{path}", timeout=120, **kwargs)
    r.raise_for_status()
    return r.json()


def _api_delete(path: str) -> dict:
    r = httpx.delete(f"{API_BASE}{path}", timeout=30)
    r.raise_for_status()
    return r.json()


# ============================================================
# CSS - aggressive dark theme overrides
# ============================================================

CUSTOM_CSS = """
/* ===== RESET: kill all gradio default styling ===== */
.gradio-container {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    background: #212121 !important;
    font-family: 'Söhne', 'Inter', ui-sans-serif, system-ui, sans-serif !important;
}
footer, .built-with { display: none !important; }

/* Kill all default borders and shadows */
.block, .form, .gr-group, .gr-box, .gr-panel,
.contain, .gap, .panel {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
}

/* ===== TABS - top navigation bar ===== */
.tab-nav {
    background: #171717 !important;
    border-bottom: 1px solid #303030 !important;
    padding: 0 20px !important;
    gap: 0 !important;
}
.tab-nav button {
    background: transparent !important;
    color: #8e8e8e !important;
    border: none !important;
    border-bottom: 2px solid transparent !important;
    border-radius: 0 !important;
    padding: 12px 20px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    transition: all 0.15s !important;
}
.tab-nav button.selected {
    color: #ececec !important;
    border-bottom-color: #ececec !important;
    background: transparent !important;
}
.tab-nav button:hover:not(.selected) {
    color: #b4b4b4 !important;
}

/* ===== SIDEBAR ===== */
.sidebar {
    background: #171717 !important;
    border-right: 1px solid #2a2a2a !important;
    padding: 16px 12px !important;
    min-height: 88vh !important;
}
.sidebar .gr-block, .sidebar .gr-form, .sidebar .block {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* Sidebar title */
.sidebar-title {
    padding: 0 4px 16px 4px !important;
}
.sidebar-title p, .sidebar-title span {
    color: #ececec !important;
    font-size: 16px !important;
    font-weight: 600 !important;
}

/* New chat button */
.new-chat-btn {
    border: 1px solid #404040 !important;
    border-radius: 10px !important;
    padding: 10px 14px !important;
    background: transparent !important;
    color: #ececec !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    width: 100% !important;
    margin-bottom: 16px !important;
    transition: background 0.15s !important;
}
.new-chat-btn:hover {
    background: #2a2a2a !important;
}

/* Session list label */
.sessions-label {
    padding: 0 4px !important;
    margin-bottom: 4px !important;
}
.sessions-label p, .sessions-label span {
    color: #6e6e6e !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
}

/* Sessions as HTML list */
.sessions-html {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}
.sessions-html .prose {
    color: #b4b4b4 !important;
}
.sessions-html .prose p {
    margin: 0 !important;
}
.session-item {
    display: block;
    padding: 8px 12px;
    border-radius: 8px;
    color: #b4b4b4;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.12s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    margin-bottom: 1px;
}
.session-item:hover {
    background: #2a2a2a;
    color: #ececec;
}

/* Settings accordion */
.settings-acc {
    margin-top: 12px !important;
    border: 1px solid #2a2a2a !important;
    border-radius: 10px !important;
    overflow: hidden !important;
}
.settings-acc .label-wrap {
    background: #1a1a1a !important;
    padding: 8px 12px !important;
}
.settings-acc .label-wrap span {
    color: #8e8e8e !important;
    font-size: 13px !important;
}
.settings-acc .gr-accordion-content {
    background: #1a1a1a !important;
    padding: 8px 12px 12px !important;
}

/* Model badge */
.model-badge p, .model-badge span {
    font-size: 11px !important;
    color: #4a4a4a !important;
    text-align: center !important;
}

/* ===== MAIN CHAT AREA ===== */
.chat-col {
    padding: 0 !important;
    background: #212121 !important;
}

/* Chatbot - remove all chrome */
.chatbot-main {
    border: none !important;
    background: #212121 !important;
    box-shadow: none !important;
}
.chatbot-main > div {
    background: #212121 !important;
}

/* Message bubbles */
.chatbot-main .message {
    font-size: 15px !important;
    line-height: 1.6 !important;
}
.chatbot-main .user .message-content {
    background: #303030 !important;
    border-radius: 20px !important;
    padding: 12px 18px !important;
    color: #ececec !important;
}
.chatbot-main .bot .message-content {
    background: transparent !important;
    padding: 4px 0 !important;
    color: #d1d1d1 !important;
}
/* Bot message code blocks */
.chatbot-main .bot code {
    background: #1a1a1a !important;
    border-radius: 6px !important;
    padding: 2px 6px !important;
    font-size: 13px !important;
    color: #e0e0e0 !important;
}
.chatbot-main .bot pre {
    background: #1a1a1a !important;
    border-radius: 10px !important;
    padding: 14px !important;
    border: 1px solid #2a2a2a !important;
}

/* ===== INPUT BAR ===== */
.input-row {
    background: #212121 !important;
    padding: 8px 8% 24px 8% !important;
    border: none !important;
}

/* The textbox input */
.input-row textarea, .input-row input[type="text"] {
    background: #303030 !important;
    border: 1px solid #424242 !important;
    border-radius: 24px !important;
    color: #ececec !important;
    padding: 14px 20px !important;
    font-size: 15px !important;
    resize: none !important;
    line-height: 1.4 !important;
    caret-color: #ececec !important;
}
.input-row textarea:focus, .input-row input[type="text"]:focus {
    border-color: #5a5a5a !important;
    box-shadow: none !important;
    outline: none !important;
}
.input-row textarea::placeholder {
    color: #6e6e6e !important;
}

/* Send button */
.send-btn {
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    max-width: 40px !important;
    padding: 0 !important;
    background: #ececec !important;
    color: #171717 !important;
    font-size: 18px !important;
    border: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background 0.15s !important;
    align-self: end !important;
    margin-bottom: 4px !important;
}
.send-btn:hover {
    background: #d0d0d0 !important;
}

/* ===== DOCUMENTS TAB ===== */
.docs-page {
    padding: 24px 32px !important;
    background: #212121 !important;
}

/* Upload zone */
.upload-zone {
    background: #1a1a1a !important;
    border: 1px solid #2a2a2a !important;
    border-radius: 12px !important;
    padding: 20px !important;
}

/* Document table */
.doc-table {
    border: 1px solid #2a2a2a !important;
    border-radius: 10px !important;
    overflow: hidden !important;
}
.doc-table table {
    border-collapse: collapse !important;
}
.doc-table th {
    background: #1a1a1a !important;
    color: #8e8e8e !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    padding: 10px 14px !important;
    border-bottom: 1px solid #2a2a2a !important;
}
.doc-table td {
    background: #212121 !important;
    color: #b4b4b4 !important;
    font-size: 13px !important;
    padding: 10px 14px !important;
    border-bottom: 1px solid #1e1e1e !important;
}
.doc-table tr:hover td {
    background: #2a2a2a !important;
    color: #ececec !important;
}

/* Delete button */
.del-btn {
    background: transparent !important;
    color: #f87171 !important;
    border: 1px solid #f87171 !important;
    border-radius: 8px !important;
    font-size: 13px !important;
    padding: 6px 16px !important;
    transition: all 0.15s !important;
}
.del-btn:hover {
    background: #f87171 !important;
    color: #fff !important;
}

/* ===== COLLECTIONS TAB ===== */
.coll-page {
    padding: 24px 32px !important;
}

/* ===== GLOBAL: dropdowns, inputs, sliders ===== */
select, .gr-dropdown {
    background: #303030 !important;
    color: #ececec !important;
    border-color: #3f3f3f !important;
    border-radius: 8px !important;
}

/* Labels */
label, .gr-label {
    color: #8e8e8e !important;
    font-size: 13px !important;
    font-weight: 500 !important;
}

/* Markdown text */
.prose {
    color: #d1d1d1 !important;
}
.prose strong {
    color: #ececec !important;
}
.prose code {
    background: #1a1a1a !important;
    color: #d1d1d1 !important;
    padding: 2px 6px !important;
    border-radius: 4px !important;
    font-size: 13px !important;
}
.prose h2 { color: #ececec !important; font-size: 20px !important; }
.prose h3 { color: #ececec !important; font-size: 16px !important; }
.prose h5 { color: #6e6e6e !important; font-size: 11px !important; text-transform: uppercase; letter-spacing: 0.5px; }
.prose a { color: #6ea8fe !important; }
.prose hr { border-color: #2a2a2a !important; }

/* File upload area */
.gr-file, .gr-file-preview {
    background: #1a1a1a !important;
    border: 2px dashed #3a3a3a !important;
    border-radius: 12px !important;
}

/* Empty state for chatbot */
.chatbot-main .empty-chat {
    color: #4a4a4a;
    text-align: center;
    padding-top: 200px;
    font-size: 18px;
}
"""


# ============================================================
# State
# ============================================================

_current_session_id = None


def _ensure_session(collection: str | None = None) -> str:
    global _current_session_id
    if _current_session_id is None:
        body = {"collection": collection if collection else None}
        session = _api_post("/chat/sessions", json=body)
        _current_session_id = session["id"]
    return _current_session_id


# ============================================================
# Chat
# ============================================================

def chat_respond(message: str, chat_history: list, collection: str, top_k: int):
    if not message.strip():
        return chat_history, ""

    session_id = _ensure_session(collection if collection else None)

    try:
        response = _api_post(
            f"/chat/sessions/{session_id}/messages",
            json={"message": message, "top_k": int(top_k)},
        )

        answer = response.get("answer", "Geen antwoord.")
        sources = response.get("sources", [])

        source_text = ""
        if sources:
            unique = {}
            for s in sources:
                fn = s.get("filename", "unknown")
                sc = s.get("relevance_score", 0)
                if fn not in unique or sc > unique[fn]:
                    unique[fn] = sc
            parts = [f"`{fn}` ({sc:.0%})" for fn, sc in unique.items()]
            source_text = "\n\n---\n**Bronnen:** " + " · ".join(parts)

        chat_history.append({"role": "user", "content": message})
        chat_history.append({"role": "assistant", "content": answer + source_text})
        return chat_history, ""
    except Exception as e:
        chat_history.append({"role": "user", "content": message})
        chat_history.append({"role": "assistant", "content": f"Er ging iets mis: {e}"})
        return chat_history, ""


def new_chat(collection: str):
    global _current_session_id
    _current_session_id = None
    _ensure_session(collection if collection else None)
    return [], ""


def load_session_by_id(session_id: str):
    """Load a session by ID."""
    global _current_session_id
    if not session_id or not session_id.strip():
        return []
    try:
        response = _api_get(f"/chat/sessions/{session_id}")
        _current_session_id = session_id
        messages = response.get("messages", [])
        return [{"role": m["role"], "content": m["content"]} for m in messages]
    except Exception as e:
        return [{"role": "assistant", "content": f"Fout bij laden: {e}"}]


def get_sessions_html():
    """Build clickable HTML session list."""
    try:
        response = _api_get("/chat/sessions?limit=30")
        sessions = response.get("sessions", [])
        if not sessions:
            return '<p style="color:#4a4a4a;font-size:13px;padding:8px;">Nog geen gesprekken</p>', []

        html_parts = []
        ids = []
        for s in sessions:
            title = s.get("title", "Nieuw gesprek")
            sid = s.get("id", "")
            count = s.get("message_count", 0)
            # Escape HTML
            title = title.replace("<", "&lt;").replace(">", "&gt;")
            html_parts.append(
                f'<div class="session-item" title="{sid}">'
                f'{title} <span style="color:#555;font-size:11px;">({count})</span>'
                f'</div>'
            )
            ids.append(sid)
        return "\n".join(html_parts), ids
    except Exception:
        return '<p style="color:#f87171;font-size:13px;">Fout bij laden</p>', []


def get_sessions_dropdown_choices():
    """Get sessions as dropdown choices."""
    try:
        response = _api_get("/chat/sessions?limit=30")
        sessions = response.get("sessions", [])
        choices = []
        for s in sessions:
            title = s.get("title", "Nieuw gesprek")
            sid = s.get("id", "")
            count = s.get("message_count", 0)
            choices.append((f"{title} ({count} msg)", sid))
        return choices
    except Exception:
        return []


# ============================================================
# Upload
# ============================================================

def upload_files(files, collection_name):
    if not files:
        return "Geen bestanden geselecteerd."
    if not collection_name:
        collection_name = "default"

    results = []
    total_chunks = 0
    for file_path in files:
        try:
            with open(file_path, "rb") as f:
                filename = file_path.split("\\")[-1].split("/")[-1]
                response = _api_post(
                    "/documents/upload",
                    files={"file": (filename, f)},
                    data={"collection": collection_name},
                )
                chunks = response.get("chunks_created", 0)
                total_chunks += chunks
                results.append(f"  ✓ {filename} → {chunks} chunks")
        except Exception as e:
            results.append(f"  ✗ {file_path}: {e}")

    return f"**Upload klaar:** {len(files)} bestanden, {total_chunks} chunks\n\n" + "\n".join(results)


# ============================================================
# Documents
# ============================================================

def get_collection_choices():
    try:
        response = _api_get("/collections")
        collections = response.get("collections", [])
        return [c.get("name", "") for c in collections if c.get("name")]
    except Exception:
        return ["default"]


def get_documents_table(collection_name: str):
    if not collection_name:
        return [], []
    try:
        response = _api_get(f"/collections/{collection_name}")
        docs = response.get("documents", [])
        table_data = []
        doc_ids = []
        for doc in docs:
            table_data.append([
                doc.get("filename", "onbekend"),
                doc.get("file_type", "?"),
                str(doc.get("total_chunks", 0)),
            ])
            doc_ids.append(doc.get("document_id", ""))
        return table_data, doc_ids
    except Exception:
        return [], []


# ============================================================
# Collections
# ============================================================

def list_collections_ui():
    try:
        response = _api_get("/collections")
        collections = response.get("collections", [])
        if not collections:
            return "Geen collecties gevonden. Upload eerst documenten."
        lines = []
        for col in collections:
            name = col.get("name", "?")
            docs = col.get("document_count", 0)
            chunks = col.get("total_chunks", 0)
            lines.append(f"**{name}** — {docs} documenten, {chunks} chunks")
        return "\n\n".join(lines)
    except Exception as e:
        return f"Fout: {e}"


def create_collection_ui(name):
    if not name.strip():
        return "Geef een naam op.", get_collection_choices()
    try:
        _api_post("/collections", json={"name": name.strip()})
        return f"✓ Collectie '{name.strip()}' aangemaakt.", get_collection_choices()
    except Exception as e:
        return f"✗ Fout: {e}", get_collection_choices()


def delete_collection_ui(name):
    if not name.strip():
        return "Geef een naam op.", get_collection_choices()
    try:
        _api_delete(f"/collections/{name.strip()}")
        return f"✓ Collectie '{name.strip()}' verwijderd.", get_collection_choices()
    except Exception as e:
        return f"✗ Fout: {e}", get_collection_choices()


# ============================================================
# Theme
# ============================================================

def get_dark_theme():
    return gr.themes.Base(
        primary_hue="neutral",
        secondary_hue="neutral",
        neutral_hue="neutral",
        font=("Inter", "ui-sans-serif", "system-ui", "sans-serif"),
    ).set(
        body_background_fill="#212121",
        body_background_fill_dark="#212121",
        body_text_color="#ececec",
        body_text_color_dark="#ececec",
        body_text_color_subdued="#8e8e8e",
        body_text_color_subdued_dark="#8e8e8e",
        block_background_fill="#212121",
        block_background_fill_dark="#212121",
        block_border_color="transparent",
        block_border_color_dark="transparent",
        block_shadow="none",
        block_shadow_dark="none",
        block_label_text_color="#8e8e8e",
        block_label_text_color_dark="#8e8e8e",
        block_title_text_color="#ececec",
        block_title_text_color_dark="#ececec",
        input_background_fill="#303030",
        input_background_fill_dark="#303030",
        input_border_color="#3f3f3f",
        input_border_color_dark="#3f3f3f",
        input_shadow="none",
        input_shadow_dark="none",
        button_primary_background_fill="#ececec",
        button_primary_background_fill_dark="#ececec",
        button_primary_text_color="#171717",
        button_primary_text_color_dark="#171717",
        button_secondary_background_fill="transparent",
        button_secondary_background_fill_dark="transparent",
        button_secondary_text_color="#ececec",
        button_secondary_text_color_dark="#ececec",
        button_secondary_border_color="#404040",
        button_secondary_border_color_dark="#404040",
        button_cancel_background_fill="transparent",
        button_cancel_background_fill_dark="transparent",
        button_cancel_text_color="#f87171",
        button_cancel_text_color_dark="#f87171",
        button_cancel_border_color="#f87171",
        button_cancel_border_color_dark="#f87171",
        table_text_color="#b4b4b4",
        table_text_color_dark="#b4b4b4",
    )


# ============================================================
# Build App
# ============================================================

def create_gradio_app() -> gr.Blocks:
    with gr.Blocks(title="Evotion RAG") as app:

        # State
        session_ids_state = gr.State([])
        doc_ids_state = gr.State([])
        selected_doc_idx = gr.State(-1)

        with gr.Tabs():

            # ===========================================
            # TAB: CHAT
            # ===========================================
            with gr.Tab("Chat"):
                with gr.Row(equal_height=True):

                    # --- Sidebar ---
                    with gr.Column(scale=1, min_width=260, elem_classes=["sidebar"]):
                        gr.Markdown("**Evotion RAG**", elem_classes=["sidebar-title"])

                        new_chat_btn = gr.Button(
                            "+  Nieuw gesprek",
                            variant="secondary",
                            elem_classes=["new-chat-btn"],
                        )

                        gr.Markdown("##### Recente gesprekken", elem_classes=["sessions-label"])

                        # Session selector dropdown (much cleaner than Dataframe)
                        session_dropdown = gr.Dropdown(
                            label="",
                            choices=[],
                            value=None,
                            interactive=True,
                            show_label=False,
                            container=False,
                        )

                        refresh_btn = gr.Button("Ververs", size="sm", variant="secondary")

                        with gr.Accordion("Instellingen", open=False, elem_classes=["settings-acc"]):
                            chat_collection = gr.Textbox(
                                label="Collectie",
                                value="",
                                placeholder="Leeg = zoek overal",
                            )
                            chat_top_k = gr.Slider(
                                label="Max bronnen",
                                minimum=1, maximum=50, value=15, step=1,
                            )

                        gr.Markdown("Powered by Groq · Llama 3.3 70B", elem_classes=["model-badge"])

                    # --- Chat area ---
                    with gr.Column(scale=4, elem_classes=["chat-col"]):
                        chatbot = gr.Chatbot(
                            show_label=False,
                            height=600,
                            container=False,
                            render_markdown=True,
                            placeholder="Stel een vraag over je documenten...",
                            elem_classes=["chatbot-main"],
                        )

                        with gr.Row(elem_classes=["input-row"]):
                            chat_input = gr.Textbox(
                                placeholder="Bericht aan Evotion RAG...",
                                show_label=False,
                                scale=6,
                                lines=1,
                                max_lines=5,
                                container=False,
                            )
                            send_btn = gr.Button(
                                "↑",
                                variant="primary",
                                scale=0,
                                min_width=44,
                                elem_classes=["send-btn"],
                            )

                # -- Chat events --
                send_btn.click(
                    fn=chat_respond,
                    inputs=[chat_input, chatbot, chat_collection, chat_top_k],
                    outputs=[chatbot, chat_input],
                )
                chat_input.submit(
                    fn=chat_respond,
                    inputs=[chat_input, chatbot, chat_collection, chat_top_k],
                    outputs=[chatbot, chat_input],
                )

                def _new_chat_refresh(collection):
                    history, inp = new_chat(collection)
                    choices = get_sessions_dropdown_choices()
                    return history, inp, gr.update(choices=choices, value=None)

                new_chat_btn.click(
                    fn=_new_chat_refresh,
                    inputs=[chat_collection],
                    outputs=[chatbot, chat_input, session_dropdown],
                )

                def _load_selected_session(session_id):
                    if not session_id:
                        return []
                    return load_session_by_id(session_id)

                session_dropdown.change(
                    fn=_load_selected_session,
                    inputs=[session_dropdown],
                    outputs=[chatbot],
                )

                def _refresh_sessions():
                    choices = get_sessions_dropdown_choices()
                    return gr.update(choices=choices, value=None)

                refresh_btn.click(fn=_refresh_sessions, outputs=[session_dropdown])
                app.load(fn=_refresh_sessions, outputs=[session_dropdown])

            # ===========================================
            # TAB: DOCUMENTEN
            # ===========================================
            with gr.Tab("Documenten"):
                with gr.Column(elem_classes=["docs-page"]):
                    with gr.Row():
                        # Upload
                        with gr.Column(scale=1, elem_classes=["upload-zone"]):
                            gr.Markdown("### Upload")
                            upload_collection = gr.Textbox(
                                label="Collectie",
                                value="default",
                                placeholder="Collectienaam...",
                            )
                            upload_input = gr.File(
                                label="Sleep bestanden hierheen",
                                file_count="multiple",
                                type="filepath",
                            )
                            upload_btn = gr.Button("Upload & Verwerk", variant="primary")
                            upload_output = gr.Markdown("")

                            upload_btn.click(
                                fn=upload_files,
                                inputs=[upload_input, upload_collection],
                                outputs=upload_output,
                            )

                        # Browse + delete
                        with gr.Column(scale=2):
                            gr.Markdown("### Documenten")
                            with gr.Row():
                                browse_collection = gr.Dropdown(
                                    label="Collectie",
                                    choices=["default"],
                                    value="default",
                                    interactive=True,
                                    scale=4,
                                )
                                refresh_docs_btn = gr.Button("↻", size="sm", scale=0, min_width=44)

                            doc_table = gr.Dataframe(
                                headers=["Bestand", "Type", "Chunks"],
                                column_count=(3, "fixed"),
                                interactive=False,
                                wrap=True,
                                max_height=380,
                                elem_classes=["doc-table"],
                            )

                            with gr.Row():
                                selected_doc_info = gr.Textbox(
                                    label="Geselecteerd",
                                    interactive=False,
                                    scale=3,
                                )
                                delete_doc_btn = gr.Button(
                                    "Verwijder document",
                                    variant="stop",
                                    scale=1,
                                    elem_classes=["del-btn"],
                                )
                            doc_msg = gr.Markdown("")

                            # Events
                            def on_doc_select(evt: gr.SelectData, doc_ids):
                                idx = evt.index[0] if isinstance(evt.index, (list, tuple)) else evt.index
                                if 0 <= idx < len(doc_ids):
                                    return idx, f"Document: {doc_ids[idx][:20]}..."
                                return -1, ""

                            def on_delete_doc(col, idx, doc_ids):
                                if idx < 0 or idx >= len(doc_ids):
                                    return "Selecteer eerst een document.", [], [], -1, ""
                                try:
                                    result = _api_delete(f"/collections/{col}/documents/{doc_ids[idx]}")
                                    msg = f"✓ Verwijderd ({result.get('chunks_removed', 0)} chunks)"
                                except Exception as e:
                                    msg = f"✗ Fout: {e}"
                                data, ids = get_documents_table(col)
                                return msg, data, ids, -1, ""

                            doc_table.select(
                                fn=on_doc_select,
                                inputs=[doc_ids_state],
                                outputs=[selected_doc_idx, selected_doc_info],
                            )
                            delete_doc_btn.click(
                                fn=on_delete_doc,
                                inputs=[browse_collection, selected_doc_idx, doc_ids_state],
                                outputs=[doc_msg, doc_table, doc_ids_state, selected_doc_idx, selected_doc_info],
                            )

                            def load_docs(col):
                                return get_documents_table(col)

                            browse_collection.change(fn=load_docs, inputs=[browse_collection], outputs=[doc_table, doc_ids_state])
                            refresh_docs_btn.click(fn=load_docs, inputs=[browse_collection], outputs=[doc_table, doc_ids_state])

                            def refresh_dd():
                                c = get_collection_choices()
                                return gr.update(choices=c, value=c[0] if c else "default")

                            refresh_docs_btn.click(fn=refresh_dd, outputs=[browse_collection])
                            app.load(fn=refresh_dd, outputs=[browse_collection])
                            app.load(fn=load_docs, inputs=[browse_collection], outputs=[doc_table, doc_ids_state])

            # ===========================================
            # TAB: COLLECTIES
            # ===========================================
            with gr.Tab("Collecties"):
                with gr.Column(elem_classes=["coll-page"]):
                    with gr.Row():
                        with gr.Column():
                            refresh_col_btn = gr.Button("Ververs", variant="secondary")
                            collections_output = gr.Markdown("Laden...")

                        with gr.Column():
                            gr.Markdown("### Nieuwe collectie")
                            new_col_name = gr.Textbox(label="Naam", placeholder="mijn-collectie")
                            create_col_btn = gr.Button("Aanmaken", variant="primary")
                            create_col_output = gr.Markdown("")

                            gr.Markdown("---")
                            gr.Markdown("### Verwijderen")
                            del_col_name = gr.Textbox(label="Naam", placeholder="collectienaam")
                            del_col_btn = gr.Button("Verwijderen", variant="stop", elem_classes=["del-btn"])
                            del_col_output = gr.Markdown("")

                    refresh_col_btn.click(fn=list_collections_ui, outputs=collections_output)
                    app.load(fn=list_collections_ui, outputs=collections_output)

                    create_col_btn.click(
                        fn=create_collection_ui,
                        inputs=new_col_name,
                        outputs=[create_col_output, browse_collection],
                    ).then(fn=list_collections_ui, outputs=collections_output)

                    del_col_btn.click(
                        fn=delete_collection_ui,
                        inputs=del_col_name,
                        outputs=[del_col_output, browse_collection],
                    ).then(fn=list_collections_ui, outputs=collections_output)

    return app
