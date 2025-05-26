import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IntentsTable } from "@/components/intents-table"
import { FAQTable } from "@/components/faq-table"
import { AddIntentDialog } from "@/components/add-intent-dialog"
import { FilterIcon, PlusIcon, SearchIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"

export default function IntentsPage() {
  return (
    <div className="flex min-h-screen bg-[#f9f9fa]">
      <Sidebar activePage="intents" />
      <div className="flex-1 p-6">
        <DashboardHeader title="Fadi Mahassel" subtitle="Intents" />
        <main>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">📁 Gestion des Intents & FAQ</h1>
            <AddIntentDialog>
              <Button className="gap-1">
                <PlusIcon className="h-4 w-4" />
                Ajouter un intent
              </Button>
            </AddIntentDialog>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Rechercher des intents..." className="pl-9" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] gap-1 bg-white">
                      <FilterIcon className="h-4 w-4" />
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="creation">Création startup</SelectItem>
                      <SelectItem value="financement">Financement</SelectItem>
                      <SelectItem value="legal">Légal</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="tech">Technologie</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] bg-white">
                      <SelectValue placeholder="Dernière mise à jour" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les dates</SelectItem>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="quarter">Ce trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="intents" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="intents">Intents</TabsTrigger>
              <TabsTrigger value="faq">Questions fréquentes</TabsTrigger>
            </TabsList>
            <TabsContent value="intents" className="mt-0">
              <IntentsTable />
            </TabsContent>
            <TabsContent value="faq" className="mt-0">
              <FAQTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
