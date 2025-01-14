import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const timeRanges = [
  { value: "15", label: "Last 15 Days" },
  { value: "30", label: "Last 30 Days" },
];

const states = [
  { value: "AP", label: "Andhra Pradesh" },
  { value: "GJ", label: "Gujarat" },
  { value: "MH", label: "Maharashtra" },
  { value: "TN", label: "Tamil Nadu" },
];

const commodities = [
  { value: "COTTON", label: "Cotton" },
  { value: "WHEAT", label: "Wheat" },
  { value: "RICE", label: "Rice" },
  { value: "MAIZE", label: "Maize" },
];

export function CommodityComparison() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("15");
  const [selectedState1, setSelectedState1] = useState("");
  const [selectedState2, setSelectedState2] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCommodity || !selectedState1 || !selectedState2) return;

      setLoading(true);
      try {
        const response = await fetch(
          "https://xnv320z0-8000.inc1.devtunnels.ms/api/get-commodity-comparison/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              commodity_id: selectedCommodity,
              state1: selectedState1,
              state2: selectedState2,
              days: parseInt(selectedTimeRange),
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTimeRange, selectedState1, selectedState2, selectedCommodity]);

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <CardTitle className="text-2xl font-bold">
          State-wise Price Comparison
        </CardTitle>
        <CardDescription className="text-violet-100">
          Compare commodity prices between different states
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Commodity
            </label>
            <Select
              value={selectedCommodity}
              onValueChange={setSelectedCommodity}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select commodity" />
              </SelectTrigger>
              <SelectContent>
                {commodities.map((commodity) => (
                  <SelectItem key={commodity.value} value={commodity.value}>
                    {commodity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">State 1</label>
            <Select value={selectedState1} onValueChange={setSelectedState1}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select first state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">State 2</label>
            <Select value={selectedState2} onValueChange={setSelectedState2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select second state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Time Range
            </label>
            <Select
              value={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-[400px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200/50"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6B7280" }}
                  tickLine={{ stroke: "#9CA3AF" }}
                />
                <YAxis
                  tick={{ fill: "#6B7280" }}
                  tickLine={{ stroke: "#9CA3AF" }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "0.5rem",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [`₹${value}`, "Price"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="state1Price"
                  name={states.find((s) => s.value === selectedState1)?.label}
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6" }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="state2Price"
                  name={states.find((s) => s.value === selectedState2)?.label}
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={{ fill: "#EC4899" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select options above to view comparison data
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CommodityComparison;
