"use client";

import { ColumnDef } from "@tanstack/react-table";
import DisplayAsset from "@/components/display-asset";
import { Bubble, Single } from "@/types";
import Price from "../price";

const goldsTableColumn: ColumnDef<Single & { bubble: Bubble | undefined }>[] = [
  {
    accessorKey: "code",
    header: "Name",
    cell: ({ row }) => {
      const code = row.original.code;
      return (
        <div className="w-44">
          <DisplayAsset code={code} showCode={false} />
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Price",
    cell: ({ row }) => {
      return <Price value={row.original.value} />;
    },
  },
  {
    accessorKey: "bubble",
    header: "Bubble",
    cell: ({ row }) => {
      return row.original.bubble ? (
        <div className="flex flex-col">
          <span>{Math.ceil(row.original.bubble.value).toLocaleString()}</span>
          <span className="text-xs">
            {row.original.bubble.percentage.toFixed(2)}%
          </span>
        </div>
      ) : (
        "-"
      );
    },
  },
];

export default goldsTableColumn;
