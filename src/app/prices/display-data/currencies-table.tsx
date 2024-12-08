import TriangleIcon from "@/components/icons/triangle";
import { cn } from "@/lib/utils";
import { Change, Pair } from "@/types";
interface Props {
  data: Pair[];
}

export default function CurrenciesTable({ data }: Props) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border-collapse border rounded-xl">
        <thead className="border-b">
          <tr className="uppercase text-left">
            <th className="px-3 py-2">Code</th>
            <th className="px-3 py-2">Sell</th>
            <th className="px-3 py-2">Buy</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <TableRow
              key={item.code}
              sell={item.sell}
              buy={item.buy}
              code={item.code}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ sell, buy, code }: Pair) {
  return (
    <tr className="text-sm border-b odd:bg-secondary">
      <td className="px-3 py-2 font-bold uppercase">{code}</td>
      <td className="px-3 py-2">
        <span className="flex items-center gap-[2px]">
          <Arrow change={sell.change} />
          {Number(sell.value).toLocaleString()}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="flex items-center gap-[2px]">
          <Arrow change={buy.change} />
          {Number(buy.value).toLocaleString()}
        </span>
      </td>
    </tr>
  );
}

function Arrow({ change }: { change: Change }) {
  return (
    <span
      className={cn(
        change === "increased" && "rotate-0",
        change === "decreased" && "rotate-180",
        change === "nochange" && "rotate-90"
      )}
    >
      <TriangleIcon
        size={12}
        className={cn(
          change === "increased" && "fill-green-500",
          change === "decreased" && "fill-red-500",
          change === "nochange" && "fill-blue-500"
        )}
      />
    </span>
  );
}
