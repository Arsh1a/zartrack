import { sortByCodes } from "@/lib/transform-data";
import { Bubble, Single } from "@/types";
import GoldsTable from "./golds-table";
import { coinsBubbles } from "@/lib/calculate";

interface Props {
  data: Single[];
}

export default function Golds({ data }: Props) {
  const coinCodes = [
    "IR_COIN_EMAMI",
    "IR_COIN_BAHAR",
    "IR_COIN_1G",
    "IR_COIN_HALF",
    "IR_COIN_QUARTER",
  ];
  const goldCodes = ["XAUUSD", "IR_GOLD_MELTED", "IR_GOLD_18K", "IR_GOLD_24K"];

  const IR_GOLD_18K = data.find((item) => item.code === "IR_GOLD_18K");
  const coins = sortByCodes(
    data.filter((item) => coinCodes.includes(item.code)),
    ["IR_COIN_EMAMI"]
  );

  const bubbles = coinCodes.reduce((result, code) => {
    const value = data.find((item) => item.code === code)?.value ?? 0;

    result[code] = IR_GOLD_18K
      ? coinsBubbles(IR_GOLD_18K.value, { [code]: value })[code]
      : { value, percentage: 0 };
    return result;
  }, {} as Record<string, Bubble>);

  const rawGolds = data.filter((item) => goldCodes.includes(item.code));

  return (
    <div className="flex gap-5 flex-col md:flex-row items-start">
      <GoldsTable data={coins} bubbles={bubbles} />
      <GoldsTable data={rawGolds} bubbles={bubbles} />
    </div>
  );
}
