"use client";

import React, { useState } from "react"
import {
  Search,
  Bell,
  ChevronDown,
  MapPin,
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Droplets,
  Sun,
  Wind,
  CloudRain,
  Settings,
  Filter,
  Download,
  Share2,
  AlertTriangle,
  Zap,
  Truck,
  Warehouse,
  Users,
  Clock,
  RefreshCcw
} from "lucide-react"
import Navbar from "./_component/Navbar";
import { StatsGrid } from "./_component/StatsGrid";
import { CommodityCard } from "./_component/CommodityCard";
import { TopMarketsCard } from "./_component/TopMarketsCard";
import { WeatherImpactCard } from "./_component/WeatherImpactCard";
import ForecastCard from "./_component/ForecastCard";

function App() {
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Market Intelligence Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Real-time insights and AI-powered predictions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCcw className="w-4 h-4" />
              <span>Last updated: 2 mins ago</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <StatsGrid />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price Card */}
          <CommodityCard  name="Onion"
        variety="Red Variety"
        quality="Premium Quality"
        image="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=64&h=64"
        lastUpdated={new Date()}
        volume="2.5K MT"
        currentPrice={3855}
        priceUnit="100 KG"
        priceChange={-25}
        priceChangePercentage={-0.54}
        metrics={{
          low24h: { value: 3800, change: "-1.2%" },
          high24h: { value: 3950, change: "+2.1%" },
          average7d: { value: 3875, change: "+0.8%" }
        }}
        isMostTraded={true} />
          {/* Market Trends */}
          {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Top Markets</h2>
              </div>
              <div className="flex items-center gap-3">
                <select className="text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  market: "Kolkata Market",
                  price: 3800,
                  change: "+2.3%",
                  volume: "450 MT"
                },
                {
                  market: "Solapur",
                  price: 3600,
                  change: "-1.2%",
                  volume: "380 MT"
                },
                {
                  market: "Mumbai",
                  price: 3900,
                  change: "+3.1%",
                  volume: "520 MT"
                },
                {
                  market: "Bangalore",
                  price: 3700,
                  change: "-0.5%",
                  volume: "410 MT"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {item.market}
                      </span>
                      <p className="text-sm text-gray-500">
                        Volume: {item.volume}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{item.price}
                    </p>
                    <p
                      className={`text-sm ${
                        item.change.startsWith("+")
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
           <TopMarketsCard 
        title="Top Markets" /> 
        </div>

        {/* Weather Impact */}
        <WeatherImpactCard 
        lastUpdated={new Date('2025-01-14T06:50:42')}
      />
        {/* Forecast Section */}
        <ForecastCard />
      </main>
    </div>
  )
}

export default App
