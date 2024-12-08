import { fetchLatest } from "@/lib/bonbast";
import DisplayData from "./display-data";

export const revalidate = 45;

export default async function PricesPage() {
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
