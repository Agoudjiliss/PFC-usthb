"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Eye, FileAudio, FileText, LinkIcon, MoreHorizontal, Pencil, Share2, FileIcon } from "lucide-react"

type Resource = {
  id: string
  name: string
  type: "pdf" | "audio" | "text" | "link"
  dateAdded: string
  status: "ready" | "not-indexed" | "error"
  description?: string
}

const resources: Resource[] = [
  {
    id: "1",
    name: "Introduction to AI",
    type: "pdf",
    dateAdded: "2024-05-01",
    status: "ready",
    description: "A comprehensive introduction to artificial intelligence concepts and applications.",
  },
  {
    id: "2",
    name: "Machine Learning Basics",
    type: "pdf",
    dateAdded: "2024-04-28",
    status: "ready",
    description: "Fundamental concepts of machine learning algorithms and techniques.",
  },
  {
    id: "3",
    name: "Interview with Prof. Smith",
    type: "audio",
    dateAdded: "2024-04-25",
    status: "not-indexed",
    description: "An insightful interview discussing the future of AI in education.",
  },
  {
    id: "4",
    name: "Research Paper on NLP",
    type: "pdf",
    dateAdded: "2024-04-22",
    status: "ready",
    description: "Latest research findings in natural language processing.",
  },
  {
    id: "5",
    name: "Course Notes",
    type: "text",
    dateAdded: "2024-04-20",
    status: "ready",
    description: "Detailed notes from the Advanced AI course.",
  },
  {
    id: "6",
    name: "Stanford AI Course",
    type: "link",
    dateAdded: "2024-04-18",
    status: "error",
    description: "Link to Stanford's online course on artificial intelligence.",
  },
]

export function ResourcesGrid() {
  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "audio":
        return <FileAudio className="h-10 w-10 text-purple-500" />
      case "text":
        return <FileText className="h-10 w-10 text-green-500" />
      case "link":
        return <LinkIcon className="h-10 w-10 text-orange-500" />
      default:
        return <FileIcon className="h-10 w-10" />
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(resource.type)}
                <div>
                  <CardTitle className="text-base">{resource.name}</CardTitle>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(resource.dateAdded).toLocaleDateString()}
                  </div>
                </div>
              </div>
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
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{resource.description}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t pt-4">
            {getStatusBadge(resource.status)}
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
