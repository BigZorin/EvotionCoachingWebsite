/* ============================================================
   Evotion RAG — Client-side Application (v4)
   Features: Streaming, Hybrid Search, Feedback, Analytics, Auth
   ============================================================ */

const API = '/api/v1';

// --- State ---
let currentSessionId = null;
let currentAgentId = null;
let currentView = 'chat';
let isLoading = false;
let agentsCache = [];
let editingAgentId = null;
let searchDebounce = null;

// --- DOM refs (set in init) ---
let $sidebar, $overlay, $sessionsEl, $chatScroll, $emptyState, $messagesEl;
let $chatInput, $sendBtn, $chatCollection, $agentSelect;
let $docsView, $collectionsView, $chatView, $agentsView, $analyticsView;
let $uploadStatus, $docsList, $collectionsList, $agentsList;

// ============================================================
// Authentication
// ============================================================

function getAuthToken() {
  return localStorage.getItem('rag_auth_token') || '';
}

function setAuthToken(token) {
  localStorage.setItem('rag_auth_token', token);
}

function clearAuthToken() {
  localStorage.removeItem('rag_auth_token');
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function showLoginScreen() {
  document.getElementById('login-overlay').style.display = 'flex';
  document.querySelector('.app').style.display = 'none';
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('login-token').value = '';
  document.getElementById('login-token').focus();
}

function hideLoginScreen() {
  document.getElementById('login-overlay').style.display = 'none';
  document.querySelector('.app').style.display = '';
}

function handleUnauthorized() {
  clearAuthToken();
  showLoginScreen();
}

async function checkAuth() {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API}/auth/verify`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.auth_required === false) {
        // Auth is disabled on server, skip login
        hideLoginScreen();
        return true;
      }
      if (data.authenticated) {
        hideLoginScreen();
        return true;
      }
    }
  } catch {
    // Server unreachable, show app anyway (offline mode)
    hideLoginScreen();
    return true;
  }
  showLoginScreen();
  return false;
}

async function attemptLogin() {
  const tokenInput = document.getElementById('login-token');
  const errorEl = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');
  const token = tokenInput.value.trim();

  if (!token) {
    errorEl.textContent = 'Voer een token in.';
    errorEl.style.display = 'block';
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Controleren...';
  errorEl.style.display = 'none';

  try {
    const res = await fetch(`${API}/auth/verify`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (res.ok) {
      setAuthToken(token);
      hideLoginScreen();
      init();
    } else {
      errorEl.textContent = 'Ongeldig token. Probeer opnieuw.';
      errorEl.style.display = 'block';
      tokenInput.value = '';
      tokenInput.focus();
    }
  } catch {
    errorEl.textContent = 'Server niet bereikbaar. Probeer later opnieuw.';
    errorEl.style.display = 'block';
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Inloggen';
  }
}

// ============================================================
// API helpers (with auth headers)
// ============================================================

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  if (res.status === 401) { handleUnauthorized(); throw new Error('Unauthorized'); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (res.status === 401) { handleUnauthorized(); throw new Error('Unauthorized'); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function apiPostForm(path, formData) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  if (res.status === 401) { handleUnauthorized(); throw new Error('Unauthorized'); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (res.status === 401) { handleUnauthorized(); throw new Error('Unauthorized'); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, { method: 'DELETE', headers: authHeaders() });
  if (res.status === 401) { handleUnauthorized(); throw new Error('Unauthorized'); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ============================================================
// Markdown rendering
// ============================================================

function renderMarkdown(text, sources) {
  // Strip follow-up tags before rendering
  text = text.replace(/<followup>.*?<\/followup>/gs, '').trim();

  let html;
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,
      gfm: true,
      highlight: function(code, lang) {
        if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        if (typeof hljs !== 'undefined') {
          return hljs.highlightAuto(code).value;
        }
        return code;
      },
    });
    html = marked.parse(text);
  } else {
    html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  // Convert [1], [2] etc. into interactive citation badges
  if (sources && sources.length > 0) {
    html = html.replace(/\[(\d+)\]/g, (match, num) => {
      const idx = parseInt(num, 10) - 1;
      if (idx >= 0 && idx < sources.length) {
        const src = sources[idx];
        const filename = escapeHtml(src.filename || 'Bron');
        const preview = escapeHtml((src.chunk_text || '').slice(0, 150));
        const score = Math.round((src.relevance_score || 0) * 100);
        return `<span class="citation-ref" data-idx="${num}" tabindex="0">[${num}]<span class="citation-tooltip"><strong>${filename}</strong> <span class="citation-score">${score}%</span><br>${preview}...</span></span>`;
      }
      return match;
    });
  }

  return html;
}

function extractFollowups(text) {
  const followups = [];
  const regex = /<followup>(.*?)<\/followup>/gs;
  let m;
  while ((m = regex.exec(text)) !== null) {
    followups.push(m[1].trim());
  }
  return followups;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================
// Toast notifications
// ============================================================

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;

  // Auto-dismiss with pause on hover
  let timer;
  const startTimer = () => { timer = setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 3000); };
  toast.addEventListener('mouseenter', () => clearTimeout(timer));
  toast.addEventListener('mouseleave', startTimer);

  document.body.appendChild(toast);
  startTimer();
}

// ============================================================
// Custom confirm dialog
// ============================================================

function showConfirm(title, message, dangerLabel = 'Verwijderen') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <div class="confirm-title">${escapeHtml(title)}</div>
        <div class="confirm-message">${escapeHtml(message)}</div>
        <div class="confirm-actions">
          <button class="btn confirm-cancel">Annuleren</button>
          <button class="btn danger confirm-ok">${escapeHtml(dangerLabel)}</button>
        </div>
      </div>
    `;

    overlay.querySelector('.confirm-cancel').addEventListener('click', () => {
      overlay.remove();
      resolve(false);
    });
    overlay.querySelector('.confirm-ok').addEventListener('click', () => {
      overlay.remove();
      resolve(true);
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });

    document.body.appendChild(overlay);
    overlay.querySelector('.confirm-cancel').focus();
  });
}

// ============================================================
// Loading spinner helper
// ============================================================

function showLoadingIn(el, message = 'Laden...') {
  el.innerHTML = `<div class="loading-state"><div class="spinner"></div><span>${escapeHtml(message)}</span></div>`;
}

// ============================================================
// Form validation helper
// ============================================================

function validateField(input, errorMsg) {
  const val = input.value.trim();
  if (!val) {
    input.classList.add('input-error');
    input.addEventListener('input', () => input.classList.remove('input-error'), { once: true });
    showToast(errorMsg, true);
    input.focus();
    return false;
  }
  input.classList.remove('input-error');
  return true;
}

// ============================================================
// View switching
// ============================================================

function switchView(view) {
  currentView = view;

  $chatView.classList.toggle('active', view === 'chat');
  $docsView.classList.toggle('active', view === 'documents');
  $collectionsView.classList.toggle('active', view === 'collections');
  $agentsView.classList.toggle('active', view === 'agents');
  $analyticsView.classList.toggle('active', view === 'analytics');

  document.getElementById('nav-docs').classList.toggle('active', view === 'documents');
  document.getElementById('nav-collections').classList.toggle('active', view === 'collections');
  document.getElementById('nav-agents').classList.toggle('active', view === 'agents');
  document.getElementById('nav-analytics').classList.toggle('active', view === 'analytics');

  closeSidebar();

  if (view === 'documents') {
    loadCollectionDropdowns();
    const col = document.getElementById('browse-collection').value;
    if (col) loadDocuments(col);
  } else if (view === 'collections') {
    loadCollections();
  } else if (view === 'agents') {
    loadAgents();
    loadAgentFormCollections();
  } else if (view === 'analytics') {
    loadAnalytics();
  }
}

// ============================================================
// Sidebar
// ============================================================

function openSidebar() {
  $sidebar.classList.add('open');
  $overlay.classList.add('active');
}

