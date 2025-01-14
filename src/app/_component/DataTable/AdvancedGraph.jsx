import React, { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import {
  BarChart3,
  LineChart as LineChartIcon,
  TrendingUp,
  Calendar
} from "lucide-react"

// Sample data generators
const generateVolatilityData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2024, 0, i + 1).toLocaleDateString(),
    volatility: Math.random() * 15 + 5,
    price: Math.floor(Math.random() * (2000 - 1500) + 1500)
  }))
}

const generateSeasonalData = () => {
  const seasons = ["Winter", "Spring", "Summer", "Fall"]
  return seasons.map(season => ({
    season,
    "2022": Math.floor(Math.random() * (2000 - 1500) + 1500),
    "2023": Math.floor(Math.random() * (2000 - 1500) + 1500),
    "2024": Math.floor(Math.random() * (2000 - 1500) + 1500)
  }))
}

const generateYearlyData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
    "2022": Math.floor(Math.random() * (2000 - 1500) + 1500),
    "2023": Math.floor(Math.random() * (2000 - 1500) + 1500),
    "2024": Math.floor(Math.random() * (2000 - 1500) + 1500)
  }))
}

const generateMonthlyData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
    average: Math.floor(Math.random() * (2000 - 1500) + 1500)
  }))
}

const graphOptions = [
  {
    id: "volatility",
    label: "Price Volatility",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: "seasonal",
    label: "Seasonal Patterns",
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: "yearly",
    label: "Year Comparison",
    icon: <LineChartIcon className="w-5 h-5" />
  },
  {
    id: "monthly",
    label: "Monthly Averages",
    icon: <BarChart3 className="w-5 h-5" />
  }
]

export const AdvancedGraph = () => {
  const [activeGraph, setActiveGraph] = useState("volatility")

  const renderGraph = () => {
    switch (activeGraph) {
      case "volatility":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={generateVolatilityData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d374814" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="#6366f1"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="volatility"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case "seasonal":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={generateSeasonalData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d374814" />
              <XAxis dataKey="season" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="2022"
                stroke="#6366f1"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="2023"
                stroke="#f59e0b"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="2024"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case "yearly":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={generateYearlyData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d374814" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="2022"
                stroke="#6366f1"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="2023"
                stroke="#f59e0b"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="2024"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case "monthly":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={generateMonthlyData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d374814" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar dataKey="average" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap gap-3">
          {graphOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setActiveGraph(option.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${
                  activeGraph === option.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-6">{renderGraph()}</div>
      </div>
    </div>
  )
}
