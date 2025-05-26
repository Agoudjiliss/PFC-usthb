"use client"

import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function TrafficByDevice() {
  const data = {
    labels: ["Linux", "Mac", "iOS", "Windows", "Android", "Other"],
    datasets: [
      {
        data: [15, 25, 20, 30, 15, 20],
        backgroundColor: ["#9f9ff8", "#96e2d6", "#000000", "#92bfff", "#aec7ed", "#94e9b8"],
        borderRadius: 4,
        maxBarThickness: 30,
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
        beginAtZero: true,
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
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
