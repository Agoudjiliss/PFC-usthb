"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Plus, Trash2, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChat } from "@/hooks/useChat"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  isMobile?: boolean
}

export function ChatSidebar({ isMobile = false }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(!isMobile)
  const { conversations, activeConversationId, setActiveConversationId, createConversation, deleteConversation } =
    useChat()
  const { user, logout } = useAuth()

  const handleNewChat = async () => {
    try {
      await createConversation()
      if (isMobile) setIsOpen(false)
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
    }
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    if (isMobile) setIsOpen(false)
  }

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?")) {
      await deleteConversation(id)
    }
  }

  if (isMobile) {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden"
          size="sm"
          variant="outline"
        >
          <Menu className="w-4 h-4" />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
              >
                <SidebarContent
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  user={user}
                  onNewChat={handleNewChat}
                  onSelectConversation={handleSelectConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onLogout={logout}
                  onClose={() => setIsOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div className="hidden md:flex w-80 h-full bg-white border-r border-gray-200">
      <SidebarContent
        conversations={conversations}
        activeConversationId={activeConversationId}
        user={user}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onLogout={logout}
      />
    </div>
  )
}

interface SidebarContentProps {
  conversations: any[]
  activeConversationId: string | null
  user: any
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string, e: React.MouseEvent) => void
  onLogout: () => void
  onClose?: () => void
}

function SidebarContent({
  conversations,
  activeConversationId,
  user,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onLogout,
  onClose,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">USTHB Chat</h2>
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Button onClick={onNewChat} className="w-full bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle conversation
        </Button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          <AnimatePresence>
            {conversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  activeConversationId === conversation.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50",
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="flex-1 text-sm font-medium text-gray-900 truncate">{conversation.title}</span>
                <Button
                  onClick={(e) => onDeleteConversation(conversation.id, e)}
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Aucune conversation</p>
          </div>
        )}
      </div>

      {/* User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
