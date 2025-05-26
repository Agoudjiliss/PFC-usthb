"use client"
import Link from "next/link"
import {
  BarChart2,
  Layers,
  MessageSquare,
  Settings,
  Database,
  Bot,
  Users,
  Home,
  MessageSquareText,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface SidebarProps {
  activePage?: string
}

export function Sidebar({ activePage = "overview" }: SidebarProps) {
  const { logout } = useAuth()

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/" },
    { id: "resources", label: "Resources Manager", icon: Database, href: "/resources" },
    { id: "intents", label: "Intents & FAQ", icon: MessageSquareText, href: "/intents" },
    { id: "training", label: "Training Status", icon: Bot, href: "/training" },
    { id: "responses", label: "Responses", icon: MessageSquare, href: "/responses" },
    { id: "dashboards", label: "Dashboards", icon: BarChart2, href: "/dashboards" },
    { id: "projects", label: "Projects", icon: Layers, href: "/projects" },
    { id: "users", label: "Users", icon: Users, href: "/users" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="w-48 border-r border-gray-200 bg-white">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-medium uppercase text-gray-500">Favorites</h3>
          <nav className="space-y-1">
            {menuItems.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm ${
                  activePage === item.id ? "bg-[#edeefc] font-medium text-[#1c1c1c]" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`mr-3 h-1.5 w-1.5 rounded-full ${
                    activePage === item.id ? "bg-[#9f9ff8]" : "bg-transparent"
                  }`}
                />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-medium uppercase text-gray-500">Navigation</h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm ${
                  activePage === item.id ? "bg-[#edeefc] font-medium text-[#1c1c1c]" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className={`mr-2 h-4 w-4 ${activePage === item.id ? "text-[#9f9ff8]" : "text-gray-400"}`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  )
}
