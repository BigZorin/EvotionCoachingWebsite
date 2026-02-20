"use client"

import { useState, useEffect, useRef } from "react"
import {
  MessageSquare,
  Send,
  Mic,
  Play,
  Pause,
  Clock,
  User,
  Search,
  Paperclip,
  Image as ImageIcon,
  Loader2,
} from "lucide-react"
import {
  getCoachConversations,
  getConversationMessages,
  sendCoachMessage,
  sendCoachMedia,
  markConversationRead,
  type Conversation,
  type Message,
} from "@/app/actions/messages"

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) {
    return date.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })
  }
  if (diffDays === 1) return "Gisteren"
  if (diffDays < 7) return `${diffDays}d geleden`
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" })
}

function VoicePlayer({ url, duration }: { url: string; duration: number }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.onended = () => setPlaying(false)
    }
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const m = Math.floor(duration / 60)
  const s = duration % 60

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-sm"
    >
      {playing ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-current opacity-40"
            style={{ height: 4 + Math.random() * 12 }}
          />
        ))}
      </div>
      <span className="text-xs opacity-70">
        {m}:{String(s).padStart(2, "0")}
      </span>
    </button>
  )
}

export default function MessagesClient({ coachId }: { coachId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [msgsLoading, setMsgsLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState("")
  const [uploading, setUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId)
      markConversationRead(selectedId)
    }
  }, [selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Poll for new messages + conversations (background, no loading flash)
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedId) loadMessages(selectedId, false)
      refreshConversations()
    }, 5000)
    return () => clearInterval(interval)
  }, [selectedId])

  async function refreshConversations() {
    const result = await getCoachConversations()
    if (result.success && result.conversations) {
      setConversations(result.conversations)
    }
  }

  async function loadConversations() {
    setLoading(true)
    const result = await getCoachConversations()
    if (result.success && result.conversations) {
      setConversations(result.conversations)
      // Auto-select first conversation
      if (result.conversations.length > 0 && !selectedId) {
        setSelectedId(result.conversations[0].id)
      }
    }
    setLoading(false)
  }

  async function loadMessages(convId: string, showLoading = true) {
    if (showLoading) setMsgsLoading(true)
    const result = await getConversationMessages(convId)
    if (result.success && result.messages) {
      setMessages(result.messages)
    }
    if (showLoading) setMsgsLoading(false)
  }

  async function handleSend() {
    if (!newMessage.trim() || !selectedId || sending) return
    const conv = conversations.find((c) => c.id === selectedId)
    if (!conv) return

    const text = newMessage.trim()
    setSending(true)
    setNewMessage("")

    // Optimistic: add message to UI instantly
    const optimistic: Message = {
      id: `sending-${Date.now()}`,
      sender_id: coachId,
      receiver_id: conv.client_id,
      conversation_id: selectedId,
      content: text,
      message_type: "text",
      media_url: null,
      media_duration: null,
      read: false,
      sent_at: new Date().toISOString(),
      read_at: null,
    }
    setMessages((prev) => [...prev, optimistic])

    const result = await sendCoachMessage(selectedId, conv.client_id, text)
    if (result.success && result.message) {
      // Replace optimistic with real message
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? result.message! : m))
      )
    } else {
      // Remove optimistic on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setNewMessage(text) // Restore text
    }

    // Refresh conversations list in background (for last_message_text)
    refreshConversations()
    setSending(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !selectedId) return
    const conv = conversations.find((c) => c.id === selectedId)
    if (!conv) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("conversationId", selectedId)
      formData.append("clientId", conv.client_id)

      const result = await sendCoachMedia(formData)
      if (result.success && result.message) {
        setMessages((prev) => [...prev, result.message!])
        refreshConversations()
      } else if (result.error) {
        console.error("Upload error:", result.error)
        alert(`Upload mislukt: ${result.error}`)
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      alert(`Upload mislukt: ${err.message || "Onbekende fout"}`)
    }
    setUploading(false)

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const selectedConv = conversations.find((c) => c.id === selectedId)
  const filteredConvs = search
    ? conversations.filter(
        (c) =>
          c.client_name?.toLowerCase().includes(search.toLowerCase()) ||
          c.last_message_text?.toLowerCase().includes(search.toLowerCase())
      )
    : conversations

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-100px)] bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Conversation list (left) */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground mb-3">Berichten</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek gesprek..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus-visible:ring-2 focus-visible:ring-ring outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nog geen gesprekken</p>
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left p-4 border-b border-border hover:bg-secondary/50 transition ${
                  selectedId === conv.id ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {conv.client_avatar_url ? (
                    <img src={conv.client_avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                      {(conv.client_name?.[0] || "C").toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {conv.client_name || "Client"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.last_message_text || "Nog geen berichten"}
                    </p>
                  </div>
                  {conv.unread_count_coach > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {conv.unread_count_coach}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area (right) */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              {selectedConv.client_avatar_url ? (
                <img src={selectedConv.client_avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {(selectedConv.client_name?.[0] || "C").toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {selectedConv.client_name || "Client"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gesprek gestart{" "}
                  {new Date(selectedConv.created_at).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nog geen berichten in dit gesprek
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === coachId || msg.sender_id === selectedConv?.coach_id
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
                        {!isOwn && (
                          selectedConv?.client_avatar_url ? (
                            <img src={selectedConv.client_avatar_url} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                              {(selectedConv?.client_name?.[0] || "C").toUpperCase()}
                            </div>
                          )
                        )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-secondary text-foreground rounded-bl-sm"
                        }`}
                      >
                        {msg.message_type === "voice" && msg.media_url ? (
                          <VoicePlayer
                            url={msg.media_url}
                            duration={msg.media_duration || 0}
                          />
                        ) : msg.message_type === "image" && msg.media_url ? (
                          <a href={msg.media_url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={msg.media_url}
                              alt="Foto"
                              className="max-w-[280px] rounded-xl cursor-pointer hover:opacity-90 transition"
                            />
                          </a>
                        ) : msg.message_type === "video" && msg.media_url ? (
                          <a
                            href={msg.media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:opacity-80 transition"
                          >
                            <Play className="h-8 w-8" />
                            <span className="text-sm">Video bekijken</span>
                          </a>
                        ) : msg.message_type === "document" && msg.media_url ? (
                          <a
                            href={msg.media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:opacity-80 transition"
                          >
                            <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{msg.content || "Document"}</span>
                          </a>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        )}
                        <div
                          className={`flex items-center gap-1 mt-1 ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span
                            className={`text-[10px] ${
                              isOwn ? "text-primary-foreground/50" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(msg.sent_at).toLocaleTimeString("nl-NL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isOwn && (
                            <span className="text-[10px] text-primary-foreground/50">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || sending}
                  className="p-2.5 text-muted-foreground hover:text-primary transition disabled:opacity-50"
                  title="Bestand versturen"
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Paperclip className="h-5 w-5" />
                  )}
                </button>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Typ een bericht..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl resize-none focus-visible:ring-2 focus-visible:ring-ring outline-none max-h-32"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Selecteer een gesprek</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
