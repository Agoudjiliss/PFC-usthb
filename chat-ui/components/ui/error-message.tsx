"use client"

import { AlertCircle, X } from "lucide-react"
import { Button } from "./button"

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <p className="text-red-700 flex-1">{message}</p>
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss} className="text-red-500 hover:text-red-700">
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
