import { LatestPrices, Pair, Single } from "@/types";
import { useState, useEffect } from "react";

const getChangeStatus = (newValue: string, oldValue?: string) => {
  if (!oldValue) return "nochange";
  if (newValue > oldValue) return "increased";
  if (newValue < oldValue) return "decreased";
  return "nochange";
};

const updatePairChange = (newPairs: Pair[], oldPairs: Pair[]): Pair[] => {
  return newPairs.map((newItem) => {
    const currentItem = oldPairs.find((item) => item.code === newItem.code);
    const sellChange = getChangeStatus(newItem.sell.value, currentItem?.sell.value);
    const buyChange = getChangeStatus(newItem.buy.value, currentItem?.buy.value);
    return {
      ...newItem,
      sell: { change: sellChange, value: newItem.sell.value },
      buy: { change: buyChange, value: newItem.buy.value },
    };
  });
};

const updateSingleChange = (newSingle: Single, currentSingle?: Single): Single => {
  const change = getChangeStatus(newSingle.value, currentSingle?.value);
  return { ...newSingle, change };
};

const updateGoldsChange = (newGolds: Single[], oldGolds: Single[]): Single[] => {
  return newGolds.map((newItem) => {
    const currentItem = oldGolds.find((item) => item.code === newItem.code);
    return updateSingleChange(newItem, currentItem);
  });
};

interface UseLatestPricesOptions {
  initialData: LatestPrices;
  interval?: number;
  endpoint?: string;
}

export function useLatestPrices({ 
  initialData, 
  interval = 45000, 
  endpoint = '/api/latest' 
}: UseLatestPricesOptions) {
  const [data, setData] = useState<LatestPrices>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLatestData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to get latest prices");
        
        const newData: LatestPrices = await response.json();
        setData((prev) => ({
          ...newData,
          currencies: updatePairChange(newData.currencies, prev.currencies),
          golds: updateGoldsChange(newData.golds, prev.golds),
        }));
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(fetchLatestData, interval);
    return () => clearInterval(intervalId);
  }, [interval, endpoint]);

  return { data, error, isLoading };
} 