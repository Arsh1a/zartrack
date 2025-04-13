import { db } from "@/db";
import { asset } from "@/db/schema";
import { readSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import PortfolioAssets from "./assets";
import { unstable_cache } from "next/cache";
import { Metadata } from "next";
import { LatestPrices } from "@/types";
import axios from "axios";

export const metadata: Metadata = {
  title: "Portfolio | Zartrack",
  description:
    "Manage and monitor your asset portfolio with Zartrack. View real-time values, profit and loss percentages, and asset composition in an intuitive dashboard.",
};

export default async function PortfolioPage() {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/latest`
  );
  const prices = data.data as LatestPrices;

  if (!prices) {
    throw new Error("Could not load prices");
  }
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

  return <PortfolioAssets assets={assets} initialPrices={prices} />;
}
