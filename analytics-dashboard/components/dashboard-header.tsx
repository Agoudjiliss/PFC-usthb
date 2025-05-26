"use client"

import { BookmarkIcon, StarIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user } = useAuth()

  const displayTitle = title || (user ? `${user.firstName} ${user.lastName}` : "Dashboard")
  const displaySubtitle = subtitle || "Overview"

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-medium">{displayTitle}</h1>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 hover:bg-gray-100">
            <BookmarkIcon className="h-4 w-4 text-gray-400" />
          </button>
          <button className="rounded p-1 hover:bg-gray-100">
            <StarIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Dashboards</span>
        <span className="text-sm text-gray-500">/</span>
        <span className="text-sm font-medium">{displaySubtitle}</span>
      </div>
    </div>
  )
}
