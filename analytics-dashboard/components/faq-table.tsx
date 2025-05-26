"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { BarChart2, Link, MoreHorizontal, Tag } from "lucide-react"

type FAQ = {
  id: string
  question: string
  frequency: number
  intent: string | null
  category: string
  lastAsked: string
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Comment obtenir un financement pour ma startup en Algérie ?",
    frequency: 87,
    intent: "funding_options",
    category: "Financement",
    lastAsked: "2024-05-01",
  },
  {
    id: "2",
    question: "Quelles sont les étapes pour créer une entreprise à Alger ?",
    frequency: 76,
    intent: "startup_creation",
    category: "Création startup",
    lastAsked: "2024-04-30",
  },
  {
    id: "3",
    question: "Quels documents faut-il pour ouvrir une SARL ?",
    frequency: 65,
    intent: "legal_requirements",
    category: "Légal",
    lastAsked: "2024-04-29",
  },
  {
    id: "4",
    question: "Y a-t-il des incubateurs à Oran ?",
    frequency: 58,
    intent: "incubator_info",
    category: "Création startup",
    lastAsked: "2024-04-28",
  },
  {
    id: "5",
    question: "Comment faire une étude de marché ?",
    frequency: 52,
    intent: "marketing_strategy",
    category: "Marketing",
    lastAsked: "2024-04-27",
  },
  {
    id: "6",
    question: "Quels sont les avantages fiscaux pour les startups ?",
    frequency: 47,
    intent: "tax_information",
    category: "Légal",
    lastAsked: "2024-04-26",
  },
  {
    id: "7",
    question: "Comment protéger ma propriété intellectuelle ?",
    frequency: 42,
    intent: null,
    category: "Légal",
    lastAsked: "2024-04-25",
  },
  {
    id: "8",
    question: "Quelles technologies sont les plus demandées sur le marché algérien ?",
    frequency: 38,
    intent: null,
    category: "Technologie",
    lastAsked: "2024-04-24",
  },
]

export function FAQTable() {
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

  const getFrequencyColor = (frequency: number) => {
    if (frequency >= 70) return "bg-green-500"
    if (frequency >= 50) return "bg-blue-500"
    if (frequency >= 30) return "bg-yellow-500"
    return "bg-gray-500"
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Fréquence</TableHead>
            <TableHead>Intent associé</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Dernière demande</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell className="font-medium">{faq.question}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={faq.frequency} className={`h-2 w-16 ${getFrequencyColor(faq.frequency)}`} />
                  <span className="text-sm font-medium">{faq.frequency}%</span>
                </div>
              </TableCell>
              <TableCell>
                {faq.intent ? (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Link className="h-3.5 w-3.5" />
                    {faq.intent}
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                    <Tag className="h-3.5 w-3.5" />
                    Associer
                  </Button>
                )}
              </TableCell>
              <TableCell>{getCategoryBadge(faq.category)}</TableCell>
              <TableCell>{new Date(faq.lastAsked).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Voir les statistiques</DropdownMenuItem>
                      <DropdownMenuItem>Associer à un intent</DropdownMenuItem>
                      <DropdownMenuItem>Marquer comme résolu</DropdownMenuItem>
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
