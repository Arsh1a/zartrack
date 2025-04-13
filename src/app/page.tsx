import DisplayData from "./display-data";
import axios from "axios";
import { LatestPrices } from "@/types";

export const revalidate = 110;

export default async function HomePage() {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/latest`
  );
  const prices = data.data as LatestPrices;
  if (!prices) {
    throw new Error("Could not load prices");
  }

  return (
    <div>
      <DisplayData initialData={prices} />
    </div>
  );
}
