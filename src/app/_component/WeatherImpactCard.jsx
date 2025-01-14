// components/WeatherImpactCard/WeatherImpactCard.jsx
import React, { useState } from 'react';
import { CloudRain, RefreshCcw, Sun, Droplets, Wind, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mapping for safe Tailwind classes
const colorMap = {
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
  },
};

const WeatherMetricCard = ({ icon: Icon, title, value, impact, color }) => {
  const colorClasses = colorMap[color];

  return (
    <div className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colorClasses.text}`} />
        </div>
        <p className="text-sm font-medium text-gray-700">
          {title}
        </p>
      </div>
      <p className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform">
        {value}
      </p>
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClasses.badge} mt-2`}>
        <Zap className="w-3 h-3" />
        {impact}
      </div>
    </div>
  );
};

export const WeatherImpactCard = ({ lastUpdated = new Date() }) => {
  const [isLoading, setIsLoading] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(lastUpdated), { addSuffix: true });

  const weatherMetrics = [
    {
      icon: Sun,
      title: "Temperature",
      value: "32°C",
      impact: "Moderate Impact",
      color: "amber"
    },
    {
      icon: Droplets,
      title: "Rainfall",
      value: "120mm",
      impact: "High Impact",
      color: "blue"
    },
    {
      icon: Wind,
      title: "Wind Speed",
      value: "12 km/h",
      impact: "Low Impact",
      color: "emerald"
    },
    {
      icon: CloudRain,
      title: "Humidity",
      value: "75%",
      impact: "Moderate Impact",
      color: "purple"
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Implement your refresh logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg blur opacity-30"></div>
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <CloudRain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Weather Impact Analysis
            </h2>
            <p className="text-sm text-gray-500">
              Real-time weather conditions affecting crop prices
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">Last updated: {timeAgo}</p>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group"
          >
            <RefreshCcw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {weatherMetrics.map((weather, index) => (
          <WeatherMetricCard
            key={index}
            {...weather}
          />
        ))}
      </div>
    </div>
  );
};