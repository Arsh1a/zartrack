"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";

import {
  Card,
  CardContent,
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
import { CalculatedAsset } from "./schemas";
import { calculateGroupedAverage } from "@/lib/transform-data";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { calculateTotalPnL } from "@/lib/calculate";

interface Props {
  calculatedAssets: CalculatedAsset[];
}

const chartConfig = {
  profitAndLossPercentage: {
    label: "PNL %",
  },
} satisfies ChartConfig;

export function AssetCompounding({ calculatedAssets }: Props) {
  const transformedData = useMemo(
    () =>
      calculateGroupedAverage(calculatedAssets, "code", [
        "profitAndLossPercentage",
        "profitAndLoss",
      ]).map((item) => ({ ...item, code: item.code?.toUpperCase() })),
    [calculatedAssets]
  );

  const totalProfitAndLossAverage = useMemo(
    () => calculateTotalPnL(calculatedAssets),
    [calculatedAssets]
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Asset value compounding</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[250px]">
          <BarChart accessibilityLayer data={transformedData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="profitAndLossPercentage" radius={6}>
              <LabelList position="top" dataKey="code" fillOpacity={1} />
              {transformedData.map((item) => (
                <Cell
                  key={item.code}
                  fill={
                    (item.profitAndLossPercentage ?? 0) > 0
                      ? "hsl(var(--success))"
                      : "hsl(var(--destructive))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none items-center">
          Total PNL percentage:
          <span
            className={cn(
              totalProfitAndLossAverage > 0
                ? "text-success"
                : "text-destructive",
              "font-bold text-base"
            )}
          >
            {totalProfitAndLossAverage
              ? `${totalProfitAndLossAverage.toFixed(2)}%`
              : "-"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
