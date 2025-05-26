import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { StatsCard } from "@/components/stats-card"
import { UsersChart } from "@/components/users-chart"
import { ContentEngagement } from "@/components/content-engagement"
import { TrafficByDevice } from "@/components/traffic-by-device"
import { TrafficByLocation } from "@/components/traffic-by-location"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f9f9fa]">
        <Sidebar />
        <div className="flex-1 p-6">
          <DashboardHeader />
          <main>
            <h2 className="mb-4 text-xl font-medium">Overview</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard title="Views" value="7,265" change="+11.03%" trend="up" />
              <StatsCard title="Visits" value="3,671" change="-0.25%" trend="down" />
              <StatsCard title="New Users" value="156" change="+15.03%" trend="up" />
              <StatsCard title="Active Users" value="2,318" change="+4.05%" trend="up" />
            </div>

            <div className="mb-6">
              <UsersChart />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-medium text-gray-700">Traffic by Device</h3>
                <TrafficByDevice />
              </div>
              <div>
                <h3 className="mb-4 text-sm font-medium text-gray-700">Traffic by Location</h3>
                <TrafficByLocation />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-4 text-sm font-medium text-gray-700">Content</h3>
              <ContentEngagement />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