function closeSidebar() {
  $sidebar.classList.remove('open');
  $overlay.classList.remove('active');
}

function toggleSidebar() {
  if ($sidebar.classList.contains('collapsed')) {
    $sidebar.classList.remove('collapsed');
  } else {
    $sidebar.classList.add('collapsed');
  }
}

// ============================================================
// Sessions
// ============================================================

async function loadSessions(searchQuery = '') {
  try {
    const endpoint = searchQuery
      ? `/chat/sessions/search?q=${encodeURIComponent(searchQuery)}&limit=30`
      : '/chat/sessions?limit=30';
    const data = await apiGet(endpoint);
    const sessions = data.sessions || [];
    renderSessions(sessions, searchQuery);
  } catch (e) {
    console.error('Failed to load sessions:', e);
  }
}

function renderSessions(sessions, searchQuery = '') {
  if (!sessions.length) {
    $sessionsEl.innerHTML = searchQuery
      ? `<div class="sessions-empty">Geen resultaten voor "${escapeHtml(searchQuery)}"</div>`
      : '<div class="sessions-empty">Nog geen gesprekken</div>';
    return;
  }

  $sessionsEl.innerHTML = searchQuery
    ? `<div class="sessions-group-label">${sessions.length} resultaten</div>`
    : '<div class="sessions-group-label">Recente gesprekken</div>';

  sessions.forEach(s => {
    const el = document.createElement('div');
    el.className = 'session-item' + (s.id === currentSessionId ? ' active' : '');

    let agentBadge = '';
    if (s.agent_id) {
      const agent = agentsCache.find(a => a.id === s.agent_id);
      if (agent) {
        agentBadge = `<span class="session-agent-badge" title="${escapeHtml(agent.name)}">${escapeHtml(agent.icon || 'E')}</span>`;
      }
    }

    el.innerHTML = `
      ${agentBadge}
      <span class="session-title">${escapeHtml(s.title || 'Nieuw gesprek')}</span>
      <button class="session-delete" title="Verwijder" data-id="${s.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
    `;

    el.addEventListener('click', (e) => {
      if (e.target.closest('.session-delete')) return;
      loadSession(s.id, s.agent_id);
      switchView('chat');
    });

    const delBtn = el.querySelector('.session-delete');
    delBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await showConfirm('Gesprek verwijderen', 'Weet je zeker dat je dit gesprek wilt verwijderen?');
      if (!ok) return;
      try {
        await apiDelete(`/chat/sessions/${s.id}`);
        if (currentSessionId === s.id) newChat();
        loadSessions();
        showToast('Gesprek verwijderd');
      } catch (err) {
        showToast('Kon gesprek niet verwijderen', true);
      }
    });

    $sessionsEl.appendChild(el);
  });
}

async function loadSession(sessionId, agentId = null) {
  try {
    const data = await apiGet(`/chat/sessions/${sessionId}`);
    currentSessionId = sessionId;
    currentAgentId = agentId || data.session?.agent_id || null;
    const messages = data.messages || [];

    $messagesEl.innerHTML = '';
    $emptyState.style.display = 'none';

    if (currentAgentId) {
      $agentSelect.value = currentAgentId;
    }

    messages.forEach(m => {
      appendMessage(m.role, m.content, m.role === 'assistant', m.sources || [], m.id);
    });

    scrollToBottom();
    loadSessions();
  } catch (e) {
    showToast('Kon gesprek niet laden', true);
  }
}

function newChat() {
  currentSessionId = null;
  $messagesEl.innerHTML = '';
  $emptyState.style.display = '';
  $chatInput.value = '';
  $chatInput.style.height = 'auto';
  updateSendBtn();
  loadSessions();
}

// ============================================================
// Chat (Streaming via SSE)
// ============================================================

async function sendMessage() {
  const message = $chatInput.value.trim();
  if (!message || isLoading) return;

  isLoading = true;
  $chatInput.value = '';
  $chatInput.style.height = 'auto';
  updateSendBtn();

  $emptyState.style.display = 'none';
  appendMessage('user', message);

  try {
    if (!currentSessionId) {
      const collection = $chatCollection.value || null;
      const agentId = $agentSelect.value || null;
      const session = await apiPost('/chat/sessions', { collection, agent_id: agentId });
      currentSessionId = session.id;
      currentAgentId = agentId;
    }

    await streamResponse(currentSessionId, message);
    loadSessions();
  } catch (e) {
    appendMessage('assistant', `Er ging iets mis: ${e.message}`);
    scrollToBottom();
  } finally {
    isLoading = false;
    updateSendBtn();
  }
}

async function streamResponse(sessionId, message) {
  // Create the assistant message element for streaming
  const el = document.createElement('div');
  el.className = 'message assistant';

  let avatar = 'E';
  if (currentAgentId) {
    const agent = agentsCache.find(a => a.id === currentAgentId);
    if (agent) avatar = agent.icon || 'E';
  }

  el.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="retrieval-status"><div class="spinner-sm"></div><span>Voorbereiden...</span></div>
      <div class="streaming-text"></div>
    </div>
  `;
  $messagesEl.appendChild(el);

  const statusEl = el.querySelector('.retrieval-status');
  const streamingText = el.querySelector('.streaming-text');
  let fullText = '';
  let sources = [];
  let messageId = null;

  const res = await fetch(`${API}/chat/sessions/${sessionId}/messages/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, top_k: 15 }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let firstToken = true;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    let eventType = null;

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith('data: ') && eventType) {
        const data = JSON.parse(line.slice(6));

        if (eventType === 'status') {
          statusEl.querySelector('span').textContent = data;
        } else if (eventType === 'sources') {
          sources = data;
        } else if (eventType === 'token') {
          if (firstToken) {
            statusEl.style.display = 'none';
            streamingText.innerHTML = '';
            firstToken = false;
          }
          fullText += data;
          streamingText.innerHTML = renderMarkdown(fullText, sources);
          scrollToBottom();
        } else if (eventType === 'done') {
          messageId = data.message_id || null;
        } else if (eventType === 'error') {
          statusEl.style.display = 'none';
          streamingText.innerHTML = `<p class="error-text">Fout: ${escapeHtml(data.detail || 'Onbekende fout')}</p>`;
        }
        eventType = null;
      }
    }
  }

  // Extract follow-up suggestions
  const followups = extractFollowups(fullText);

  // Final render with citations, sources, feedback, follow-ups, retry
  const contentEl = el.querySelector('.message-content');
  statusEl.remove();
  const sourcesHtml = buildSourcesHtml(sources);
  const followupsHtml = buildFollowupsHtml(followups);

  const feedbackHtml = `<div class="message-actions">
    <div class="message-feedback" data-feedback="none"${messageId ? ` data-message-id="${messageId}"` : ''}>
      <button class="feedback-btn thumbs-up" title="Goed antwoord">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
        </svg>
      </button>
      <button class="feedback-btn thumbs-down" title="Slecht antwoord">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 4H17"/>
        </svg>
      </button>
    </div>
    <button class="retry-btn" title="Opnieuw genereren">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
      </svg>
    </button>
  </div>`;

  contentEl.innerHTML = `
    <div>${renderMarkdown(fullText, sources)}</div>
    ${sourcesHtml}
    ${feedbackHtml}
    ${followupsHtml}
  `;

  // Attach feedback handlers using message_id directly
  const feedbackDiv = contentEl.querySelector('.message-feedback');
  if (messageId) {
    feedbackDiv.querySelector('.thumbs-up').addEventListener('click', () => submitFeedbackDirect(messageId, feedbackDiv, 'positive'));
    feedbackDiv.querySelector('.thumbs-down').addEventListener('click', () => submitFeedbackDirect(messageId, feedbackDiv, 'negative'));
  } else {
    feedbackDiv.querySelector('.thumbs-up').addEventListener('click', () => submitStreamFeedbackLegacy(feedbackDiv, 'positive'));
    feedbackDiv.querySelector('.thumbs-down').addEventListener('click', () => submitStreamFeedbackLegacy(feedbackDiv, 'negative'));
  }

  // Attach retry handler
  contentEl.querySelector('.retry-btn').addEventListener('click', () => retryLastMessage(message));

  // Attach follow-up handlers
  contentEl.querySelectorAll('.followup-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $chatInput.value = btn.textContent;
      autoResizeInput();
      sendMessage();
    });
  });
}

