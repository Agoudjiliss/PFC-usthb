import type { Conversation, Message, ChatResponse } from "@/types"
import { authService } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...authService.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout()
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
          throw new Error("Session expirée")
        }

        const error = await response.json().catch(() => ({ message: "Erreur réseau" }))
        throw new Error(error.message || `Erreur ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Erreur de connexion")
    }
  }

  // Chat endpoints
  async sendMessage(message: string): Promise<ChatResponse> {
    return this.request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }

  async getChatHistory(): Promise<Message[]> {
    const response = await this.request<{ messages: any[] }>("/chat/history")
    return response.messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      isUser: msg.isUser,
      timestamp: new Date(msg.timestamp),
    }))
  }

  // Local storage fallback methods
  getLocalConversations(): Conversation[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("usthb_conversations")
    return stored ? JSON.parse(stored) : []
  }

  saveLocalConversations(conversations: Conversation[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("usthb_conversations", JSON.stringify(conversations))
    }
  }

  createLocalConversation(title: string): Conversation {
    const conversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const conversations = this.getLocalConversations()
    conversations.unshift(conversation)
    this.saveLocalConversations(conversations)

    return conversation
  }

  deleteLocalConversation(id: string): void {
    const conversations = this.getLocalConversations()
    const filtered = conversations.filter((conv) => conv.id !== id)
    this.saveLocalConversations(filtered)
  }

  updateLocalConversation(id: string, messages: Message[]): void {
    const conversations = this.getLocalConversations()
    const index = conversations.findIndex((conv) => conv.id === id)

    if (index !== -1) {
      conversations[index].messages = messages
      conversations[index].updatedAt = new Date()
      this.saveLocalConversations(conversations)
    }
  }
}

export const apiService = new ApiService()
