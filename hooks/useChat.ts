"use client"

import { useState, useEffect } from "react"
import type { Message, Conversation } from "@/types"
import { apiService } from "@/lib/api"

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const data = apiService.getLocalConversations()
      setConversations(data)

      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const createConversation = async (title = "Nouvelle conversation") => {
    try {
      const newConversation = apiService.createLocalConversation(title)
      setConversations((prev) => [newConversation, ...prev])
      setActiveConversationId(newConversation.id)
      return newConversation
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de création")
      throw err
    }
  }

  const deleteConversation = async (id: string) => {
    try {
      apiService.deleteLocalConversation(id)
      setConversations((prev) => prev.filter((conv) => conv.id !== id))

      if (activeConversationId === id) {
        const remaining = conversations.filter((conv) => conv.id !== id)
        setActiveConversationId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression")
    }
  }

  const sendMessage = async (content: string) => {
    if (!activeConversationId) {
      await createConversation()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    }

    // Add user message immediately
    updateConversationMessages(activeConversationId!, [userMessage])

    try {
      setIsLoading(true)

      // Simulate API call or use real API
      const response = await simulateAIResponse(content)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      }

      updateConversationMessages(activeConversationId!, [userMessage, aiMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi")
      // Remove user message on error
      removeLastMessage(activeConversationId!)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateAIResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Try real API first, fallback to simulation
    try {
      const response = await apiService.sendMessage(message)
      return response.response
    } catch {
      // Fallback simulation
      return `Merci pour votre question : "${message}". Je suis l'assistant USTHB et je suis là pour vous aider avec vos questions sur l'entrepreneuriat et l'innovation. Cette réponse est simulée car l'API backend n'est pas disponible.`
    }
  }

  const updateConversationMessages = (conversationId: string, newMessages: Message[]) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, ...newMessages]
          apiService.updateLocalConversation(conversationId, updatedMessages)
          return { ...conv, messages: updatedMessages, updatedAt: new Date() }
        }
        return conv
      }),
    )
  }

  const removeLastMessage = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.slice(0, -1)
          apiService.updateLocalConversation(conversationId, updatedMessages)
          return { ...conv, messages: updatedMessages }
        }
        return conv
      }),
    )
  }

  const clearError = () => setError(null)

  const activeConversation = conversations.find((conv) => conv.id === activeConversationId)

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    sendMessage,
    createConversation,
    deleteConversation,
    clearError,
  }
}
