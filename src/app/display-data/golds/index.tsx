import { sortByCodes } from "@/lib/transform-data";
import { Bubble, Single } from "@/types";
import GoldsTable from "./golds-table";
import { coinsBubbles } from "@/lib/calculate";

interface Props {
  data: Single[];
}

export default function Golds({ data }: Props) {
  const coinCodes = ["emami", "azadi", "gerami", "azadi_half", "azadi_quarter"];
  const goldCodes = ["ounce", "mesghal", "gold18", "gold24"];

  const gold18 = data.find((item) => item.code === "gold18");
  const coins = sortByCodes(
    data.filter((item) => coinCodes.includes(item.code)),
    ["emami"]
  );

  const bubbles = coinCodes.reduce((result, code) => {
    const value = data.find((item) => item.code === code)?.value ?? 0;
    result[code] = gold18
      ? coinsBubbles(gold18.value, { [code]: value })[code]
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
