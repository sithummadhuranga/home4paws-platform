"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { adoptionService } from "@/services/adoptionService"
import type { AdoptionMessage } from "@/types/adoption"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/layout/Header"
import Link from "next/link"
import { MessageCircle, Send, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function MessagesPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<AdoptionMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?returnUrl=/messages")
      return
    }

    if (isAuthenticated) {
      loadMessages()
      // Auto-select listing from query param
      const listingParam = searchParams.get('listing')
      if (listingParam) {
        setSelectedListing(parseInt(listingParam))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, searchParams])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const msgs = await adoptionService.myMessages()
      setMessages(msgs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedListing) return
    setSending(true)
    try {
      await adoptionService.sendMessage({
        listingId: selectedListing,
        message: newMessage.trim(),
      })
      setNewMessage("")
      loadMessages()
    } catch (err) {
      console.error(err)
      alert("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-950 to-black">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    )
  }

  // Group messages by listing
  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.listingId]) {
      acc[msg.listingId] = []
    }
    acc[msg.listingId].push(msg)
    return acc
  }, {} as Record<number, AdoptionMessage[]>)

  const conversationList = Object.entries(groupedMessages).map(([listingId, msgs]) => ({
    listingId: parseInt(listingId),
    petName: msgs[0].petName,
    messages: msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    lastMessage: msgs[msgs.length - 1],
    unreadCount: msgs.filter(m => !m.isRead && m.receiverId === user?.id).length
  }))

  const selectedConversation = selectedListing
    ? conversationList.find(c => c.listingId === selectedListing)
    : null

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-purple-200 mb-2 font-urbanist">Messages</h1>
              <p className="text-purple-300/70 font-inter">View and manage your adoption conversations</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-purple-400/20 bg-neutral-900/50 overflow-hidden">
                  <div className="p-4 bg-neutral-800/50 border-b border-purple-400/20">
                    <h2 className="text-lg font-bold text-purple-200 font-urbanist flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Conversations
                    </h2>
                  </div>
                  <div className="divide-y divide-purple-400/10">
                    {conversationList.length === 0 ? (
                      <div className="p-8 text-center text-purple-300/50 text-sm">
                        No messages yet
                      </div>
                    ) : (
                      conversationList.map((conv) => (
                        <button
                          key={conv.listingId}
                          onClick={() => setSelectedListing(conv.listingId)}
                          className={`w-full p-4 text-left hover:bg-purple-500/5 transition-colors ${
                            selectedListing === conv.listingId ? "bg-purple-500/10" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-purple-200 mb-1 truncate">
                                {conv.petName}
                              </div>
                              <div className="text-xs text-purple-300/60 truncate">
                                {conv.lastMessage.message}
                              </div>
                              <div className="text-xs text-purple-300/40 mt-1">
                                {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {conv.unreadCount > 0 && (
                              <div className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Conversation View */}
              <div className="lg:col-span-2">
                {selectedConversation ? (
                  <div className="rounded-2xl border border-purple-400/20 bg-neutral-900/50 overflow-hidden flex flex-col h-[calc(100vh-240px)]">
                    <div className="p-4 bg-neutral-800/50 border-b border-purple-400/20 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-purple-200 font-urbanist">
                          {selectedConversation.petName}
                        </h2>
                        <div className="text-xs text-purple-300/60">
                          {selectedConversation.messages.length} messages
                        </div>
                      </div>
                      <Link href={`/adoptions/${selectedConversation.listingId}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 rounded-full border-purple-400/30 text-purple-200 hover:bg-purple-500/10"
                        >
                          View Listing
                        </Button>
                      </Link>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {selectedConversation.messages.map((msg) => {
                        const isMe = msg.senderId === user?.id
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-xl ${
                                isMe
                                  ? "bg-purple-600/20 border border-purple-400/30"
                                  : "bg-neutral-800/50"
                              }`}
                            >
                              <div className="text-xs text-purple-300/60 mb-1">
                                {msg.senderName}
                              </div>
                              <div className="text-sm text-purple-200 break-words">
                                {msg.message}
                              </div>
                              <div className="text-xs text-purple-300/40 mt-1">
                                {new Date(msg.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-neutral-800/50 border-t border-purple-400/20">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] rounded-xl bg-black/30 border-purple-400/20 text-purple-200 resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sending}
                          className="h-auto px-6 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-purple-300/40 mt-2">
                        Press Enter to send, Shift+Enter for new line
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-purple-400/20 bg-neutral-900/50 h-[calc(100vh-240px)] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <MessageCircle className="w-16 h-16 text-purple-400/30 mx-auto" />
                      <div className="text-purple-300/70">
                        Select a conversation to view messages
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

