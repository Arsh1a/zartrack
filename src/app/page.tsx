import { fetchLatest } from "@/lib/fetch-prices";
import DisplayData from "./display-data";
import { formatDate } from "@/lib/utils";

export const revalidate = 55;

export default async function HomePage() {
  const data = await fetchLatest();

  if (!data) {
    throw new Error("Could not load prices");
  }

  return (
    <div>
      <DisplayData
        initialData={data}
        formattedDate={formatDate(data.updatedAt)}
      />
    </div>
  );
}
