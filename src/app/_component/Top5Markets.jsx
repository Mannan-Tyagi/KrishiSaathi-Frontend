import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
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

export const description = "A bar chart with a label";

// Define the initial chart config
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export function Top5Markets({ marketName, commodityName, variety, commodityId }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch data from API and map it to chartData
    async function fetchData() {
      try {
        const response = await fetch("https://xnv320z0-8000.inc1.devtunnels.ms/api/get-top6-market-prices/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commodity_id: commodityId }),
        });
        const data = await response.json();

        // Map API data to chartData format
        const formattedData = data.map((item) => ({
          marketName: item.market_name, // Use market_name for X-axis
          modalPrice: parseFloat(item.modal_price), // Converting modal_price to a number
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [commodityId]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Top Markets with Highest prices of {commodityName} <span className="text-sm">({variety})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="marketName" // Use marketName for the X-axis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="modalPrice" fill="#FFB6C1" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing Maximum Prices of {commodityName} in October 2024 Pan India
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}
