import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatedAsset } from "./schemas";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  usd: number | undefined;
  calculatedAssets: CalculatedAsset[];
}

export default function AssetSummary({ calculatedAssets, usd }: Props) {
  const [tab, setTab] = useState<"irt" | "usd">("irt");
  const totalValue = calculatedAssets.reduce(
    (sum, item) => sum + (item.totalMarketPrice ?? 0),
    0
  );
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-base flex gap-2 justify-between">
          <span>Total value of assets</span>
          <div className="flex gap-1">
            <Button
              onClick={() => setTab("irt")}
              variant="outline"
              disabled={tab === "irt"}
              className="p-2 h-8 rounded-xl"
            >
              IRT
            </Button>
            <Button
              onClick={() => setTab("usd")}
              disabled={tab === "usd"}
              variant="outline"
              className="p-2 h-8 rounded-xl"
            >
              USD
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 text-xl">
        {tab === "irt" && <TotalValue totalValue={totalValue} />}
        {tab === "usd" && <TotalValue totalValue={totalValue / (usd ?? 1)} />}
      </CardContent>
    </Card>
  );
}

function TotalValue({ totalValue }: { totalValue: number }) {
  return (
    <div className="flex gap-1 items-center text-success font-semibold">
      <Wallet />
      <p>{Math.round(totalValue).toLocaleString()}</p>
    </div>
  );
}
