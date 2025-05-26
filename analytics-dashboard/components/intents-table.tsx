"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditIntentDialog } from "@/components/edit-intent-dialog"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"

type Intent = {
  id: string
  name: string
  example: string
  category: string
  lastUpdated: string
  confidence: number
}

const intents: Intent[] = [
  {
    id: "1",
    name: "greeting",
    example: "Bonjour, comment ça va ?",
    category: "Général",
    lastUpdated: "2024-05-01",
    confidence: 98,
  },
  {
    id: "2",
    name: "startup_creation",
    example: "Comment créer une startup en Algérie ?",
    category: "Création startup",
    lastUpdated: "2024-04-28",
    confidence: 92,
  },
  {
    id: "3",
    name: "funding_options",
    example: "Quelles sont les options de financement disponibles ?",
    category: "Financement",
    lastUpdated: "2024-04-25",
    confidence: 87,
  },
  {
    id: "4",
    name: "legal_requirements",
    example: "Quelles sont les exigences légales pour une SARL ?",
    category: "Légal",
    lastUpdated: "2024-04-22",
    confidence: 85,
  },
  {
    id: "5",
    name: "tax_information",
    example: "Comment fonctionne la fiscalité pour les startups ?",
    category: "Légal",
    lastUpdated: "2024-04-20",
    confidence: 82,
  },
  {
    id: "6",
    name: "incubator_info",
    example: "Quels sont les incubateurs disponibles à Alger ?",
    category: "Création startup",
    lastUpdated: "2024-04-18",
    confidence: 90,
  },
  {
    id: "7",
    name: "marketing_strategy",
    example: "Comment développer une stratégie marketing pour ma startup ?",
    category: "Marketing",
    lastUpdated: "2024-04-15",
    confidence: 78,
  },
  {
    id: "8",
    name: "tech_stack",
    example: "Quelle stack technique choisir pour mon projet ?",
    category: "Technologie",
    lastUpdated: "2024-04-12",
    confidence: 75,
  },
]

export function IntentsTable() {
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      "Création startup": { bg: "bg-blue-50", text: "text-blue-700" },
      Financement: { bg: "bg-green-50", text: "text-green-700" },
      Légal: { bg: "bg-purple-50", text: "text-purple-700" },
      Marketing: { bg: "bg-orange-50", text: "text-orange-700" },
      Technologie: { bg: "bg-cyan-50", text: "text-cyan-700" },
      Général: { bg: "bg-gray-50", text: "text-gray-700" },
    }

    const style = colors[category] || { bg: "bg-gray-50", text: "text-gray-700" }

    return (
      <Badge variant="outline" className={`${style.bg} ${style.text} hover:${style.bg}`}>
        {category}
      </Badge>
    )
  }

  const getConfidenceBadge = (confidence: number) => {
    let color = "bg-green-50 text-green-700"
    if (confidence < 80) color = "bg-yellow-50 text-yellow-700"
    if (confidence < 70) color = "bg-red-50 text-red-700"

    return (
      <Badge variant="outline" className={`${color} hover:${color.split(" ")[0]}`}>
        {confidence}%
      </Badge>
    )
  }

  const handleEdit = (intent: Intent) => {
    setSelectedIntent(intent)
    setIsEditDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de l'intent</TableHead>
              <TableHead>Exemple de phrase</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Confiance</TableHead>
              <TableHead>Dernière mise à jour</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {intents.map((intent) => (
              <TableRow key={intent.id}>
                <TableCell className="font-medium">{intent.name}</TableCell>
                <TableCell>{intent.example}</TableCell>
                <TableCell>{getCategoryBadge(intent.category)}</TableCell>
                <TableCell>{getConfidenceBadge(intent.confidence)}</TableCell>
                <TableCell>{new Date(intent.lastUpdated).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(intent)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedIntent && (
        <EditIntentDialog intent={selectedIntent} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      )}
    </>
  )
}
