import { fetchLatest } from "@/lib/fetch-prices";
import { db } from "@/db";
import { asset } from "@/db/schema";
import { readSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import PortfolioAssets from "./assets";
import { unstable_cache } from "next/cache";
import { formatDate } from "@/lib/utils";

const cachedFetchLatest = unstable_cache(
  async () => await fetchLatest(),
  ["fetch-latest"],
  { revalidate: 59 }
);

export default async function PortfolioPage() {
  const prices = await cachedFetchLatest();
  const session = await readSession();

  if (!session) {
    throw new Error("Session not found");
  }

  const getAssets = unstable_cache(
    async () => {
      return await db
        .select()
        .from(asset)
        .where(eq(asset.userId, session.userId));
    },
    [`assets-${session.userId}`],
    { revalidate: 3600, tags: [`assets-${session.userId}`] }
  );

  const assets = await getAssets();

  if (!prices) {
    throw new Error("Could not load prices");
  }

  return (
    <PortfolioAssets
      assets={assets}
      initialPrices={prices}
      formattedDate={formatDate(prices.updatedAt)}
    />
  );
}
