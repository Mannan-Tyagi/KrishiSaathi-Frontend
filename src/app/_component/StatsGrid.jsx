import React, { useEffect, useState } from "react";
import { Store, Wheat, TrendingUp, Calendar } from "lucide-react";
import { StatCard } from "./StatCard"; // Import the StatCard component
import { BASE_BACKEND_URL } from "../utils"; // Adjust the import path as needed

export const StatsGrid = () => {
  const [statsData, setStatsData] = useState([
    {
      title: "Total Markets",
      value: "Loading...",
      change: "+0",
      up: true,
      icon: Store,
      description: "Active agricultural markets",
    },
    {
      title: "Total Commodities",
      value: "Loading...",
      change: "+0",
      up: true,
      icon: Wheat,
      description: "Tracked agricultural products",
    },
    {
      title: "Average Price Change",
      value: "Loading...",
      change: "+0%",
      up: true,
      icon: TrendingUp,
      description: "Today's market movement",
    },
    {
      title: "Last Updated",
      value: "Loading...",
      change: "Fetching...",
      up: true,
      icon: Calendar,
      description: "Last updated time will appear here",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/commodities-count/`);
        const data = await response.json();

        const updatedStats = [
          {
            title: "Total Markets",
            value: 4888, // numeric for CountUp
            change: "+3",
            up: true,
            icon: Store,
            description: "Active agricultural markets",
          },
          {
            title: "Total Commodities",
            value: parseInt(data?.[0]?.count, 10) || 0,
            change: "+1",
            up: true,
            icon: Wheat,
            description: "Tracked agricultural products",
          },
          {
            title: "Average Price Change",
            value: 2400,
            change: "+3.2%",
            up: true,
            icon: TrendingUp,
            description: "Today's market movement",
          },
          {
            title: "Last Updated",
            value: new Date().toLocaleTimeString(),
            change: "Today",
            up: true,
            icon: Calendar,
            description: `Updated on ${new Date().toLocaleDateString()}`,
          },
        ];

        setStatsData(updatedStats);
      } catch (error) {
        // console.error("Failed to fetch stats data:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          up={stat.up}
          Icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
};