async function submitStreamFeedbackLegacy(feedbackDiv, feedback) {
  try {
    const data = await apiGet(`/chat/sessions/${currentSessionId}`);
    const messages = data.messages || [];
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistant) return;

    await apiPost('/chat/feedback', { message_id: lastAssistant.id, feedback });
    feedbackDiv.dataset.feedback = feedback;
    feedbackDiv.querySelector('.thumbs-up').classList.toggle('active', feedback === 'positive');
    feedbackDiv.querySelector('.thumbs-down').classList.toggle('active', feedback === 'negative');
    showToast(feedback === 'positive' ? 'Bedankt voor je feedback!' : 'Feedback opgeslagen');
  } catch (e) {
    showToast('Feedback kon niet worden opgeslagen', true);
  }
}

function buildFollowupsHtml(followups) {
  if (!followups || followups.length === 0) return '';
  const buttons = followups.map(q =>
    `<button class="followup-btn">${escapeHtml(q)}</button>`
  ).join('');
  return `<div class="followup-suggestions"><span class="followup-label">Stel ook:</span>${buttons}</div>`;
}

async function retryLastMessage(originalMessage) {
  if (isLoading || !currentSessionId) return;

  // Remove the last assistant message from the DOM
  const allMsgs = $messagesEl.querySelectorAll('.message.assistant');
  if (allMsgs.length > 0) {
    allMsgs[allMsgs.length - 1].remove();
  }

  isLoading = true;
  updateSendBtn();

  try {
    await streamResponse(currentSessionId, originalMessage);
    loadSessions();
  } catch (e) {
    appendMessage('assistant', `Er ging iets mis: ${e.message}`);
    scrollToBottom();
  } finally {
    isLoading = false;
    updateSendBtn();
  }
}

function buildSourcesHtml(sources) {
  if (!sources || sources.length === 0) return '';

  const unique = {};
  sources.forEach(s => {
    const fn = s.filename || 'unknown';
    const sc = s.relevance_score || 0;
    if (!unique[fn] || sc > unique[fn]) unique[fn] = sc;
  });
  const chips = Object.entries(unique)
    .map(([fn, sc]) => `<span class="source-chip"><span class="source-name">${escapeHtml(fn)}</span> ${Math.round(sc * 100)}%</span>`)
    .join('');
  return `<div class="sources">${chips}</div>`;
}

function appendMessage(role, content, isMarkdown = false, sources = [], messageId = null) {
  const el = document.createElement('div');
  el.className = `message ${role}`;
  el.setAttribute('role', 'article');
  el.setAttribute('aria-label', role === 'user' ? 'Gebruiker bericht' : 'Assistent antwoord');
  if (messageId) el.dataset.messageId = messageId;

  let avatar = role === 'user' ? 'U' : 'E';
  if (role === 'assistant' && currentAgentId) {
    const agent = agentsCache.find(a => a.id === currentAgentId);
    if (agent) avatar = agent.icon || 'E';
  }
  const renderedContent = role === 'assistant' || isMarkdown
    ? renderMarkdown(content, sources)
    : `<p>${escapeHtml(content)}</p>`;

  const sourcesHtml = buildSourcesHtml(sources);

  // Add feedback + retry for assistant messages
  let actionsHtml = '';
  if (role === 'assistant' && messageId) {
    actionsHtml = `<div class="message-actions">
      <div class="message-feedback" data-feedback="none" data-message-id="${messageId}">
        <button class="feedback-btn thumbs-up" aria-label="Goed antwoord" title="Goed antwoord">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
          </svg>
        </button>
        <button class="feedback-btn thumbs-down" aria-label="Slecht antwoord" title="Slecht antwoord">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 4H17"/>
          </svg>
        </button>
      </div>
    </div>`;
  }

  // Edit button for user messages
  let editBtnHtml = '';
  if (role === 'user') {
    editBtnHtml = `<button class="msg-edit-btn" aria-label="Bericht bewerken" title="Bewerken">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>`;
  }

  el.innerHTML = `
    <div class="message-avatar" aria-hidden="true">${avatar}</div>
    <div class="message-content">${renderedContent}${sourcesHtml}${actionsHtml}</div>
    ${editBtnHtml}
  `;

  // Attach feedback handlers for loaded messages
  if (role === 'assistant' && messageId) {
    const feedbackDiv = el.querySelector('.message-feedback');
    feedbackDiv.querySelector('.thumbs-up').addEventListener('click', () => submitFeedbackDirect(messageId, feedbackDiv, 'positive'));
    feedbackDiv.querySelector('.thumbs-down').addEventListener('click', () => submitFeedbackDirect(messageId, feedbackDiv, 'negative'));
  }

  // Attach edit handler for user messages
  if (role === 'user') {
    const editBtn = el.querySelector('.msg-edit-btn');
    if (editBtn) editBtn.addEventListener('click', () => editUserMessage(el));
  }

  $messagesEl.appendChild(el);
  scrollToBottom();
}

async function submitFeedbackDirect(messageId, feedbackDiv, feedback) {
  try {
    await apiPost('/chat/feedback', { message_id: messageId, feedback });
    feedbackDiv.dataset.feedback = feedback;
    feedbackDiv.querySelector('.thumbs-up').classList.toggle('active', feedback === 'positive');
    feedbackDiv.querySelector('.thumbs-down').classList.toggle('active', feedback === 'negative');
    showToast(feedback === 'positive' ? 'Bedankt voor je feedback!' : 'Feedback opgeslagen');
  } catch (e) {
    showToast('Feedback kon niet worden opgeslagen', true);
  }
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    $chatScroll.scrollTop = $chatScroll.scrollHeight;
  });
}

function updateSendBtn() {
  const hasText = $chatInput.value.trim().length > 0;
  $sendBtn.disabled = !hasText || isLoading;
}

function autoResizeInput() {
  $chatInput.style.height = 'auto';
  $chatInput.style.height = Math.min($chatInput.scrollHeight, 200) + 'px';
  updateSendBtn();
}

// ============================================================
// Documents
// ============================================================

async function loadCollectionDropdowns() {
  try {
    const data = await apiGet('/collections');
    const collections = (data.collections || []).map(c => c.name);

    const selects = [
      document.getElementById('upload-collection'),
      document.getElementById('browse-collection'),
      $chatCollection,
      document.getElementById('url-collection'),
    ];

    selects.forEach((sel, i) => {
      const currentVal = sel.value;
      sel.innerHTML = '';

      if (i === 2) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Alle collecties';
        sel.appendChild(opt);
      }

      collections.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        sel.appendChild(opt);
      });

      if (currentVal && collections.includes(currentVal)) {
        sel.value = currentVal;
      } else if (i !== 2 && collections.length) {
        sel.value = collections[0];
      }
    });
  } catch (e) {
    console.error('Failed to load collections:', e);
  }
}

async function loadDocuments(collectionName) {
  if (!collectionName) return;
  showLoadingIn($docsList, 'Documenten laden...');

  try {
    const data = await apiGet(`/collections/${collectionName}`);
    const docs = data.documents || [];
    renderDocuments(docs, collectionName);
  } catch (e) {
    $docsList.innerHTML = '<div class="empty-docs">Fout bij laden documenten</div>';
  }
}

