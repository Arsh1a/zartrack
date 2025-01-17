import { fetchLatest } from "@/lib/fetch-prices";
import DisplayData from "./display-data";

export const revalidate = 45;

export default async function HomePage() {
  const data = await fetchLatest();

  if (!data) {
    throw new Error("Could not load prices");
  }

  return (
    <div>
      <DisplayData initialData={data} />
    </div>
  );
}
