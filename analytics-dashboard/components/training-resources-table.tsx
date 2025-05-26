"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileAudio, FileText, LinkIcon, FileIcon, Eye, MoreHorizontal } from "lucide-react"

type Resource = {
  id: string
  name: string
  type: "pdf" | "audio" | "text" | "link"
  processedDate: string
  status: "processed" | "pending" | "error"
}

const resources: Record<string, Resource[]> = {
  processed: [
    { id: "1", name: "Introduction to AI", type: "pdf", processedDate: "2024-05-01", status: "processed" },
    { id: "2", name: "Machine Learning Basics", type: "pdf", processedDate: "2024-04-28", status: "processed" },
    { id: "4", name: "Research Paper on NLP", type: "pdf", processedDate: "2024-04-22", status: "processed" },
    { id: "5", name: "Course Notes", type: "text", processedDate: "2024-04-20", status: "processed" },
  ],
  pending: [
    { id: "3", name: "Interview with Prof. Smith", type: "audio", processedDate: "2024-04-25", status: "pending" },
    { id: "7", name: "Deep Learning Tutorial", type: "pdf", processedDate: "2024-04-15", status: "pending" },
  ],
  error: [
    { id: "6", name: "Stanford AI Course", type: "link", processedDate: "2024-04-18", status: "error" },
    { id: "8", name: "Podcast on AI Ethics", type: "audio", processedDate: "2024-04-12", status: "error" },
  ],
}

interface TrainingResourcesTableProps {
  status: "processed" | "pending" | "error"
}

export function TrainingResourcesTable({ status }: TrainingResourcesTableProps) {
  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "audio":
        return <FileAudio className="h-4 w-4 text-purple-500" />
      case "text":
        return <FileText className="h-4 w-4 text-green-500" />
      case "link":
        return <LinkIcon className="h-4 w-4 text-orange-500" />
      default:
        return <FileIcon className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: Resource["status"]) => {
    switch (status) {
      case "processed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Processed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            Pending
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Processed Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources[status].length > 0 ? (
            resources[status].map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(resource.type)}
                    <span className="capitalize">{resource.type}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(resource.processedDate).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(resource.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No resources found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
