import { ArrowDown, ArrowUp } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
}

export function StatsCard({ title, value, change, trend }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-[#edeefc] p-4">
      <div className="mb-2 text-sm text-gray-600">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold">{value}</div>
        <div
          className={`flex items-center text-xs ${
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
          }`}
        >
          {trend === "up" ? (
            <ArrowUp className="mr-1 h-3 w-3" />
          ) : trend === "down" ? (
            <ArrowDown className="mr-1 h-3 w-3" />
          ) : null}
          {change}
        </div>
      </div>
    </div>
  )
}
