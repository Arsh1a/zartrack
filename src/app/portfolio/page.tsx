import { fetchLatest } from "@/lib/bonbast";

export const revalidate = 45;

export default async function PortfolioPage() {
  const data = await fetchLatest();

  if (!data) {
    throw new Error("Could not load prices");
  }

  return <div>asdsa</div>;
}
