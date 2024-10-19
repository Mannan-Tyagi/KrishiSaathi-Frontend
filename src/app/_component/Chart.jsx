"use client";

import React, { useEffect, useState } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { getMarketId } from "./marketutils";

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

export function Chart({ commodityId }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const marketId = getMarketId();

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/get-commodity-forecast/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commodity_id: commodityId,
            market_id: marketId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        // Transform the API data to the format required by the chart
        const formattedData = data.map((item) => ({
          week: item.week,
          modal: parseFloat(item.avg_modal_price),
          predicted: parseFloat(item.avg_predicted_price),
        }));
        setChartData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [commodityId, marketId]); // Include both in the dependency array

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display any fetch error
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-green-50">
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
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
        <p className="text-sm text-blue-600">{`Actual: ₹${payload[0].value.toFixed(2)}`}</p>
        <p className="text-sm text-green-600">{`Predicted: ₹${payload[1].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export default Chart;