function renderDocuments(docs, collectionName) {
  if (!docs.length) {
    $docsList.innerHTML = '<div class="empty-docs">Geen documenten in deze collectie</div>';
    return;
  }

  $docsList.innerHTML = '';
  docs.forEach(doc => {
    const fileType = doc.file_type || '';
    const ext = (fileType || doc.filename?.split('.').pop() || '?').toUpperCase();
    // Determine badge for special document types
    let badge = '';
    if (fileType === 'audio') {
      badge = '<span class="doc-badge badge-transcribed">Getranscribeerd</span>';
    } else if (fileType === 'web') {
      badge = '<span class="doc-badge badge-web">Webpagina</span>';
    } else if (fileType === 'youtube') {
      badge = '<span class="doc-badge badge-youtube">YouTube</span>';
    }
    const el = document.createElement('div');
    el.className = 'doc-item';
    el.innerHTML = `
      <div class="doc-icon">${escapeHtml(ext.substring(0, 4))}</div>
      <div class="doc-info">
        <div class="doc-name">${escapeHtml(doc.filename || 'onbekend')}${badge}</div>
        <div class="doc-meta">${doc.total_chunks || 0} chunks</div>
      </div>
      <button class="doc-preview-btn" title="Bekijk chunks" data-doc-id="${escapeHtml(doc.document_id)}" data-doc-name="${escapeHtml(doc.filename || 'onbekend')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
      <button class="doc-delete" title="Verwijder document">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
    `;

    el.querySelector('.doc-preview-btn').addEventListener('click', () => {
      openDocPreview(collectionName, doc.document_id, doc.filename || 'onbekend');
    });

    el.querySelector('.doc-delete').addEventListener('click', async () => {
      const ok = await showConfirm('Document verwijderen', `'${doc.filename}' verwijderen uit ${collectionName}?`);
      if (!ok) return;
      try {
        const result = await apiDelete(`/collections/${collectionName}/documents/${doc.document_id}`);
        showToast(`Verwijderd (${result.chunks_removed || 0} chunks)`);
        loadDocuments(collectionName);
      } catch (e) {
        showToast('Kon document niet verwijderen', true);
      }
    });

    $docsList.appendChild(el);
  });
}

// Recursively collect files from drag-dropped directory entries
async function collectFilesFromEntries(entries) {
  const files = [];
  async function readEntry(entry) {
    if (entry.isFile) {
      const file = await new Promise(resolve => entry.file(resolve));
      // Skip hidden files and system files
      if (!file.name.startsWith('.') && file.size > 0) files.push(file);
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
        for (const child of batch) await readEntry(child);
      } while (batch.length > 0);
    }
  }
  for (const entry of entries) await readEntry(entry);
  return files;
}

function uploadFileWithProgress(file, collection, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collection', collection);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress('uploading', Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.upload.addEventListener('load', () => {
      onProgress('processing', 100);
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 401) { handleUnauthorized(); reject(new Error('Unauthorized')); return; }
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); } catch { resolve({}); }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.detail || `${xhr.status} ${xhr.statusText}`));
        } catch { reject(new Error(`${xhr.status} ${xhr.statusText}`)); }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Netwerkfout')));
    xhr.addEventListener('abort', () => reject(new Error('Upload geannuleerd')));

    xhr.open('POST', `${API}/documents/upload`);
    const token = getAuthToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
}

async function uploadFiles(fileListOrArray) {
  // Accept both FileList and Array of Files
  const files = Array.from(fileListOrArray);
  const collection = document.getElementById('upload-collection').value || 'default';
  const statusEl = document.getElementById('upload-status');
  const uploadBtn = document.getElementById('upload-btn');
  const progressEl = document.getElementById('upload-progress');
  const progressLabel = document.getElementById('upload-progress-label');
  const progressPct = document.getElementById('upload-progress-pct');
  const progressBar = document.getElementById('upload-progress-bar');
  const progressFiles = document.getElementById('upload-progress-files');

  if (!files || !files.length) {
    statusEl.textContent = 'Geen bestanden geselecteerd.';
    statusEl.className = 'upload-status error';
    return;
  }

  // Reset & show progress UI
  const folderBtn = document.getElementById('folder-upload-btn');
  uploadBtn.disabled = true;
  folderBtn.disabled = true;
  statusEl.textContent = '';
  statusEl.className = 'upload-status';
  progressEl.classList.add('active');
  progressBar.style.width = '0%';
  progressBar.classList.remove('processing');
  progressPct.textContent = '0%';
  progressLabel.textContent = `Uploaden (0/${files.length})...`;

  // Build file list UI
  progressFiles.innerHTML = '';
  const fileEls = [];
  for (let i = 0; i < files.length; i++) {
    const row = document.createElement('div');
    row.className = 'upload-file-item';
    row.innerHTML = `
      <span class="upload-file-icon pending">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </span>
      <span class="upload-file-name">${escapeHtml(files[i].name)}</span>
      <span class="upload-file-status">Wachtend</span>
    `;
    progressFiles.appendChild(row);
    fileEls.push(row);
  }

  let totalChunks = 0;
  let completedFiles = 0;
  const results = [];

  const iconSvg = {
    uploading: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    processing: '<div class="spinner-sm"></div>',
    done: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const row = fileEls[i];
    const iconEl = row.querySelector('.upload-file-icon');
    const statusSpan = row.querySelector('.upload-file-status');

    // Mark as uploading
    iconEl.className = 'upload-file-icon uploading';
    iconEl.innerHTML = iconSvg.uploading;
    statusSpan.textContent = 'Uploaden...';
    progressLabel.textContent = `Uploaden (${i + 1}/${files.length})...`;

    try {
      const response = await uploadFileWithProgress(file, collection, (phase, pct) => {
        if (phase === 'uploading') {
          // Per-file upload progress → map to overall
          const fileWeight = 1 / files.length;
          const overallPct = Math.round((completedFiles * fileWeight + (pct / 100) * fileWeight * 0.5) * 100);
          progressBar.style.width = overallPct + '%';
          progressPct.textContent = overallPct + '%';
          statusSpan.textContent = `Uploaden ${pct}%`;
        } else if (phase === 'processing') {
          // Upload done, server is processing
          iconEl.className = 'upload-file-icon processing';
          iconEl.innerHTML = iconSvg.processing;
          statusSpan.textContent = 'Verwerken & embedden...';
          progressLabel.textContent = `Verwerken ${file.name}...`;
          progressBar.classList.add('processing');
        }
      });

      progressBar.classList.remove('processing');
      const chunks = response.chunks_created || 0;
      totalChunks += chunks;
      completedFiles++;
      results.push(`${file.name} — ${chunks} chunks`);

      // Mark done
      row.className = 'upload-file-item done';
      iconEl.className = 'upload-file-icon done';
      iconEl.innerHTML = iconSvg.done;
      statusSpan.textContent = `${chunks} chunks`;

      // Update overall progress
      const overallPct = Math.round((completedFiles / files.length) * 100);
      progressBar.style.width = overallPct + '%';
      progressPct.textContent = overallPct + '%';

    } catch (e) {
      progressBar.classList.remove('processing');
      completedFiles++;
      results.push(`${file.name} — fout: ${e.message}`);

      row.className = 'upload-file-item error';
      iconEl.className = 'upload-file-icon error';
      iconEl.innerHTML = iconSvg.error;
      statusSpan.textContent = e.message;

      const overallPct = Math.round((completedFiles / files.length) * 100);
      progressBar.style.width = overallPct + '%';
      progressPct.textContent = overallPct + '%';
    }
  }

  // Final state
  progressBar.style.width = '100%';
  progressPct.textContent = '100%';
  progressLabel.textContent = `Klaar — ${files.length} bestanden, ${totalChunks} chunks`;
  uploadBtn.disabled = false;
  folderBtn.disabled = false;

  // Hide progress after 8 seconds
  setTimeout(() => {
    progressEl.classList.remove('active');
  }, 8000);

  const browseCol = document.getElementById('browse-collection').value;
  if (browseCol) loadDocuments(browseCol);
  loadCollectionDropdowns();
}

