import { DataTable } from "@/components/ui/data-table";
import { Bubble, Single } from "@/types";
import currenciesTableColumn from "./golds-table-column";

interface Props {
  data: Single[];
  bubbles: Record<string, Bubble>;
}

export default function GoldsTable({ data, bubbles }: Props) {
  const calculatedData = data.map((item) => ({
    ...item,
    bubble: bubbles[item.code] ? bubbles[item.code] : undefined,
  }));
  return <DataTable columns={currenciesTableColumn} data={calculatedData} />;
}
