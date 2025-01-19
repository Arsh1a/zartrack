"use client";

import { LatestPrices } from "@/types";
import AddAsset from "./add-asset";
import AssetComposition from "./asset-composition";
import AssetSummary from "./asset-summary";
import AssetsTable from "./assets-table";
import { Asset } from "@/db/schema";
import { useLatestPrices } from "@/hooks/useLatestPrices";
import { useMemo } from "react";
import { CalculatedAsset } from "./schemas";
import { formatDate } from "@/lib/utils";
import { AssetCompounding } from "./asset-compounding";

interface Props {
  initialPrices: LatestPrices;
  assets: Asset[];
}
export default function PortfolioAssets({ assets, initialPrices }: Props) {
  const { data: prices } = useLatestPrices({ initialData: initialPrices });

  const pricesWithoutGoldOunce = [
    ...prices.cryptocurrency,
    ...prices.gold,
    ...prices.currency,
  ].filter((item) => item.code !== "ounce");

  const calculatedAssets = useMemo(() => {
    return assets.map((item) => {
      const amount = Number(item.amount);
      const buyPrice = Number(item.buyPrice);
      const totalCost = amount * buyPrice;

      const currentPrice = [
        ...prices.cryptocurrency,
        ...prices.currency,
        ...prices.gold,
      ].find((p) => p.code === item.code)?.value;

      const totalMarketPrice = currentPrice && currentPrice * amount;
      const profitAndLoss = totalMarketPrice
        ? totalMarketPrice - totalCost
        : null;
      const profitAndLossPercentage = profitAndLoss
        ? (profitAndLoss / totalCost) * 100
        : null;

      return {
        ...item,
        amount: amount.toString(),
        buyPrice: buyPrice.toString(),
        totalCost,
        totalMarketPrice,
        profitAndLoss,
        profitAndLossPercentage,
        marketPrice: currentPrice,
      } satisfies CalculatedAsset;
    });
  }, [assets, prices]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-x-2 items-center flex-wrap justify-between">
        <span>Updated at {formatDate(prices.updatedAt)}</span>
        <span className="text-sm">
          All prices are in Iranian Toman (1 Toman = 10 Rials)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="flex flex-col gap-2 w-full">
          <AddAsset prices={pricesWithoutGoldOunce} />
          <AssetSummary
            calculatedAssets={calculatedAssets}
            usd={prices.currency.find((item) => item.code === "usd")?.value}
          />
        </div>
        <AssetCompounding calculatedAssets={calculatedAssets} />
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 h-full w-full">
          <AssetComposition calculatedAssets={calculatedAssets} />
        </div>
      </div>
      <AssetsTable
        calculatedAssets={calculatedAssets}
        prices={pricesWithoutGoldOunce}
      />
    </div>
  );
}