// ============================================================
// URL Upload
// ============================================================

async function uploadUrl() {
  const urlInput = document.getElementById('url-input');
  const collection = document.getElementById('url-collection').value || 'default';
  const statusEl = document.getElementById('url-upload-status');
  const btn = document.getElementById('url-upload-btn');
  const url = urlInput.value.trim();

  if (!url) {
    statusEl.textContent = 'Voer een URL in.';
    statusEl.className = 'url-upload-status error';
    return;
  }

  btn.disabled = true;
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  statusEl.textContent = isYouTube ? 'YouTube transcript ophalen...' : 'Webpagina ophalen & verwerken...';
  statusEl.className = 'url-upload-status loading';

  try {
    const result = await apiPost('/documents/upload-url', { url, collection });
    if (result.status === 'success') {
      statusEl.textContent = `${result.filename} — ${result.chunks_created} chunks aangemaakt`;
      statusEl.className = 'url-upload-status success';
      urlInput.value = '';
      const browseCol = document.getElementById('browse-collection').value;
      if (browseCol) loadDocuments(browseCol);
      loadCollectionDropdowns();
    } else {
      statusEl.textContent = `Fout: ${result.filename || url}`;
      statusEl.className = 'url-upload-status error';
    }
  } catch (e) {
    statusEl.textContent = `Fout: ${e.message || 'URL kon niet worden verwerkt'}`;
    statusEl.className = 'url-upload-status error';
  } finally {
    btn.disabled = false;
  }
}

// ============================================================
// Document Preview
// ============================================================

async function openDocPreview(collectionName, documentId, filename) {
  const modal = document.getElementById('doc-preview-modal');
  const title = document.getElementById('doc-preview-title');
  const body = document.getElementById('doc-preview-body');

  title.textContent = filename;
  body.innerHTML = '<div class="loading-state"><div class="spinner"></div><span>Chunks laden...</span></div>';
  modal.style.display = 'flex';

  try {
    const data = await apiGet(`/collections/${collectionName}/documents/${documentId}/chunks`);
    const chunks = data.chunks || [];

    if (!chunks.length) {
      body.innerHTML = '<div class="empty-docs">Geen chunks gevonden voor dit document</div>';
      return;
    }

    body.innerHTML = `<div style="margin-bottom:12px;font-size:12px;color:var(--text-muted)">${chunks.length} chunks in collectie "${escapeHtml(collectionName)}"</div>`;

    chunks.forEach((chunk, i) => {
      const div = document.createElement('div');
      div.className = 'chunk-item';

      const meta = chunk.metadata || {};
      const metaParts = [];
      if (meta.page) metaParts.push(`Pagina ${meta.page}`);
      if (meta.section) metaParts.push(meta.section);
      if (meta.source_url) metaParts.push(meta.source_url);

      div.innerHTML = `
        <div class="chunk-item-header">
          <span class="chunk-idx">Chunk ${chunk.chunk_index + 1}</span>
          <span>${metaParts.join(' · ') || ''}</span>
        </div>
        <div>${escapeHtml(chunk.content)}</div>
      `;
      body.appendChild(div);
    });
  } catch (e) {
    body.innerHTML = `<div class="empty-docs">Fout bij laden: ${escapeHtml(e.message)}</div>`;
  }
}

// ============================================================
// Groq Usage
// ============================================================

async function loadGroqUsage() {
  try {
    const data = await apiGet('/usage');
    return data;
  } catch (e) {
    console.error('Failed to load usage:', e);
    return null;
  }
}

function renderGroqUsageSection(usage) {
  if (!usage) return '';

  const today = usage.today || {};
  const month = usage.this_month || {};
  const models = usage.by_model || [];

  function fmtCost(v) { return '$' + (v || 0).toFixed(4); }
  function fmtNum(v) { return (v || 0).toLocaleString(); }
  function fmtAudio(s) {
    if (!s) return '0s';
    if (s < 60) return Math.round(s) + 's';
    return Math.round(s / 60) + 'min';
  }

  let modelRows = '';
  if (models.length) {
    modelRows = models.map(m => `
      <tr>
        <td>${escapeHtml(m.model)}</td>
        <td>${m.type}</td>
        <td>${fmtNum(m.requests)}</td>
        <td>${fmtNum(m.tokens)}</td>
        <td>${fmtAudio(m.audio_seconds)}</td>
        <td>${fmtCost(m.cost)}</td>
      </tr>
    `).join('');
  }

  return `
    <div class="usage-section">
      <h3>Groq API Gebruik</h3>
      <div class="usage-stats">
        <div class="usage-stat-card">
          <div class="usage-stat-value">${fmtNum(today.requests)}</div>
          <div class="usage-stat-label">Requests vandaag</div>
        </div>
        <div class="usage-stat-card">
          <div class="usage-stat-value">${fmtNum(today.total_tokens)}</div>
          <div class="usage-stat-label">Tokens vandaag</div>
        </div>
        <div class="usage-stat-card">
          <div class="usage-stat-value">${fmtAudio(today.audio_seconds)}</div>
          <div class="usage-stat-label">Audio vandaag</div>
        </div>
        <div class="usage-stat-card">
          <div class="usage-stat-value">${fmtCost(today.estimated_cost)}</div>
          <div class="usage-stat-label">Kosten vandaag</div>
        </div>
        <div class="usage-stat-card">
          <div class="usage-stat-value">${fmtNum(month.requests)}</div>
          <div class="usage-stat-label">Requests deze maand</div>
        </div>
        <div class="usage-stat-card">
          <div class="usage-stat-value">${fmtNum(month.total_tokens)}</div>
          <div class="usage-stat-label">Tokens deze maand</div>
        </div>
        <div class="usage-stat-card">
          <div class="usage-stat-value">${fmtAudio(month.audio_seconds)}</div>
          <div class="usage-stat-label">Audio deze maand</div>
        </div>
        <div class="usage-stat-card">
          <div class="usage-stat-value">${fmtCost(month.estimated_cost)}</div>
          <div class="usage-stat-label">Kosten deze maand</div>
        </div>
      </div>
      ${models.length ? `
        <table class="usage-model-table">
          <thead>
            <tr><th>Model</th><th>Type</th><th>Requests</th><th>Tokens</th><th>Audio</th><th>Kosten</th></tr>
          </thead>
          <tbody>${modelRows}</tbody>
        </table>
      ` : ''}
    </div>
  `;
}

// ============================================================
// Collections
// ============================================================

async function loadCollections() {
  showLoadingIn($collectionsList, 'Collecties laden...');
  try {
    const data = await apiGet('/collections');
    const collections = data.collections || [];
    renderCollections(collections);
  } catch (e) {
    $collectionsList.innerHTML = '<div class="empty-docs">Fout bij laden collecties</div>';
  }
}

function renderCollections(collections) {
  $collectionsList.innerHTML = '';

  if (!collections.length) {
    $collectionsList.innerHTML = '<div class="empty-docs">Geen collecties gevonden</div>';
    return;
  }

  collections.forEach(col => {
    const el = document.createElement('div');
    el.className = 'collection-item';
    el.innerHTML = `
      <div class="collection-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      </div>
      <div class="collection-info">
        <div class="collection-name">${escapeHtml(col.name)}</div>
        <div class="collection-stats">${col.document_count || 0} documenten - ${col.total_chunks || 0} chunks</div>
      </div>
      <button class="collection-delete" title="Verwijder collectie">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
    `;

    el.querySelector('.collection-delete').addEventListener('click', async () => {
      const ok = await showConfirm('Collectie verwijderen', `Collectie '${col.name}' verwijderen? Alle documenten worden gewist.`);
      if (!ok) return;
      try {
        const result = await apiDelete(`/collections/${col.name}`);
        let msg = `Collectie '${col.name}' verwijderd`;
        if (result.warning) msg += `. ${result.warning}`;
        showToast(msg);
        loadCollections();
        loadCollectionDropdowns();
      } catch (e) {
        showToast('Kon collectie niet verwijderen', true);
      }
    });

    $collectionsList.appendChild(el);
  });
}

