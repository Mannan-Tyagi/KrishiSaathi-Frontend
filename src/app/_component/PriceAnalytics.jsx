import React, { useState, useEffect } from "react"
import { Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

function PriceAnalytics({ selectedCommodity, selectedMarketId }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M")
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null)
  const [priceData, setPriceData] = useState([])
  const [seasonalData, setSeasonalData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPriceData = async () => {
    if (!selectedCommodity?.commodity_id || !selectedMarketId) return

    try {
      setLoading(true)
      setError(null)

      const [priceResponse, seasonalResponse] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/commodity_prices/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dateRange: selectedTimeframe,
            market_id: selectedMarketId,
            commodity_id: selectedCommodity.commodity_id
          })
        }),
        fetch('http://127.0.0.1:8000/api/seasonal-data/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            market_id: selectedMarketId,
            commodity_id: selectedCommodity.commodity_id
          })
        })
      ])

      if (!priceResponse.ok || !seasonalResponse.ok) {
        throw new Error(`Failed to fetch data`)
      }

      const [pData, sData] = await Promise.all([
        priceResponse.json(),
        seasonalResponse.json()
      ])

      // Transform price data
      const transformedPriceData = pData.map(item => ({
        date: `${item.year_value}-${item.month_value
          .toString()
          .padStart(2, '0')}-01`,
        price: parseFloat(item.avg_modal_price),
        minPrice: parseFloat(item.avg_min_price),
        maxPrice: parseFloat(item.avg_max_price)
      }))

      setPriceData(transformedPriceData)
      setSeasonalData(sData)
    } catch (error) {
      console.error('Error fetching data:', error)
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
    return Math.round(((maxPrice - minPrice) / avgPrice) * 100)
  }

  // Calculate price change percentage
  const calculatePriceChange = () => {
    if (priceData.length < 2) return 0
    const lastPrice = priceData[priceData.length - 1].price
    const previousPrice = priceData[priceData.length - 2].price || 1
    return (((lastPrice - previousPrice) / previousPrice) * 100).toFixed(1)
  }

  // Process seasonal data
  const processSeasonalData = () => {
    if (!seasonalData || !seasonalData.length) return []

    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']
    const years = [...new Set(seasonalData.map(item => item.year_value))]

    return seasons.map(season => {
      const seasonData = seasonalData.filter(item => item.season === season)
      const obj = { season }
      years.forEach(year => {
        const match = seasonData.find(item => item.year_value === year)
        if (match) obj[year] = parseFloat(match.avg_modal_price)
      })
      return obj
    })
  }

  // Generate line chart data for primary chart
  const generateChartData = () => {
    if (priceData.length === 0) return { points: [], path: '', area: '' }

    const prices = priceData.map(d => d.price)
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const range = maxPrice - minPrice
    const padding = range * 0.1
    const width = 100 / (prices.length - 1)

    // Map each data point to coordinates
    const points = prices.map((price, i) => {
      const x = i * width
      const y =
        100 - ((price - (minPrice - padding)) / (range + 2 * padding)) * 100
      return { x, y, price, date: priceData[i].date }
    })

    return {
      points,
      path: points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' '),
      area: `${points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ')} L ${points[points.length - 1].x} 100 L 0 100 Z`
    }
  }

  // Format date
  const formatDate = dateStr => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  // Format price with Indian Rupee
  const formatPrice = price => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const chartData = generateChartData()
  const volatilityScore = calculateVolatility()
  const priceChange = calculatePriceChange()

  if (!selectedCommodity || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                {!selectedCommodity
                  ? 'Select a commodity to view price analytics'
                  : 'Loading price analytics...'}
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

  // Calculate timeframe-based changes for the Price Movement Indicators
  const firstPrice = priceData[0]?.price || 0
  const lastPrice = priceData[priceData.length - 1]?.price || 0
  const timeframeChange = lastPrice - firstPrice
  const timeframeChangePercent = firstPrice
    ? ((timeframeChange / firstPrice) * 100).toFixed(2)
    : '0'

  const averagePrice =
    priceData.length > 0
      ? priceData.reduce((sum, item) => sum + item.price, 0) / priceData.length
      : 0
  const minPrice = priceData.length > 0 ? Math.min(...priceData.map(item => item.price)) : 0
  const maxPrice = priceData.length > 0 ? Math.max(...priceData.map(item => item.price)) : 0

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <main className="max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
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
                <p className="text-sm text-gray-500">Real-time market insights</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {['1M', '3M', '6M', '1Y'].map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      selectedTimeframe === timeframe
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200'
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
                    strokeDasharray={`${((2 * Math.PI * 36) * volatilityScore) / 100} ${
                      2 * Math.PI * 36
                    }`}
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
                <p className="text-xs text-gray-500 mt-1">Moderate Volatility</p>
              </div>
            </div>

            {/* Price Trend Chart */}
            <div className="col-span-5 bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Price Trend</h3>
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
                    const index = Math.round((x / rect.width) * (priceData.length - 1))
                    setHoveredDataPoint(index)
                  }}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                />

                {/* Tooltip */}
                {hoveredDataPoint !== null &&
                  hoveredDataPoint < chartData.points.length && (
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
                    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area under curve */}
                  <path
                    d={chartData.area}
                    fill="url(#areaGradient)"
                    className="transition-all duration-300"
                  />

                  {/* Line gradient */}
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>

                  {/* Price line */}
                  <path
                    d={chartData.path}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />

                  {/* Data points */}
                  {chartData.points.map((point, index) => (
                    <g key={index} className="transition-opacity duration-200">
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
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={hoveredDataPoint === index ? '4' : '0'}
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
            <div className="col-span-4 bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  Seasonal Price Trends
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    <span>Price Trend</span>
                  </div>
                </div>
              </div>

              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={processSeasonalData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="season" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={value => `₹${(value / 1000).toFixed(1)}K`}
                    />
                    <Tooltip
                      formatter={value => [`₹${value.toLocaleString()}`, 'Price']}
                      labelStyle={{ color: '#666' }}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />

                    {/* Gradients for each year's line */}
                    <defs>
                      <linearGradient
                        id="gradient2021"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>

                      <linearGradient
                        id="gradient2022"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>

                      <linearGradient
                        id="gradient2023"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>

                      <linearGradient
                        id="gradient2024"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#f472b6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>

                    {/* Lines for each year */}
                    <Line
                      type="monotone"
                      dataKey="2021"
                      stroke="url(#gradient2021)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="2021"
                    />
                    <Line
                      type="monotone"
                      dataKey="2022"
                      stroke="url(#gradient2022)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="2022"
                    />
                    <Line
                      type="monotone"
                      dataKey="2023"
                      stroke="url(#gradient2023)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="2023"
                    />
                    <Line
                      type="monotone"
                      dataKey="2024"
                      stroke="url(#gradient2024)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="2024"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Price Movement Indicators */}
            <div className="col-span-12 grid grid-cols-3 gap-4 mt-6">
              {[
                {
                  title: `${selectedTimeframe} Change`,
                  value: formatPrice(timeframeChange),
                  percent: `${timeframeChangePercent}%`,
                  trend: timeframeChange >= 0 ? 'up' : 'down'
                },
                {
                  title: 'Average Price',
                  value: formatPrice(averagePrice),
                  percent: 'vs. historical',
                  trend: 'up'
                },
                {
                  title: 'Price Range',
                  value: `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`,
                  percent: 'min-max',
                  trend: 'up'
                }
              ].map((indicator, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <h4 className="text-sm text-gray-500 mb-2">
                    {indicator.title}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {indicator.value}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        indicator.trend === 'up'
                          ? 'text-emerald-600'
                          : 'text-red-500'
                      }`}
                    >
                      {indicator.percent}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      indicator.trend === 'up'
                        ? 'text-emerald-600'
                        : 'text-red-500'
                    }`}
                  >
                    {indicator.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="text-xs font-medium">vs previous period</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PriceAnalytics