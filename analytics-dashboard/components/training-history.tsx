"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

type TrainingModel = {
  id: string
  name: string
  date: string
  status: "active" | "archived" | "failed"
  size: string
}

const models: TrainingModel[] = [
  { id: "1", name: "rasa_model_20240430", date: "2024-04-30", status: "active", size: "42.5 MB" },
  { id: "2", name: "rasa_model_20240425", date: "2024-04-25", status: "archived", size: "41.2 MB" },
  { id: "3", name: "rasa_model_20240420", date: "2024-04-20", status: "archived", size: "40.8 MB" },
  { id: "4", name: "rasa_model_20240415", date: "2024-04-15", status: "failed", size: "0 KB" },
  { id: "5", name: "rasa_model_20240410", date: "2024-04-10", status: "archived", size: "39.5 MB" },
]

export function TrainingHistory() {
  const getStatusBadge = (status: TrainingModel["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Active
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            Archived
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      {models.map((model) => (
        <div key={model.id} className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="font-medium">{model.name}</div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{new Date(model.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{model.size}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(model.status)}
            <div className="flex">
              {model.status !== "failed" && (
                <>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
