"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, FileAudio, FileText, LinkIcon, MoreHorizontal, Pencil, Share2, FileIcon } from "lucide-react"

type Resource = {
  id: string
  name: string
  type: "pdf" | "audio" | "text" | "link"
  dateAdded: string
  status: "ready" | "not-indexed" | "error"
}

const resources: Resource[] = [
  { id: "1", name: "Introduction to AI", type: "pdf", dateAdded: "2024-05-01", status: "ready" },
  { id: "2", name: "Machine Learning Basics", type: "pdf", dateAdded: "2024-04-28", status: "ready" },
  { id: "3", name: "Interview with Prof. Smith", type: "audio", dateAdded: "2024-04-25", status: "not-indexed" },
  { id: "4", name: "Research Paper on NLP", type: "pdf", dateAdded: "2024-04-22", status: "ready" },
  { id: "5", name: "Course Notes", type: "text", dateAdded: "2024-04-20", status: "ready" },
  { id: "6", name: "Stanford AI Course", type: "link", dateAdded: "2024-04-18", status: "error" },
  { id: "7", name: "Deep Learning Tutorial", type: "pdf", dateAdded: "2024-04-15", status: "ready" },
  { id: "8", name: "Podcast on AI Ethics", type: "audio", dateAdded: "2024-04-12", status: "not-indexed" },
]

export function ResourcesTable() {
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
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Ready
          </Badge>
        )
      case "not-indexed":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            Not Indexed
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
            <TableHead>Date Added</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell className="font-medium">{resource.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getTypeIcon(resource.type)}
                  <span className="capitalize">{resource.type}</span>
                </div>
              </TableCell>
              <TableCell>{new Date(resource.dateAdded).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(resource.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
