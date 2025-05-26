"use client"

import { useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export function UsersChart() {
  const [activeTab, setActiveTab] = useState("total")

  const tabs = [
    { id: "total", label: "Total Users" },
    { id: "new", label: "New Projects" },
    { id: "status", label: "Operating Status" },
  ]

  const timeRanges = [
    { id: "this", label: "This year" },
    { id: "last", label: "Last year" },
  ]

  const [activeTimeRange, setActiveTimeRange] = useState("this")

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

  const data = {
    labels: months,
    datasets: [
      {
        label: "Users",
        data: [10, 15, 13, 20, 18, 25, 22],
        borderColor: "#92bfff",
        backgroundColor: "rgba(146, 191, 255, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 30,
        ticks: {
          stepSize: 10,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 5,
      },
    },
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`text-sm ${
                activeTab === tab.id ? "font-medium text-[#1c1c1c]" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              className={`rounded-md px-2 py-1 text-xs ${
                activeTimeRange === range.id
                  ? "bg-gray-100 font-medium text-gray-800"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTimeRange(range.id)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
