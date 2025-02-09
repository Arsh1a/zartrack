"use client";

import { useOptimistic, useTransition } from "react";
import { deleteAsset } from "./actions";
import assetsTableColumn from "./assets-table-column";
import { DataTable } from "@/components/ui/data-table";
import { CalculatedAsset } from "./schemas";
import { Single } from "@/types";
import ExportAssetData from "./export-asset-data";

interface Props {
  calculatedAssets: CalculatedAsset[];
  prices: Single[];
}

export default function AssetsTable({ calculatedAssets, prices }: Props) {
  const [, startTransition] = useTransition();
  const [optimisticAssets, removeOptimisticAsset] = useOptimistic<
    CalculatedAsset[],
    string
  >(calculatedAssets, (state, id) => [...state.filter((d) => d.id !== id)]);

  async function handleRemove(id: string) {
    removeOptimisticAsset(id);
    await deleteAsset(id);
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <DataTable
        columns={assetsTableColumn(
          (id) => startTransition(() => handleRemove(id)),
          prices
        )}
        data={optimisticAssets}
      />
      <ExportAssetData calculatedAssets={calculatedAssets} />
    </div>
  );
}
