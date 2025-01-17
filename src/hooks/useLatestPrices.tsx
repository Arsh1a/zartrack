"use client";
import { LatestPrices } from "@/types";
import { useState, useEffect } from "react";

interface Props {
  initialData: LatestPrices;
  interval?: number;
  endpoint?: string;
}

export function useLatestPrices({
  initialData,
  interval = 45000,
  endpoint = "/api/latest",
}: Props) {
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
        setData(() => newData);
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
