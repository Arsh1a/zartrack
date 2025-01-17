"use client";

import { Pie, PieChart } from "recharts";
import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { calculateGroupedSum } from "@/lib/transform-data";
import { randomHslFromString } from "@/lib/utils";
import { CalculatedAsset } from "./schemas";

interface Props {
  calculatedAssets: CalculatedAsset[];
}

export default function AssetComposition({ calculatedAssets }: Props) {
  const transformedData = useMemo(
    () =>
      calculateGroupedSum(calculatedAssets, "code", ["totalMarketPrice"]).map(
        (item) => ({
          ...item,
          fill: randomHslFromString(item.code ?? ""),
        })
      ),
    [calculatedAssets]
  );

  const chartConfig: ChartConfig = useMemo(() => {
    return transformedData.reduce((acc, item) => {
      if (item.code) {
        acc[item.code] = { label: item.code.toUpperCase() };
      }
      return acc;
    }, {} as ChartConfig);
  }, [transformedData]);

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader>
        <CardTitle className="text-base">Asset value composition</CardTitle>
      </CardHeader>
      <CardContent className="my-auto">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={transformedData}
              dataKey="totalMarketPrice"
              nameKey="code"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="code" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
