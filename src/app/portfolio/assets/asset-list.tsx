import { useEffect, useMemo, useRef, useState } from "react";
import { Pair } from "@/types";
import { Assets } from ".";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  assets: Assets;
  data: Pair[];
  remove: (id: string) => void;
}

export default function AssetList({ assets, data, remove }: Props) {
  const priceMap = useMemo(
    () => new Map(data.map((d) => [d.code, Number(d.sell.value || 0)])),
    [data]
  );

  console.log(priceMap);

  const calculatedAssets = useMemo(
    () =>
      assets.map((item) => {
        const buyPrice = item.amount * item.unitBuyPrice;
        const todayPrice = item.amount * (priceMap.get(item.code) || 0);
        const profitAndLoss = todayPrice - buyPrice;
        const profitAndLossPercentage = (
          (profitAndLoss / buyPrice) *
          100
        ).toFixed(2);

        return {
          ...item,
          buyPrice,
          todayPrice,
          profitAndLoss,
          profitAndLossPercentage,
        };
      }),
    [assets, priceMap]
  );

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border-collapse border rounded-xl">
        <thead className="border-b">
          <tr className="uppercase text-left">
            <th className="px-3 py-2">Code</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Buy price</th>
            <th className="px-3 py-2">Today price</th>
            <th className="px-3 py-2">P&L</th>
            <th className="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {calculatedAssets.map((item) => (
            <tr className="text-sm border-b odd:bg-secondary" key={item.id}>
              <td className="px-3 py-2 font-bold uppercase">{item.code}</td>
              <td className="px-3 py-2 font-bold uppercase">{item.amount}</td>
              <td className="px-3 py-2 font-bold uppercase">
                {item.buyPrice.toLocaleString()}
              </td>
              <td className="px-3 py-2 font-bold uppercase">
                {item.todayPrice.toLocaleString()}
              </td>
              <td
                className={cn(
                  "px-3 py-2 font-bold uppercase",
                  item.profitAndLoss < 0 && "text-red-600",
                  item.profitAndLoss > 0 && "text-green-600"
                )}
              >
                <div className="relative">
                  <span className="text-xs absolute -top-3">
                    {item.profitAndLoss > 0 && "+"}
                    {item.profitAndLossPercentage}%
                  </span>
                  <span>
                    {item.profitAndLoss > 0 && "+"}
                    {item.profitAndLoss.toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="px-3 py-2 font-bold uppercase flex items-center justify-center">
                <RemoveButton onRemove={() => remove(item.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RemoveButton({ onRemove }: { onRemove: () => void }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isConfirming && !buttonRef.current?.contains(event.target as Node)) {
        setIsConfirming(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isConfirming]);

  const handleClick = () => {
    if (isConfirming) {
      onRemove();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  };

  return (
    <Popover open={isConfirming}>
      <PopoverTrigger asChild>
        <Button
          variant="destructive"
          className="p-3"
          onClick={handleClick}
          ref={buttonRef}
        >
          <Trash />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <p className="text-sm">Click again to remove</p>
      </PopoverContent>
    </Popover>
  );
}