async function createCollection() {
  const input = document.getElementById('new-col-name');
  if (!validateField(input, 'Geef een naam op voor de collectie')) return;

  const name = input.value.trim();
  try {
    await apiPost('/collections', { name });
    showToast(`Collectie '${name}' aangemaakt`);
    input.value = '';
    loadCollections();
    loadCollectionDropdowns();
  } catch (e) {
    showToast(`Fout: ${e.message}`, true);
  }
}

// ============================================================
// Agents
// ============================================================

async function loadAgents() {
  try {
    const agents = await apiGet('/agents');
    agentsCache = agents;
    renderAgents(agents);
    updateAgentDropdown(agents);
  } catch (e) {
    console.error('Failed to load agents:', e);
  }
}

function updateAgentDropdown(agents) {
  const current = $agentSelect.value;
  $agentSelect.innerHTML = '<option value="">Geen agent (standaard)</option>';
  agents.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = `${a.icon} ${a.name}`;
    $agentSelect.appendChild(opt);
  });
  if (current && agents.find(a => a.id === current)) {
    $agentSelect.value = current;
  }
}

function renderAgents(agents) {
  const titleEl = document.getElementById('agents-list-title');

  if (!agents.length) {
    titleEl.style.display = 'none';
    $agentsList.innerHTML = `
      <div class="agents-empty">
        <div class="agents-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="agents-empty-title">Nog geen agents</div>
        <div class="agents-empty-desc">Maak je eerste agent aan via het formulier hierboven.</div>
      </div>
    `;
    return;
  }

  titleEl.style.display = '';
  titleEl.textContent = `Jouw Agents (${agents.length})`;
  $agentsList.innerHTML = '';

  agents.forEach(agent => {
    const colTags = agent.collections.length
      ? agent.collections.map(c => `<span class="agent-tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>${escapeHtml(c)}</span>`).join('')
      : '<span class="agent-tag">Alle collecties</span>';

    const promptPreview = agent.system_prompt.length > 120
      ? agent.system_prompt.substring(0, 120) + '...'
      : agent.system_prompt;

    const el = document.createElement('div');
    el.className = 'agent-card';
    el.innerHTML = `
      <div class="agent-avatar">${escapeHtml(agent.icon || 'E')}</div>
      <div class="agent-details">
        <div class="agent-name">${escapeHtml(agent.name)}</div>
        <div class="agent-desc">${escapeHtml(agent.description || 'Geen beschrijving')}</div>
        <div class="agent-prompt-preview">${escapeHtml(promptPreview)}</div>
        <div class="agent-meta">${colTags}
          <span class="agent-tag">temp: ${agent.temperature}</span>
          <span class="agent-tag">top_k: ${agent.top_k}</span>
        </div>
      </div>
      <div class="agent-actions">
        <button class="agent-action-btn chat-btn agent-use" title="Chat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Chat
        </button>
        <button class="agent-action-btn edit-btn agent-edit" title="Bewerk">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Bewerk
        </button>
        <button class="agent-action-btn del-btn agent-del" title="Verwijder">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
          Verwijder
        </button>
      </div>
    `;

    el.querySelector('.agent-use').addEventListener('click', () => {
      $agentSelect.value = agent.id;
      currentAgentId = agent.id;
      newChat();
      switchView('chat');
      showToast(`Agent '${agent.name}' geselecteerd`);
    });

    el.querySelector('.agent-edit').addEventListener('click', () => editAgent(agent));

    el.querySelector('.agent-del').addEventListener('click', async () => {
      const ok = await showConfirm('Agent verwijderen', `Agent '${agent.name}' verwijderen?`);
      if (!ok) return;
      try {
        await apiDelete(`/agents/${agent.id}`);
        showToast(`Agent '${agent.name}' verwijderd`);
        loadAgents();
      } catch (e) {
        showToast('Kon agent niet verwijderen', true);
      }
    });

    $agentsList.appendChild(el);
  });
}

function editAgent(agent) {
  editingAgentId = agent.id;

  const formBody = document.getElementById('agent-form-body');
  formBody.classList.remove('collapsed');
  updateToggleBtn(false);

  document.getElementById('agent-name').value = agent.name;
  document.getElementById('agent-icon').value = agent.icon || 'E';
  document.getElementById('agent-desc').value = agent.description || '';
  document.getElementById('agent-prompt').value = agent.system_prompt;
  document.getElementById('agent-temp').value = agent.temperature;
  document.getElementById('agent-topk').value = agent.top_k;

  const colSelect = document.getElementById('agent-collections');
  Array.from(colSelect.options).forEach(opt => {
    opt.selected = agent.collections.includes(opt.value);
  });

  const submitBtn = document.getElementById('create-agent-btn');
  submitBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
    Wijzigingen opslaan
  `;

  let cancelBtn = document.getElementById('cancel-edit-btn');
  if (!cancelBtn) {
    cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-edit-btn';
    cancelBtn.className = 'btn cancel-edit-btn';
    cancelBtn.textContent = 'Annuleren';
    cancelBtn.addEventListener('click', cancelEditAgent);
    submitBtn.parentNode.insertBefore(cancelBtn, submitBtn.nextSibling);
  }
  cancelBtn.style.display = '';

  document.querySelector('.agent-form-card .card-header-row h3').textContent = `Agent bewerken: ${agent.name}`;
  document.querySelector('.agent-form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`Bewerken: ${agent.name}`);
}

function cancelEditAgent() {
  editingAgentId = null;
  resetAgentForm();
}

function resetAgentForm() {
  editingAgentId = null;

  document.getElementById('agent-name').value = '';
  document.getElementById('agent-icon').value = '';
  document.getElementById('agent-desc').value = '';
  document.getElementById('agent-prompt').value = '';
  document.getElementById('agent-temp').value = '0.7';
  document.getElementById('agent-topk').value = '15';

  const colSelect = document.getElementById('agent-collections');
  Array.from(colSelect.options).forEach(opt => { opt.selected = false; });

  const submitBtn = document.getElementById('create-agent-btn');
  submitBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    Agent aanmaken
  `;

  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'none';

  document.querySelector('.agent-form-card .card-header-row h3').textContent = 'Nieuwe Agent';
}

async function loadAgentFormCollections() {
  try {
    const data = await apiGet('/collections');
    const sel = document.getElementById('agent-collections');
    const currentSelections = Array.from(sel.selectedOptions).map(o => o.value);
    sel.innerHTML = '';
    (data.collections || []).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = `${c.name} (${c.document_count} docs)`;
      opt.selected = currentSelections.includes(c.name);
      sel.appendChild(opt);
    });
  } catch (e) {
    console.error('Failed to load collections for agent form:', e);
  }
}

