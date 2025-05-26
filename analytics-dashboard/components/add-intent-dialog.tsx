"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, X } from "lucide-react"

export function AddIntentDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [examples, setExamples] = useState<string[]>([
    "Comment puis-je faire cela ?",
    "Je voudrais savoir comment procéder",
  ])
  const [newExample, setNewExample] = useState("")

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel intent</DialogTitle>
          <DialogDescription>
            Créez un nouvel intent pour que le chatbot puisse reconnaître et répondre à ce type de demande.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intent-name">Nom de l'intent</Label>
              <Input id="intent-name" placeholder="ex: ask_funding_options" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creation">Création startup</SelectItem>
                  <SelectItem value="financement">Financement</SelectItem>
                  <SelectItem value="legal">Légal</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="tech">Technologie</SelectItem>
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
              placeholder="Entrez la réponse par défaut que le chatbot devrait donner..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit">Créer l'intent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
