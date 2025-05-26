"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, X } from "lucide-react"

interface Intent {
  id: string
  name: string
  example: string
  category: string
  lastUpdated: string
  confidence: number
}

interface EditIntentDialogProps {
  intent: Intent
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditIntentDialog({ intent, open, onOpenChange }: EditIntentDialogProps) {
  const [examples, setExamples] = useState<string[]>([])
  const [newExample, setNewExample] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [response, setResponse] = useState("")

  useEffect(() => {
    if (intent) {
      setName(intent.name)
      setCategory(intent.category.toLowerCase().replace(" ", "_"))
      setExamples([intent.example, "Comment puis-je faire cela ?", "Je voudrais savoir comment procéder"])
      setResponse(
        "Voici les informations concernant " +
          intent.category.toLowerCase() +
          ". N'hésitez pas à me poser d'autres questions.",
      )
    }
  }, [intent])

  const addExample = () => {
    if (newExample.trim() !== "") {
      setExamples([...examples, newExample.trim()])
      setNewExample("")
    }
  }

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'intent</DialogTitle>
          <DialogDescription>Modifiez les détails de cet intent pour améliorer la reconnaissance.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intent-name">Nom de l'intent</Label>
              <Input id="intent-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creation_startup">Création startup</SelectItem>
                  <SelectItem value="financement">Financement</SelectItem>
                  <SelectItem value="legal">Légal</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="technologie">Technologie</SelectItem>
                  <SelectItem value="general">Général</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Exemples de phrases</Label>
            <div className="rounded-md border p-4">
              <div className="mb-3 space-y-2">
                {examples.map((example, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm">{example}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => removeExample(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un exemple de phrase..."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addExample()
                    }
                  }}
                />
                <Button type="button" onClick={addExample} className="gap-1">
                  <PlusIcon className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-response">Réponse par défaut</Label>
            <Textarea
              id="default-response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer les modifications</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
