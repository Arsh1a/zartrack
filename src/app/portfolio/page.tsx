import { fetchLatest } from "@/lib/fetch-prices";
import { db } from "@/db";
import { asset } from "@/db/schema";
import { readSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import PortfolioAssets from "./assets";

export default async function PortfolioPage() {
  const prices = await fetchLatest();
  const session = await readSession();

  if (!session) {
    throw new Error("Session not found");
  }

  const assets = await db
    .select()
    .from(asset)
    .where(eq(asset.userId, session.userId));

  if (!prices) {
    throw new Error("Could not load prices");
  }

  return <PortfolioAssets assets={assets} initialPrices={prices} />;
}
