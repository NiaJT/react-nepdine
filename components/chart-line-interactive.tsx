"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
 
type ChartLineMultipleProps = {
  last30Days: { day: string; total: number | string; mobile?: number | string }[];
  thisWeekTotal: number | string;
  lastWeekTotal: number | string;
  averageCustomers: number | string;
};

export function ChartLineMultiple({
  last30Days,
  thisWeekTotal,
  lastWeekTotal,
  averageCustomers,
}: ChartLineMultipleProps) {
  const chartData = last30Days.map((d) => ({
    date: d.day,
    total: Number(d.total),
    mobile: d.mobile ? Number(d.mobile) : undefined,
  }));

  const chartConfig = {
    total: { label: "Total Sales", color: "var(--chart-1)" },
    mobile: { label: "Mobile Sales", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center border-b border-[#CFCFCF] pb-2">
        <CardTitle className="font-normal">SALES OVERVIEW</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>

      <CardContent className="h-64 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              {/* Gradient for Total Sales */}
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#426CFF" />
                  <stop offset="100%" stopColor="#FF5A44" />
                </linearGradient>
              </defs>

              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={false}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <CartesianGrid vertical={false} horizontal stroke="#E5E7EB" />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              {/* Total Sales line with gradient */}
              <Line dataKey="total" type="monotone" stroke="url(#totalGradient)" strokeWidth={2} dot={false} />

              {/* Mobile Sales line as solid color */}
              <Line dataKey="mobile" type="monotone" stroke="#A2D2FC" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-between border-t border-[#CFCFCF] pt-2 text-sm">
          {/* This Week */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-1 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#426CFF] to-[#FF5A44]" />
              This week
            </div>
            <div className="text-muted-foreground">{thisWeekTotal}</div>
          </div>

          {/* Last Week */}
          <div className="flex flex-col items-center gap-1 flex-1 border-l border-[#CFCFCF]">
            <div className="flex items-center gap-1 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A2D2FC]" />
              Last week
            </div>
            <div className="text-muted-foreground">{lastWeekTotal}</div>
          </div>

          {/* Average Customers */}
          <div className="flex flex-col items-center gap-1 flex-1 border-l border-[#CFCFCF]">
            <div className="flex items-center gap-1 font-medium">Average Customers</div>
            <div className="text-muted-foreground">{averageCustomers}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
