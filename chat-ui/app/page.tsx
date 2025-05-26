"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MessageSquare, Sparkles, Shield } from "lucide-react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { MessageList } from "@/components/chat/message-list"
import { MessageInput } from "@/components/chat/message-input"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { useIsMobile } from "@/hooks/use-mobile"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { activeConversation, sendMessage, isLoading: chatLoading, error, clearError } = useChat()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const examples = [
    "Comment déposer un brevet en Algérie ?",
    "Quelles aides financières sont disponibles pour lancer ma startup ?",
    "Comment rédiger un business plan efficace ?",
  ]

  const capabilities = [
    "Répondre aux questions sur la création et la gestion de startups",
    "Fournir des informations sur le financement et la législation",
    "Analyser rapidement des requêtes et suggérer des ressources pertinentes",
  ]

  const limitations = [
    "Ne remplace pas un avis professionnel ou juridique",
    "Peut fournir des réponses incomplètes ou approximatives",
    "Ne dispose pas d'informations en temps réel sur tous les programmes",
  ]

  const hasMessages = activeConversation?.messages.length > 0

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar isMobile={isMobile} />

      <div className="flex-1 flex flex-col">
        {error && (
          <div className="p-4">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        {!hasMessages ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Bienvenue sur <span className="text-blue-600">USTHB Chat</span>
              </motion.h1>

              <motion.p
                className="text-gray-600 mb-16 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Votre assistant IA pour l'entrepreneuriat et l'innovation
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Examples */}
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  <div className="mb-6 p-3 rounded-full bg-blue-100">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-6">Exemples</h2>
                  <div className="space-y-3 w-full">
                    {examples.map((example, index) => (
                      <motion.button
                        key={index}
                        onClick={() => sendMessage(example)}
                        className="w-full p-4 bg-white rounded-xl text-sm text-left hover:bg-gray-50 shadow-sm border border-gray-200 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        "{example}"
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Capabilities */}
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                >
                  <div className="mb-6 p-3 rounded-full bg-green-100">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-6">Capacités</h2>
                  <div className="space-y-3 w-full">
                    {capabilities.map((capability, index) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-white rounded-xl text-sm shadow-sm border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        {capability}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Limitations */}
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                >
                  <div className="mb-6 p-3 rounded-full bg-orange-100">
                    <Shield className="w-8 h-8 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-6">Limitations</h2>
                  <div className="space-y-3 w-full">
                    {limitations.map((limitation, index) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-white rounded-xl text-sm shadow-sm border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                      >
                        {limitation}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : (
          <MessageList messages={activeConversation.messages} isLoading={chatLoading} />
        )}

        <MessageInput onSendMessage={sendMessage} disabled={chatLoading} placeholder="Posez votre question..." />
      </div>
    </div>
  )
}
