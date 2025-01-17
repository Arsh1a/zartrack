import { fetchLatest } from "@/lib/fetch-prices";

export const revalidate = 60;

export async function GET() {
  const data = await fetchLatest();

  if (!data) {
    throw new Error("Failed to get latest prices");
  }

  return Response.json({ ...data });
}
