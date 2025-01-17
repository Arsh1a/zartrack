import { sortByCodes } from "@/lib/transform-data";
import { Single } from "@/types";
import CurrenciesTable from "./currencies-table";

interface Props {
  data: Single[];
}

export default function Currencies({ data }: Props) {
  const sortedData = sortByCodes(data, [
    "USD",
    "EUR",
    "GBP",
    "CHF",
    "AUD",
    "RUB",
    "TRY",
    "AZN",
    "IRQ",
    "AFN",
    "GEL",
  ]);
  const midpoint = Math.ceil(sortedData.length / 2);
  const leftData = sortedData.slice(0, midpoint);
  const rightData = sortedData.slice(midpoint);

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <CurrenciesTable data={leftData.slice(0, -1)} />
      <CurrenciesTable data={rightData.slice(0, -1)} />
    </div>
  );
}
