import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { Bot, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#f9f9fa]">
      <Sidebar activePage="settings" />
      <div className="flex-1 p-6">
        <DashboardHeader title="Fadi Mahassel" subtitle="Settings" />
        <main>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">⚙️ Paramètres du Chatbot</h1>
            <p className="mt-1 text-gray-500">Configurez le comportement et les réponses du chatbot</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Statut du Chatbot
                  </CardTitle>
                  <CardDescription>Activez ou désactivez le chatbot sur votre plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="font-medium">Chatbot actif</div>
                      <div className="text-sm text-gray-500">Le chatbot est visible et répond aux utilisateurs</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comportement par défaut</CardTitle>
                  <CardDescription>Configurez comment le chatbot interagit avec les utilisateurs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-message">Message d'accueil</Label>
                    <Textarea
                      id="welcome-message"
                      placeholder="Saisissez le message d'accueil..."
                      defaultValue="Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fallback-message">Message quand le bot ne comprend pas</Label>
                    <Textarea
                      id="fallback-message"
                      placeholder="Message par défaut quand le bot ne comprend pas..."
                      defaultValue="Je n'ai pas bien compris votre demande. Pourriez-vous reformuler ou choisir une option dans le menu ?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="analysis-frequency">Fréquence d'analyse des nouvelles données</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="analysis-frequency">
                        <SelectValue placeholder="Sélectionnez une fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">1 fois par jour</SelectItem>
                        <SelectItem value="weekly">1 fois par semaine</SelectItem>
                        <SelectItem value="manual">Manuellement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="gap-1">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Messages personnalisés</CardTitle>
                  <CardDescription>Personnalisez les messages du chatbot pour différentes situations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="greeting">Message de salutation</Label>
                    <Input
                      id="greeting"
                      defaultValue="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
                      placeholder="Message de salutation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goodbye">Message d'au revoir</Label>
                    <Input
                      id="goodbye"
                      defaultValue="Merci de votre visite. À bientôt !"
                      placeholder="Message d'au revoir"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Message après inactivité</Label>
                    <Input
                      id="timeout"
                      defaultValue="Êtes-vous toujours là ? Je suis disponible si vous avez d'autres questions."
                      placeholder="Message après inactivité"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error">Message d'erreur technique</Label>
                    <Input
                      id="error"
                      defaultValue="Désolé, une erreur technique est survenue. Veuillez réessayer plus tard."
                      placeholder="Message d'erreur technique"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="gap-1">
                    <Save className="h-4 w-4" />
                    Enregistrer les messages
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
