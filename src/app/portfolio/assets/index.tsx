"use client";
import { LatestPrices } from "@/types";
import AddAsset from "./add-asset";
import AssetList from "./asset-list";
import { useEffect, useState } from "react";
import z from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { useLatestPrices } from "@/hooks/useLatestPrices";

interface Props {
  initialData: LatestPrices;
}

export const AssetSchema = z.object({
  id: z.string(),
  code: z.string(),
  amount: z.number(),
  unitBuyPrice: z.number(),
  date: z.date(),
});

export type Asset = z.infer<typeof AssetSchema>;

export const AssetsSchema = z.array(AssetSchema);

export type Assets = z.infer<typeof AssetsSchema>;

export default function Assets({ initialData }: Props) {
  const [assets, setAssets] = useState<Assets>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useLatestPrices({ initialData });

  const handleAddAssets = (data: Assets) => {
    const newAssets = [...assets, ...data];
    setAssets(newAssets);
    localStorage.setItem("assets", JSON.stringify(newAssets));
  };

  const handleRemoveAsset = (id: string) => {
    const newAssets = assets.filter((item) => item.id !== id);
    setAssets(newAssets);
    localStorage.setItem("assets", JSON.stringify(newAssets));
  };

  useEffect(() => {
    const savedAssets = localStorage.getItem("assets");
    if (savedAssets) {
      setAssets(JSON.parse(savedAssets));
    }
    setIsLoading(false);
  }, []);

  console.log(data);
  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="p-3 bg-destructive text-destructive-foreground">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1>Portfolio</h1>
          <p className="text-xs">
            All prices are in Iranian Toman (1 Toman = 10 Rials)
          </p>
        </div>
        <AddAsset
          coins={data.coins}
          cryptos={data.cryptos}
          currencies={data.currencies}
          add={handleAddAssets}
        />
      </div>
      {isLoading ? (
        <Skeleton className="h-[50vh] w-full" />
      ) : (
        <AssetList
          assets={assets}
          data={[...data.currencies, ...data.coins]}
          remove={handleRemoveAsset}
        />
      )}
    </div>
  );
}
