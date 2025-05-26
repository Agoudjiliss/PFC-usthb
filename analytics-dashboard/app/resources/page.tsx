import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResourcesTable } from "@/components/resources-table"
import { ResourcesGrid } from "@/components/resources-grid"
import { AddResourceDialog } from "@/components/add-resource-dialog"
import { CalendarIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen bg-[#f9f9fa]">
      <Sidebar activePage="resources" />
      <div className="flex-1 p-6">
        <DashboardHeader title="Fadi Mahassel" subtitle="Resources" />
        <main>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold">📁 Resources Manager</h1>
            <AddResourceDialog>
              <Button className="gap-1">
                <PlusIcon className="h-4 w-4" />
                Add Resource
              </Button>
            </AddResourceDialog>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search resources..." className="pl-9" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px] gap-1 bg-white">
                      <FilterIcon className="h-4 w-4" />
                      <SelectValue placeholder="File Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-1 bg-white">
                    <CalendarIcon className="h-4 w-4" />
                    Date Range
                  </Button>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px] bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="not-indexed">Not Indexed</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="table" className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              <div className="text-sm text-gray-500">
                Showing <strong>24</strong> resources
              </div>
            </div>
            <TabsContent value="table" className="mt-0">
              <ResourcesTable />
            </TabsContent>
            <TabsContent value="grid" className="mt-0">
              <ResourcesGrid />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
