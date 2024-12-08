import { sortByNames } from "@/lib/transform-data";
import { Pair } from "@/types";
import CurrenciesTable from "./currencies-table";

interface Props {
  data: Pair[];
}

export default function Currencies({ data }: Props) {
  const sortedData = sortByNames(data, [
    "USD",
    "EUR",
    "GBP",
    "CHF",
    "AUD",
    "RUB",
    "TRY",
    "AZN",
  ]);
  const midpoint = Math.ceil(sortedData.length / 2);
  const leftData = sortedData.slice(0, midpoint);
  const rightData = sortedData.slice(midpoint);

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <CurrenciesTable data={leftData} />
      <CurrenciesTable data={rightData} />
    </div>
  );
}