async function saveAgent() {
  const nameInput = document.getElementById('agent-name');
  const promptInput = document.getElementById('agent-prompt');

  if (!validateField(nameInput, 'Geef de agent een naam')) return;
  if (!validateField(promptInput, 'System prompt is verplicht')) return;

  const name = nameInput.value.trim();
  const desc = document.getElementById('agent-desc').value.trim();
  const prompt = promptInput.value.trim();
  const icon = document.getElementById('agent-icon').value.trim() || 'E';
  const temp = parseFloat(document.getElementById('agent-temp').value) || 0.7;
  const topk = parseInt(document.getElementById('agent-topk').value) || 15;

  const colSelect = document.getElementById('agent-collections');
  const collections = Array.from(colSelect.selectedOptions).map(o => o.value);

  const payload = {
    name, description: desc, system_prompt: prompt,
    collections, temperature: temp, top_k: topk, icon,
  };

  const submitBtn = document.getElementById('create-agent-btn');
  const origHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> Opslaan...';

  try {
    if (editingAgentId) {
      await apiPut(`/agents/${editingAgentId}`, payload);
      showToast(`Agent '${name}' bijgewerkt!`);
    } else {
      await apiPost('/agents', payload);
      showToast(`Agent '${name}' aangemaakt!`);
    }

    resetAgentForm();
    loadAgents();
  } catch (e) {
    showToast(`Fout: ${e.message}`, true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origHtml;
  }
}

function updateToggleBtn(isHidden) {
  const toggleFormBtn = document.getElementById('toggle-agent-form');
  toggleFormBtn.innerHTML = isHidden
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Formulier tonen`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg> Formulier verbergen`;
}

// ============================================================
// Analytics Dashboard
// ============================================================

async function loadAnalytics() {
  const container = document.getElementById('analytics-content');
  showLoadingIn(container, 'Analytics laden...');

  try {
    const [data, usage] = await Promise.all([
      apiGet('/chat/analytics'),
      loadGroqUsage(),
    ]);
    renderAnalytics(data, container, usage);
  } catch (e) {
    container.innerHTML = `<div class="empty-docs">Fout bij laden analytics: ${escapeHtml(e.message)}</div>`;
  }
}

function renderAnalytics(data, container, usage) {
  const totals = data.totals || {};
  const feedback = data.feedback || {};
  const messagesPerDay = data.messages_per_day || [];
  const topQuestions = data.top_questions || [];
  const agentUsage = data.agent_usage || [];
  const recentFeedback = data.recent_feedback || [];

  const satRate = feedback.satisfaction_rate != null ? `${feedback.satisfaction_rate}%` : '-';
  const satColor = feedback.satisfaction_rate >= 75 ? '#22c55e' : feedback.satisfaction_rate >= 50 ? '#eab308' : '#ef4444';

  // Activity chart bars
  const maxCount = Math.max(...messagesPerDay.map(d => d.count), 1);
  const activityBars = messagesPerDay.slice(-14).map(d => {
    const height = Math.max(4, (d.count / maxCount) * 80);
    const dayLabel = d.day.slice(5);
    return `<div class="activity-bar-wrap" title="${d.day}: ${d.count} berichten">
      <div class="activity-bar" style="height: ${height}px"></div>
      <span class="activity-label">${dayLabel}</span>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="analytics-stats">
      <div class="stat-card">
        <div class="stat-value">${totals.sessions || 0}</div>
        <div class="stat-label">Gesprekken</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totals.questions || 0}</div>
        <div class="stat-label">Vragen gesteld</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totals.agents || 0}</div>
        <div class="stat-label">Agents</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: ${satColor}">${satRate}</div>
        <div class="stat-label">Tevredenheid</div>
      </div>
    </div>

    <div class="analytics-row">
      <div class="card analytics-card">
        <h3>Feedback</h3>
        <div class="feedback-stats">
          <div class="feedback-stat positive">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
            <span class="feedback-count">${feedback.positive || 0}</span>
            <span class="feedback-label">Positief</span>
          </div>
          <div class="feedback-stat negative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 4H17"/></svg>
            <span class="feedback-count">${feedback.negative || 0}</span>
            <span class="feedback-label">Negatief</span>
          </div>
        </div>
      </div>

      <div class="card analytics-card">
        <h3>Agent Gebruik</h3>
        <div class="agent-usage-list">
          ${agentUsage.length ? agentUsage.map(a => `
            <div class="agent-usage-item">
              <span class="agent-usage-icon">${escapeHtml(a.icon || 'E')}</span>
              <span class="agent-usage-name">${escapeHtml(a.name)}</span>
              <span class="agent-usage-count">${a.sessions} sessies</span>
            </div>
          `).join('') : '<div class="empty-docs">Nog geen agent gebruik</div>'}
        </div>
      </div>
    </div>

    <div class="card analytics-card">
      <h3>Activiteit (laatste 14 dagen)</h3>
      <div class="activity-chart">
        ${activityBars || '<div class="empty-docs">Nog geen activiteit</div>'}
      </div>
    </div>

    <div class="card analytics-card">
      <h3>Meest gestelde vragen</h3>
      <div class="top-questions-list">
        ${topQuestions.length ? topQuestions.map((q, i) => `
          <div class="top-question-item">
            <span class="top-question-rank">${i + 1}</span>
            <span class="top-question-text">${escapeHtml(q.question)}</span>
            <span class="top-question-count">${q.count}x</span>
          </div>
        `).join('') : '<div class="empty-docs">Nog geen vragen</div>'}
      </div>
    </div>

    <div class="card analytics-card">
      <h3>Recente Feedback</h3>
      <div class="recent-feedback-list">
        ${recentFeedback.length ? recentFeedback.map(f => `
          <div class="recent-feedback-item ${f.feedback}">
            <span class="recent-feedback-icon">${f.feedback === 'positive' ? '+' : '-'}</span>
            <div class="recent-feedback-content">
              <div class="recent-feedback-text">${escapeHtml(f.message_preview)}</div>
              <div class="recent-feedback-meta">${escapeHtml(f.session_title || 'Onbekend gesprek')}</div>
            </div>
          </div>
        `).join('') : '<div class="empty-docs">Nog geen feedback</div>'}
      </div>
    </div>

    <div id="groq-usage-section"></div>
  `;

  // Render Groq usage section separately
  const usageContainer = container.querySelector('#groq-usage-section');
  if (usageContainer && usage) {
    usageContainer.innerHTML = renderGroqUsageSection(usage);
  }
}

// ============================================================
// Export conversation as Markdown
// ============================================================

async function exportConversation() {
  if (!currentSessionId) { showToast('Geen gesprek om te exporteren', true); return; }
  try {
    const data = await apiGet(`/chat/sessions/${currentSessionId}`);
    const session = data.session || {};
    const messages = data.messages || [];
    const title = session.title || 'Chat Export';
    const date = new Date(session.created_at).toLocaleDateString('nl-NL');

    let md = `# ${title}\n`;
    md += `*Geëxporteerd op ${new Date().toLocaleDateString('nl-NL')} — Aangemaakt op ${date}*\n\n---\n\n`;

    for (const m of messages) {
      if (m.role === 'user') {
        md += `## 👤 Gebruiker\n\n${m.content}\n\n`;
      } else {
        // Strip followup tags
        const clean = m.content.replace(/<followup>.*?<\/followup>/gs, '').trim();
        md += `## 🤖 Assistent\n\n${clean}\n\n`;
        if (m.sources && m.sources.length > 0) {
          const unique = [...new Set(m.sources.map(s => s.filename))];
          md += `**Bronnen:** ${unique.join(', ')}\n\n`;
        }
      }
      md += `---\n\n`;
    }

    md += `\n*Geëxporteerd uit Evotion RAG*\n`;

    // Download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Gesprek geëxporteerd als Markdown');
  } catch (e) {
    showToast('Export mislukt: ' + e.message, true);
  }
}

// ============================================================
// Edit user message (re-ask with edited text)
// ============================================================

function editUserMessage(messageEl) {
  const contentEl = messageEl.querySelector('.message-content');
  const originalText = contentEl.textContent.trim();

  // Replace content with edit field
  contentEl.innerHTML = `
    <textarea class="edit-message-input" rows="3">${escapeHtml(originalText)}</textarea>
    <div class="edit-message-actions">
      <button class="btn-sm edit-cancel">Annuleren</button>
      <button class="btn-sm btn-primary edit-save">Opnieuw stellen</button>
    </div>
  `;

  const textarea = contentEl.querySelector('.edit-message-input');
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);

  contentEl.querySelector('.edit-cancel').addEventListener('click', () => {
    contentEl.innerHTML = `<p>${escapeHtml(originalText)}</p>`;
  });

  contentEl.querySelector('.edit-save').addEventListener('click', async () => {
    const newText = textarea.value.trim();
    if (!newText) return;

    // Remove this message and all following messages from DOM
    let sibling = messageEl.nextElementSibling;
    while (sibling) {
      const next = sibling.nextElementSibling;
      sibling.remove();
      sibling = next;
    }
    messageEl.remove();

    // Re-send
    $chatInput.value = newText;
    autoResizeInput();
    sendMessage();
  });
}

// ============================================================
// Initialization
// ============================================================

function init() {
  $sidebar = document.getElementById('sidebar');
  $overlay = document.getElementById('overlay');
  $sessionsEl = document.getElementById('sessions-list');
  $chatScroll = document.getElementById('chat-scroll');
  $emptyState = document.getElementById('empty-state');
  $messagesEl = document.getElementById('messages');
  $chatInput = document.getElementById('chat-input');
  $sendBtn = document.getElementById('send-btn');
  $chatCollection = document.getElementById('chat-collection');
  $chatView = document.getElementById('chat-view');
  $docsView = document.getElementById('docs-view');
  $collectionsView = document.getElementById('collections-view');
  $agentsView = document.getElementById('agents-view');
  $analyticsView = document.getElementById('analytics-view');
  $docsList = document.getElementById('docs-list');
  $collectionsList = document.getElementById('collections-list');
  $agentsList = document.getElementById('agents-list');
  $agentSelect = document.getElementById('agent-select');
  $uploadStatus = document.getElementById('upload-status');

  // --- Sidebar ---
  document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-open')?.addEventListener('click', openSidebar);
  $overlay.addEventListener('click', closeSidebar);

  // --- New chat ---
  document.getElementById('new-chat-btn').addEventListener('click', () => { newChat(); switchView('chat'); });
  document.getElementById('new-chat-mobile')?.addEventListener('click', () => { newChat(); switchView('chat'); });

  // --- Navigation ---
  document.getElementById('nav-docs').addEventListener('click', () => switchView('documents'));
  document.getElementById('nav-collections').addEventListener('click', () => switchView('collections'));
  document.getElementById('nav-agents').addEventListener('click', () => switchView('agents'));
  document.getElementById('nav-analytics').addEventListener('click', () => switchView('analytics'));
  document.getElementById('docs-back').addEventListener('click', () => switchView('chat'));
  document.getElementById('cols-back').addEventListener('click', () => switchView('chat'));
  document.getElementById('agents-back').addEventListener('click', () => switchView('chat'));
  document.getElementById('analytics-back').addEventListener('click', () => switchView('chat'));

  // --- Session search ---
  const sessionSearchInput = document.getElementById('session-search');
  sessionSearchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      loadSessions(sessionSearchInput.value.trim());
    }, 300);
  });

  // --- Export ---
  document.getElementById('export-btn').addEventListener('click', exportConversation);

  // --- Chat input ---
  $chatInput.addEventListener('input', autoResizeInput);
  $chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  $sendBtn.addEventListener('click', sendMessage);

  // --- Suggestions ---
  document.querySelectorAll('.suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.msg;
      if (msg) { $chatInput.value = msg; autoResizeInput(); sendMessage(); }
    });
  });

  // --- File upload ---
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const folderInput = document.getElementById('folder-input');
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    // Handle folder drops via DataTransferItem.webkitGetAsEntry()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const entries = [];
      for (const item of e.dataTransfer.items) {
        const entry = item.webkitGetAsEntry && item.webkitGetAsEntry();
        if (entry) entries.push(entry);
      }
      const hasFolder = entries.some(e => e.isDirectory);
      if (hasFolder) {
        collectFilesFromEntries(entries).then(files => {
          if (files.length > 0) uploadFiles(files);
        });
        return;
      }
    }
    uploadFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => { uploadFiles(fileInput.files); fileInput.value = ''; });
  folderInput.addEventListener('change', () => { uploadFiles(folderInput.files); folderInput.value = ''; });
  document.getElementById('upload-btn').addEventListener('click', () => fileInput.click());
  document.getElementById('folder-upload-btn').addEventListener('click', () => folderInput.click());

  // --- URL Upload ---
  document.getElementById('url-upload-btn').addEventListener('click', uploadUrl);
  document.getElementById('url-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') uploadUrl(); });

  // --- Document Preview Modal ---
  document.getElementById('doc-preview-close').addEventListener('click', () => {
    document.getElementById('doc-preview-modal').style.display = 'none';
  });
  document.getElementById('doc-preview-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
  });

  // --- Document browser ---
  document.getElementById('browse-collection').addEventListener('change', (e) => loadDocuments(e.target.value));
  document.getElementById('refresh-docs').addEventListener('click', () => {
    const col = document.getElementById('browse-collection').value;
    if (col) loadDocuments(col);
    loadCollectionDropdowns();
  });

  // --- Collections ---
  document.getElementById('create-col-btn').addEventListener('click', createCollection);
  document.getElementById('new-col-name').addEventListener('keydown', (e) => { if (e.key === 'Enter') createCollection(); });

  // --- Agents ---
  document.getElementById('create-agent-btn').addEventListener('click', saveAgent);
  $agentSelect.addEventListener('change', () => { currentAgentId = $agentSelect.value || null; currentSessionId = null; });

  const agentFormBody = document.getElementById('agent-form-body');
  const toggleFormBtn = document.getElementById('toggle-agent-form');
  toggleFormBtn.addEventListener('click', () => {
    if (editingAgentId) cancelEditAgent();
    const isHidden = agentFormBody.classList.toggle('collapsed');
    updateToggleBtn(isHidden);
  });

  // --- Keyboard shortcuts ---
  document.addEventListener('keydown', (e) => {
    // Ctrl+K / Cmd+K → focus session search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (currentView !== 'chat') switchView('chat');
      const searchInput = document.getElementById('session-search');
      searchInput.focus();
      searchInput.select();
    }
    // Ctrl+N / Cmd+N → new chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      newChat();
      switchView('chat');
    }
    // Escape → close sidebar (mobile) or blur search
    if (e.key === 'Escape') {
      closeSidebar();
      document.activeElement?.blur();
    }
  });

  // --- Logout ---
  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    if (getAuthToken()) logoutBtn.style.display = '';
    logoutBtn.addEventListener('click', () => {
      clearAuthToken();
      showLoginScreen();
    });
  }

  // --- Connection status check ---
  checkConnectionStatus();
  setInterval(checkConnectionStatus, 30000);

  // --- Initial load ---
  loadSessions();
  loadCollectionDropdowns();
  loadAgents();
}

