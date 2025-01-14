import React, { useEffect, useState } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { getMarketId } from "../marketutils";
import { BASE_BACKEND_URL } from "../../utils";

const chartConfig = {
  modal: {
    label: "Actual Price",
    color: "hsl(262, 83%, 58%)", // Vibrant purple
    gradient: ["rgba(167, 139, 250, 0.3)", "rgba(167, 139, 250, 0)"],
  },
  predicted: {
    label: "Predicted Price",
    color: "hsl(199, 89%, 48%)", // Bright blue
    gradient: ["rgba(56, 189, 248, 0.3)", "rgba(56, 189, 248, 0)"],
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
        const response = await fetch(
          `${BASE_BACKEND_URL}/api/get-commodity-forecast/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              commodity_id: commodityId,
              market_id: marketId,
            }),
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const formattedData = data.map((item) => ({
          week: item.week,
          modal: parseFloat(item.avg_modal_price),
          predicted: parseFloat(item.avg_predicted_price),
        }));
        setChartData(formattedData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [commodityId, marketId]);

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          <p className="text-violet-900 font-medium">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50/80 backdrop-blur-sm rounded-lg border border-red-200">
        <p className="text-red-700 font-medium text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-violet-600 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="relative">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="w-7 h-7" />
              Market Price Analysis
            </CardTitle>
            <CardDescription className="text-blue-100 mt-2">
              Historical vs Predicted Price Trends - Last 32 Weeks
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer config={chartConfig} className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="modalGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    {chartConfig.modal.gradient.map((color, index) => (
                      <stop
                        key={index}
                        offset={index * 100 + "%"}
                        stopColor={color}
                      />
                    ))}
                  </linearGradient>
                  <linearGradient
                    id="predictedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    {chartConfig.predicted.gradient.map((color, index) => (
                      <stop
                        key={index}
                        offset={index * 100 + "%"}
                        stopColor={color}
                      />
                    ))}
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tickFormatter={(value) => `Week ${value}`}
                  fontSize={12}
                  stroke="#64748b"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                  fontSize={12}
                  stroke="#64748b"
                />
                <ChartTooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "rgba(0,0,0,0.2)",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    paddingBottom: "20px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="modal"
                  name="Actual Price"
                  stroke={chartConfig.modal.color}
                  fill="url(#modalGradient)"
                  strokeWidth={2}
                  dot={{ r: 2, fill: chartConfig.modal.color }}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  name="Predicted Price"
                  stroke={chartConfig.predicted.color}
                  fill="url(#predictedGradient)"
                  strokeWidth={2}
                  dot={{ r: 2, fill: chartConfig.predicted.color }}
                  activeDot={{ r: 4, strokeWidth: 0 }}
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
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-semibold text-gray-900 mb-2">{`Week ${label}`}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className={`text-sm font-medium ${
              entry.name === "Actual Price"
                ? "text-violet-600"
                : "text-blue-600"
            }`}
          >
            {entry.name}: ₹
            {entry.value.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default Chart;
