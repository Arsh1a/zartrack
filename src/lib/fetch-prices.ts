import { LatestPrices, RawThidPartyAPIResponse } from "@/types";
import { transformPrices } from "./transform-data";
import { request } from "undici";

const API_URL = `https://brsapi.ir/Api/Market/Gold_Currency.php?key=${process.env.BRSAPI_API_KEY}`;

export async function fetchLatest(): Promise<LatestPrices | null> {
  try {
    const { body } = await request(API_URL, {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      dispatcher: new (require("undici").Agent)({
        connect: {
          rejectUnauthorized: false, // WARNING: disables SSL check
        },
      }),
    });

    const raw = await body.json();
    const data = raw as RawThidPartyAPIResponse;
    const prices = transformPrices(data);
    return { ...prices, updatedAt: new Date().toISOString() };
  } catch (error) {
    console.error("Error fetching latest prices:", error);
    return null;
  }
}
