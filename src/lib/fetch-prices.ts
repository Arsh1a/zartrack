import { LatestPrices, RawThidPartyAPIResponse } from "@/types";
import { transformPrices } from "./transform-data";

const API_URL = `https://brsapi.ir/Api/Market/Gold_Currency.php?key=${process.env.BRSAPI_API_KEY}`;

export async function fetchLatest(): Promise<LatestPrices | null> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as RawThidPartyAPIResponse;
    const prices = transformPrices(data);
    return { ...prices, updatedAt: new Date().toISOString() };
  } catch (error) {
    console.error("Error fetching latest prices:", error);
    return null;
  }
}
