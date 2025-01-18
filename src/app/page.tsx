import { fetchLatest } from "@/lib/fetch-prices";
import DisplayData from "./display-data";
import { unstable_cache } from "next/cache";

const cachedFetchLatest = unstable_cache(
  async () => await fetchLatest(),
  ["fetch-latest"],
  { revalidate: 59 }
);

export const revalidate = 45;

export default async function HomePage() {
  const data = await cachedFetchLatest();

  if (!data) {
    throw new Error("Could not load prices");
  }

  return (
    <div>
      <DisplayData initialData={data} />
    </div>
  );
}
