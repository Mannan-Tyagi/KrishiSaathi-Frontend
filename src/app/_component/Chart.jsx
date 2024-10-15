"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { week: "0", modal: 2043.8, predicted: 2217 },
  { week: "1", modal: 1937.75, predicted: 2116 },
  { week: "2", modal: 1613.8, predicted: 1832 },
  { week: "3", modal: 1385.666667, predicted: 1507 },
  { week: "4", modal: 1453.333333, predicted: 1605 },
  { week: "5", modal: 1500, predicted: 1619 },
  { week: "6", modal: 1519.2, predicted: 1634 },
  { week: "7", modal: 1760.333333, predicted: 1982 },
  { week: "8", modal: 1562.25, predicted: 1748 },
  { week: "9", modal: 1601.5, predicted: 1828 },
  { week: "10", modal: 1766, predicted: 1901 },
  { week: "11", modal: 1591.6, predicted: 1720 },
  { week: "12", modal: 1500.25, predicted: 1633 },
  { week: "13", modal: 1719, predicted: 1871 },
  { week: "14", modal: 1406, predicted: 1594 },
  { week: "15", modal: 1562.5, predicted: 1669 },
  { week: "16", modal: 1614.666667, predicted: 1742 },
  { week: "17", modal: 1544, predicted: 1659 },
  { week: "18", modal: 2025.4, predicted: 2235 },
  { week: "19", modal: 1664, predicted: 1791 },
  { week: "20", modal: 1531, predicted: 1690 },
  { week: "21", modal: 1562.333333, predicted: 1760 },
  { week: "22", modal: 1712.6, predicted: 1840 },
  { week: "23", modal: 1916.666667, predicted: 2108 },
  { week: "24", modal: 2125, predicted: 2277 },
  { week: "25", modal: 2156, predicted: 2397 },
  { week: "26", modal: 2631.6, predicted: 2873 },
  { week: "27", modal: 2813, predicted: 2926 },
  { week: "28", modal: 2695.5, predicted: 2869 },
  { week: "29", modal: 2812.6, predicted: 2982 },
  { week: "30", modal: 2906, predicted: 3097 },
  { week: "31", modal: 2969, predicted: 3092 },
  { week: "32", modal: 2891, predicted: 3115 },
  { week: "33", modal: 3328.5, predicted: 3525 },
  { week: "34", modal: 3438, predicted: 3624 },
];

const chartConfig = {
  modal: {
    label: "Actual Price",
    color: "#3b82f6", // Bright blue
  },
  predicted: {
    label: "Predicted Price",
    color: "#10b981", // Emerald green
  },
};

export function Chart() {
  return (
    <div className="w-full  bg-gradient-to-r from-blue-50 to-green-50">
      <Card className="w-full overflow-hidden shadow-lg rounded-md">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <CardTitle className="text-2xl font-bold flex items-center">
            <TrendingUp className="mr-2" />
            Onion Price Trends in Darjeeling, West Bengal
          </CardTitle>
          <CardDescription className="text-blue-100">
            Last 32 weeks of 2024 - Actual vs Predicted Prices
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer config={chartConfig} className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `Week ${value}`}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `₹${value}`}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(200, 200, 200, 0.1)" }}
                  content={<CustomTooltip />}
                />
                <Area
                  type="monotone"
                  dataKey="modal"
                  stroke={chartConfig.modal.color}
                  fill={chartConfig.modal.color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke={chartConfig.predicted.color}
                  fill={chartConfig.predicted.color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-bold text-gray-800">{`Week ${label}`}</p>
        <p className="text-sm text-blue-600">{`Actual: ₹${payload[0].value.toFixed(
          2
        )}`}</p>
        <p className="text-sm text-green-600">{`Predicted: ₹${payload[1].value.toFixed(
          2
        )}`}</p>
      </div>
    );
  }
  return null;
};

export default Chart;
