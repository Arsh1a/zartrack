import { DataTable } from "@/components/ui/data-table";
import { Single } from "@/types";
import currenciesTableColumn from "./currencies-table-column";

interface Props {
  data: Single[];
}

export default function CurrenciesTable({ data }: Props) {
  return <DataTable columns={currenciesTableColumn} data={data} />;
}
