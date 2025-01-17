"use client";

import { ColumnDef } from "@tanstack/react-table";
import DisplayAsset from "@/components/display-asset";
import { Single } from "@/types";
import Price from "../price";

const currenciesTableColumn: ColumnDef<Single>[] = [
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
];

export default currenciesTableColumn;