// ============================================================
// Connection status indicator
// ============================================================

async function checkConnectionStatus() {
  const indicator = document.getElementById('connection-status');
  if (!indicator) return;
  try {
    const data = await apiGet('/health');
    indicator.className = 'connection-dot online';
    indicator.title = `Online — ${data.active_provider || 'verbonden'}`;
  } catch {
    indicator.className = 'connection-dot offline';
    indicator.title = 'Offline — server niet bereikbaar';
  }
}

// ============================================================
// Code block copy buttons (injected after markdown render)
// ============================================================

function addCodeCopyButtons(container) {
  container.querySelectorAll('pre > code').forEach(codeBlock => {
    if (codeBlock.parentNode.querySelector('.code-copy-btn')) return; // already has one
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.title = 'Kopieer';
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
    codeBlock.parentNode.style.position = 'relative';
    codeBlock.parentNode.appendChild(btn);
  });
}

// Observe DOM changes in messages to add copy buttons to new code blocks
const codeObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType === 1) addCodeCopyButtons(node);
    }
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  // Wire up login form
  const loginBtn = document.getElementById('login-btn');
  const loginInput = document.getElementById('login-token');
  if (loginBtn) loginBtn.addEventListener('click', attemptLogin);
  if (loginInput) loginInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });

  // Check authentication before initializing
  const authed = await checkAuth();
  if (authed) {
    init();
  }

  // Code copy button observer
  const msgs = document.getElementById('messages');
  if (msgs) codeObserver.observe(msgs, { childList: true, subtree: true });
});
