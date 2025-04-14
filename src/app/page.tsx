export const dynamic = "force-dynamic";

import DisplayData from "./display-data";
import { LatestPrices } from "@/types";

export default async function HomePage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/latest`
  );
  const prices = (await response.json()) as LatestPrices;
  if (!prices) {
    throw new Error("Could not load prices");
  }

  return (
    <div>
      <DisplayData initialData={prices} />
    </div>
  );
}
