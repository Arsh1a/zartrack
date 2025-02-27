"use client";
import { LatestPrices } from "@/types";
import Currencies from "./currencies";
import { useLatestPrices } from "@/hooks/useLatestPrices";
import { formatDate } from "@/lib/utils";
import Golds from "./golds";

interface Props {
  initialData: LatestPrices;
}

export default function DisplayData({ initialData }: Props) {
  const { data, error } = useLatestPrices({ initialData });

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="p-3 bg-destructive text-destructive-foreground">
          {error}
        </div>
      )}
      <div className="flex gap-x-2 items-center flex-wrap justify-between">
        <span>Updated at {formatDate(data.updatedAt)}</span>
        <span className="text-sm">
          All prices are in Iranian Toman (1 Toman = 10 Rials)
        </span>
      </div>
      <div className="flex flex-col gap-5">
        <Currencies data={data.currency} />
        <Golds data={data.gold} />
      </div>
    </div>
  );
}
