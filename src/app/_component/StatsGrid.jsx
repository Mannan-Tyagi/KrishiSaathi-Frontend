import React from 'react';
import { Store, Wheat, TrendingUp, Calendar } from 'lucide-react';
import { StatCard } from './StatCard';
import { format } from 'date-fns';

const currentDate = new Date('2025-01-14 07:02:52');

const statsData = [
  {
    title: "Total Markets",
    value: "3,245",
    change: "+12%",
    up: true,
    icon: Store,
    description: "Active agricultural markets"
  },
  {
    title: "Total Commodities",
    value: "156",
    change: "+8.1%",
    up: true,
    icon: Wheat,
    description: "Tracked agricultural products"
  },
  {
    title: "Average Price Change",
    value: "₹2.4K",
    change: "+3.2%",
    up: true,
    icon: TrendingUp,
    description: "Today's market movement"
  },
  {
    title: "Last Updated",
    value: format(currentDate, 'HH:mm'),
    change: "Today",
    up: true,
    icon: Calendar,
    description: `Updated by ${currentDate.toLocaleDateString()}`
  }
];

export const StatsGrid = () => {
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

