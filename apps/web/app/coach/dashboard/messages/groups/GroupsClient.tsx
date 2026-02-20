"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Plus,
  MessageCircle,
  Trash2,
  UserPlus,
  UserMinus,
  Send,
  ChevronLeft,
  X,
} from "lucide-react"
import {
  getCoachGroups,
  createGroup,
  deleteGroup,
  getGroupMembers,
  addGroupMembers,
  removeGroupMember,
  getCoachClients,
  sendGroupMessage,
  getGroupMessages,
  type GroupConversation,
  type GroupMember,
} from "@/app/actions/groups"

interface Client {
  user_id: string
  first_name: string | null
  last_name: string | null
}

interface GroupMessageRecord {
  id: string
  group_id: string
  sender_id: string
  content: string
  message_type: string
  sent_at: string
  sender_name?: string
}

export default function GroupsClient({ coachId }: { coachId: string }) {
  const [groups, setGroups] = useState<GroupConversation[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  // Views
  const [view, setView] = useState<"list" | "create" | "detail" | "chat">("list")
  const [selectedGroup, setSelectedGroup] = useState<GroupConversation | null>(null)

  // Create form
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])

  // Detail
  const [members, setMembers] = useState<GroupMember[]>([])
  const [showAddMembers, setShowAddMembers] = useState(false)
  const [addMemberIds, setAddMemberIds] = useState<string[]>([])

  // Chat
  const [messages, setMessages] = useState<GroupMessageRecord[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [groupsRes, clientsRes] = await Promise.all([
      getCoachGroups(),
      getCoachClients(),
    ])
    if (groupsRes.success && groupsRes.groups) setGroups(groupsRes.groups)
    if (clientsRes.success && clientsRes.clients) setClients(clientsRes.clients)
    setLoading(false)
  }

  async function handleCreate() {
    if (!newName.trim()) return
    const result = await createGroup({
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      memberIds: selectedMemberIds,
    })
    if (result.success) {
      setNewName("")
      setNewDescription("")
      setSelectedMemberIds([])
      setView("list")
      loadData()
    }
  }

  async function handleDelete(groupId: string) {
    if (!confirm("Weet je zeker dat je deze groep wilt verwijderen?")) return
    const result = await deleteGroup(groupId)
    if (result.success) {
      setSelectedGroup(null)
      setView("list")
      loadData()
    }
  }

  async function openDetail(group: GroupConversation) {
    setSelectedGroup(group)
    setView("detail")
    const result = await getGroupMembers(group.id)
    if (result.success && result.members) setMembers(result.members)
  }

  async function openChat(group: GroupConversation) {
    setSelectedGroup(group)
    setView("chat")
    const result = await getGroupMessages(group.id)
    if (result.success && result.messages) setMessages(result.messages)
  }

  async function handleAddMembers() {
    if (!selectedGroup || addMemberIds.length === 0) return
    const result = await addGroupMembers(selectedGroup.id, addMemberIds)
    if (result.success) {
      setAddMemberIds([])
      setShowAddMembers(false)
      const res = await getGroupMembers(selectedGroup.id)
      if (res.success && res.members) setMembers(res.members)
      loadData()
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!selectedGroup) return
    if (!confirm("Weet je zeker dat je dit lid wilt verwijderen?")) return
    const result = await removeGroupMember(selectedGroup.id, userId)
    if (result.success) {
      const res = await getGroupMembers(selectedGroup.id)
      if (res.success && res.members) setMembers(res.members)
      loadData()
    }
  }

  async function handleSendMessage() {
    if (!selectedGroup || !newMessage.trim() || sending) return
    setSending(true)
    const result = await sendGroupMessage(selectedGroup.id, newMessage.trim())
    if (result.success) {
      setNewMessage("")
      const res = await getGroupMessages(selectedGroup.id)
      if (res.success && res.messages) setMessages(res.messages)
    }
    setSending(false)
  }

  function toggleMemberId(id: string, list: string[], setter: (ids: string[]) => void) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  function clientName(client: Client) {
    return `${client.first_name || ""} ${client.last_name || ""}`.trim() || "Client"
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  // ─── CHAT VIEW ───
  if (view === "chat" && selectedGroup) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => { setView("list"); setSelectedGroup(null) }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4" /> Terug naar groepen
        </button>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-secondary/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{selectedGroup.name}</h2>
              <p className="text-xs text-muted-foreground">
                {selectedGroup.member_count} leden
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Nog geen berichten in deze groep</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.sender_id === coachId
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs font-semibold text-primary mb-0.5">
                          {msg.sender_name || "Gebruiker"}
                        </p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-[10px] mt-1 text-right ${
                          isOwn ? "text-primary-foreground/50" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.sent_at).toLocaleTimeString("nl-NL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Send input */}
          <div className="border-t px-4 py-3 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Typ een bericht..."
              className="flex-1 px-4 py-2 text-sm border rounded-full focus-visible:ring-2 focus-visible:ring-ring outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── DETAIL VIEW ───
  if (view === "detail" && selectedGroup) {
    const existingUserIds = new Set(members.map((m) => m.user_id))
    const availableClients = clients.filter((c) => !existingUserIds.has(c.user_id))

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => { setView("list"); setSelectedGroup(null) }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4" /> Terug naar groepen
        </button>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {/* Group header */}
          <div className="px-5 py-5 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedGroup.name}</h2>
                {selectedGroup.description && (
                  <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openChat(selectedGroup)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                <MessageCircle className="h-4 w-4" /> Chat
              </button>
              <button
                onClick={() => handleDelete(selectedGroup.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/5 transition"
              >
                <Trash2 className="h-4 w-4" /> Verwijderen
              </button>
            </div>
          </div>

          {/* Members section */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Leden ({members.length})
              </h3>
              {availableClients.length > 0 && (
                <button
                  onClick={() => setShowAddMembers(!showAddMembers)}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <UserPlus className="h-4 w-4" /> Lid toevoegen
                </button>
              )}
            </div>

            {/* Add members panel */}
            {showAddMembers && (
              <div className="mb-4 p-4 bg-secondary/50 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">Selecteer clients</p>
                  <button onClick={() => setShowAddMembers(false)}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                  {availableClients.map((client) => (
                    <label
                      key={client.user_id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={addMemberIds.includes(client.user_id)}
                        onChange={() =>
                          toggleMemberId(client.user_id, addMemberIds, setAddMemberIds)
                        }
                        className="rounded border-border text-primary focus-visible:ring-ring"
                      />
                      <span className="text-sm text-foreground">{clientName(client)}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleAddMembers}
                  disabled={addMemberIds.length === 0}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-40 transition"
                >
                  {addMemberIds.length} lid(en) toevoegen
                </button>
              </div>
            )}

            {/* Members list */}
            <div className="divide-y">
              {members.map((member) => {
                const name =
                  `${member.first_name || ""} ${member.last_name || ""}`.trim() || "Client"
                const isCoach = member.user_id === coachId

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {name[0]?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {name} {isCoach ? "(jij)" : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.role === "admin"
                            ? "Beheerder"
                            : member.role === "moderator"
                            ? "Moderator"
                            : "Lid"}
                          {member.email ? ` · ${member.email}` : ""}
                        </p>
                      </div>
                    </div>
                    {!isCoach && (
                      <button
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition"
                        title="Verwijder lid"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── CREATE VIEW ───
  if (view === "create") {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4" /> Terug
        </button>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Nieuwe Groep</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Groepsnaam *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="bijv. Programma A - Maandag"
                className="w-full px-3 py-2 text-sm border rounded-lg focus-visible:ring-2 focus-visible:ring-ring outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Beschrijving
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optionele beschrijving"
                className="w-full px-3 py-2 text-sm border rounded-lg focus-visible:ring-2 focus-visible:ring-ring outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Leden toevoegen ({selectedMemberIds.length} geselecteerd)
              </label>
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {clients.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    Je hebt nog geen clients
                  </p>
                ) : (
                  clients.map((client) => (
                    <label
                      key={client.user_id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 cursor-pointer border-b last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.includes(client.user_id)}
                        onChange={() =>
                          toggleMemberId(
                            client.user_id,
                            selectedMemberIds,
                            setSelectedMemberIds
                          )
                        }
                        className="rounded border-border text-primary focus-visible:ring-ring"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {(client.first_name?.[0] || "C").toUpperCase()}
                        </div>
                        <span className="text-sm text-foreground">{clientName(client)}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setView("list")}
              className="px-4 py-2 text-sm text-foreground border rounded-lg hover:bg-secondary/50 transition"
            >
              Annuleren
            </button>
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-40 transition"
            >
              Groep Aanmaken
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── LIST VIEW ───
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Groepen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beheer groepsgesprekken met je clients
          </p>
        </div>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Nieuwe Groep
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Nog geen groepen
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Maak een groep aan om met meerdere clients tegelijk te communiceren.
          </p>
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition"
          >
            Eerste groep aanmaken
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => openDetail(group)}
            >
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-primary-foreground">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{group.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {group.member_count || 0} leden
                      {group.last_message && (
                        <>
                          {" · "}
                          <span className="text-muted-foreground">
                            {group.last_message.substring(0, 40)}
                            {group.last_message.length > 40 ? "..." : ""}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openChat(group)
                    }}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition"
                    title="Open chat"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
