"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export function TrafficByLocation() {
  const data = {
    labels: ["Alger", "Boumerdès", "Oran", "Other"],
    datasets: [
      {
        data: [52.1, 22.6, 14.1, 11.2],
        backgroundColor: ["#9f9ff8", "#96e2d6", "#92bfff", "#e6f1fd"],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "65%",
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex">
        <div className="h-64 w-1/2">
          <Doughnut data={data} options={options} />
        </div>
        <div className="w-1/2 space-y-2 pl-4">
          {data.labels.map((label, index) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                />
                <span className="text-sm">{label}</span>
              </div>
              <span className="text-sm font-medium">{data.datasets[0].data[index]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
