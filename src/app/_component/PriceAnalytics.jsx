import React, { useState, useEffect } from "react"
import { Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"

function PriceAnalytics({ selectedCommodity, selectedMarketId }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M")
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null)
  const [priceData, setPriceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPriceData = async () => {
    if (!selectedCommodity?.commodity_id || !selectedMarketId) {
      return;
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('http://127.0.0.1:8000/api/commodity_prices/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange: selectedTimeframe,
          market_id: selectedMarketId,
          commodity_id: selectedCommodity.commodity_id
        })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch price data. Status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Transform API data to match our chart format
      const transformedData = data.map(item => ({
        date: `${item.year_value}-${item.month_value.toString().padStart(2, '0')}-01`,
        price: parseFloat(item.avg_modal_price),
        minPrice: parseFloat(item.avg_min_price),
        maxPrice: parseFloat(item.avg_max_price)
      }))
      
      setPriceData(transformedData)
    } catch (error) {
      console.error('Error fetching price data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPriceData()
  }, [selectedCommodity, selectedMarketId, selectedTimeframe])

  // Calculate volatility score based on price range
  const calculateVolatility = () => {
    if (priceData.length === 0) return 0
    const prices = priceData.map(d => d.price)
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    return Math.round((maxPrice - minPrice) / avgPrice * 100)
  }

  // Calculate price change percentage
  const calculatePriceChange = () => {
    if (priceData.length < 2) return 0
    const lastPrice = priceData[priceData.length - 1].price
    const previousPrice = priceData[priceData.length - 2].price
    return ((lastPrice - previousPrice) / previousPrice * 100).toFixed(1)
  }

  // Generate seasonal patterns
  const generateSeasonalPatterns = () => {
    if (priceData.length === 0) return []
    
    return [
      { season: 'Spring', avg: 3600, current: 3855 },
      { season: 'Summer', avg: 3400, current: 3600 },
      { season: 'Autumn', avg: 3200, current: 3400 },
      { season: 'Winter', avg: 3800, current: 4000 }
    ]
  }

  const volatilityScore = calculateVolatility()
  const priceChange = calculatePriceChange()
  const seasonalPatterns = generateSeasonalPatterns()

  // Generate line chart data with improved calculations
  const generateChartData = () => {
    if (priceData.length === 0) return { points: [], path: '', area: '' }

    const prices = priceData.map(d => d.price)
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const range = maxPrice - minPrice
    const padding = range * 0.1
    const width = 100 / (prices.length - 1)

    const points = prices.map((price, i) => {
      const x = i * width
      const y = 100 - ((price - (minPrice - padding)) / (range + 2 * padding)) * 100
      return { x, y, price, date: priceData[i].date }
    })

    return {
      points,
      path: points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
      area: `${points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")} L ${points[points.length - 1].x} 100 L 0 100 Z`
    }
  }

  const chartData = generateChartData()

  const formatDate = dateStr => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    })
  }

  const formatPrice = price => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(price)
  }

  if (!selectedCommodity || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                {!selectedCommodity ? "Select a commodity to view price analytics" : "Loading price analytics..."}
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-red-100">
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">Error loading price analytics: {error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCommodity.commodity_name} Price Analytics
                </h2>
                <p className="text-sm text-gray-500">
                  Real-time market insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {["1M", "3M", "6M", "1Y"].map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      selectedTimeframe === timeframe
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Price Volatility Card */}
            <div className="col-span-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Price Volatility Index
                </h3>
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Activity className="w-4 h-4 text-indigo-600" />
                </div>
              </div>

              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    fill="none"
                    stroke="url(#volatilityGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(2 * Math.PI * 36 * volatilityScore) / 100} ${2 * Math.PI * 36}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="volatilityGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {volatilityScore}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    +{priceChange}% vs last month
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Moderate Volatility
                </p>
              </div>
            </div>

            {/* Enhanced Price Trend Chart */}
            <div className="col-span-5 bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Price Trend
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>Price Movement</span>
                  </div>
                </div>
              </div>

              <div className="h-48 relative group">
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 z-10"
                  onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const index = Math.round(
                      (x / rect.width) * (priceData.length - 1)
                    )
                    setHoveredDataPoint(index)
                  }}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                />

                {/* Price and date tooltip */}
                {hoveredDataPoint !== null && (
                  <div
                    className="absolute z-20 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm transform -translate-x-1/2 -translate-y-full pointer-events-none"
                    style={{
                      left: `${chartData.points[hoveredDataPoint].x}%`,
                      top: `${chartData.points[hoveredDataPoint].y}%`
                    }}
                  >
                    <div className="font-medium">
                      {formatPrice(priceData[hoveredDataPoint].price)}
                    </div>
                    <div className="text-xs text-gray-300">
                      {formatDate(priceData[hoveredDataPoint].date)}
                    </div>
                  </div>
                )}

                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map(line => (
                    <line
                      key={line}
                      x1="0"
                      y1={line}
                      x2="100"
                      y2={line}
                      stroke="#f1f5f9"
                      strokeWidth="0.5"
                    />
                  ))}

                  {/* Area gradient */}
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area under the curve */}
                  <path
                    d={chartData.area}
                    fill="url(#areaGradient)"
                    className="transition-all duration-300"
                  />

                  {/* Price line */}
                  <path
                    d={chartData.path}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />

                  {/* Gradient for line */}
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>

                  {/* Data points */}
                  {chartData.points.map((point, index) => (
                    <g key={index} className="transition-opacity duration-200">
                      {/* Vertical guide line on hover */}
                      {hoveredDataPoint === index && (
                        <line
                          x1={point.x}
                          y1="0"
                          x2={point.x}
                          y2="100"
                          stroke="#6366f1"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                      )}
                      {/* Data point circle */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={hoveredDataPoint === index ? "4" : "0"}
                        fill="#6366f1"
                        className="transition-all duration-200"
                      />
                    </g>
                  ))}
                </svg>
              </div>

              <div className="flex justify-between mt-2">
                {priceData.map(
                  (data, index) =>
                    index % 2 === 0 && (
                      <span key={index} className="text-xs text-gray-500">
                        {formatDate(data.date)}
                      </span>
                    )
                )}
              </div>
            </div>

            {/* Seasonal Patterns */}
            <div className="col-span-4 bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Seasonal Patterns
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-200"></div>
                    <span className="text-xs text-gray-500">Historical</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    <span className="text-xs text-gray-500">Current</span>
                  </div>
                </div>
              </div>

              <div className="h-48 flex items-end justify-between">
                {seasonalPatterns.map((pattern, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-16">
                      <div
                        className="absolute bottom-0 w-6 bg-indigo-200 rounded-t-lg left-0 transition-all duration-300"
                        style={{ height: `${(pattern.avg / 4000) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {formatPrice(pattern.avg)}
                        </div>
                      </div>
                      <div
                        className="absolute bottom-0 w-6 bg-indigo-600 rounded-t-lg right-0 transition-all duration-300"
                        style={{ height: `${(pattern.current / 4000) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {formatPrice(pattern.current)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {pattern.season}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Movement Indicators */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              {
                title: `${selectedTimeframe} Change`,
                value: formatPrice(priceData[priceData.length - 1]?.price - priceData[0]?.price),
                percent: `${(((priceData[priceData.length - 1]?.price - priceData[0]?.price) / priceData[0]?.price) * 100).toFixed(2)}%`,
                trend: priceData[priceData.length - 1]?.price >= priceData[0]?.price ? "up" : "down"
              },
              {
                title: "Average Price",
                value: formatPrice(priceData.reduce((sum, item) => sum + item.price, 0) / priceData.length),
                percent: "vs. historical",
                trend: "up"
              },
              {
                title: "Price Range",
                value: `${formatPrice(Math.min(...priceData.map(item => item.price)))} - ${formatPrice(Math.max(...priceData.map(item => item.price)))}`,
                percent: "min-max",
                trend: "up"
              }
            ].map((indicator, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <h4 className="text-sm text-gray-500 mb-2">{indicator.title}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {indicator.value}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      indicator.trend === "up"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {indicator.percent}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 mt-1 ${
                    indicator.trend === "up"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {indicator.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">
                    vs previous period
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default PriceAnalytics