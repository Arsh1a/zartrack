import { Button } from "@/components/ui/button";
import { CalculatedAsset } from "./schemas";
import { exportToCSV } from "@/lib/utils";
import { Download } from "lucide-react";

interface Props {
  calculatedAssets: CalculatedAsset[];
}

export default function ExportAssetData({ calculatedAssets }: Props) {
  const dataForCSV = calculatedAssets.map((item) => {
    return {
      code: item.code,
      amount: item.amount,
      buyPrice: item.buyPrice,
      totalCost: item.totalCost,
      totalMarketPrice: item.totalMarketPrice,
      profitAndLoss: item.profitAndLoss,
      profitAndLossPercentage: item.profitAndLossPercentage,
      marketPrice: item.marketPrice,
    };
  });

  return (
    <Button onClick={() => exportToCSV(dataForCSV)} variant="outline">
      <Download />
      Export as CSV
    </Button>
  );
}
