import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainingResourcesTable } from "@/components/training-resources-table"
import { TrainingHistory } from "@/components/training-history"
import { BarChart2, RefreshCw } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"

export default function TrainingPage() {
  return (
    <div className="flex min-h-screen bg-[#f9f9fa]">
      <Sidebar activePage="training" />
      <div className="flex-1 p-6">
        <DashboardHeader title="Fadi Mahassel" subtitle="Training" />
        <main>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">⚙️ Training Status (RASA)</h1>
            <Button className="gap-1">
              <BarChart2 className="h-4 w-4" />
              Start Manual Training
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Latest Training</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Model Name</div>
                    <div className="font-medium">rasa_model_20240502</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                      <span className="font-medium text-green-600">Training in progress</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Started</div>
                    <div className="font-medium">May 2, 2024 - 10:15 AM</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">12m 34s</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium">Training Logs</div>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                    View Full Logs
                  </Button>
                </div>
                <div className="rounded-md bg-gray-100 p-3 font-mono text-xs text-gray-800">
                  <div className="mb-1">[10:27:15] Epoch 3/10: Training loss: 0.0823</div>
                  <div className="mb-1">[10:27:42] Epoch 4/10: Training loss: 0.0612</div>
                  <div>[10:28:09] Epoch 5/10: Training loss: 0.0547</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Training History</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <TrainingHistory />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="processed">
              <TabsList className="mb-4">
                <TabsTrigger value="processed">Processed Resources</TabsTrigger>
                <TabsTrigger value="pending">Pending Resources</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
              </TabsList>
              <TabsContent value="processed">
                <TrainingResourcesTable status="processed" />
              </TabsContent>
              <TabsContent value="pending">
                <TrainingResourcesTable status="pending" />
              </TabsContent>
              <TabsContent value="errors">
                <TrainingResourcesTable status="error" />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
