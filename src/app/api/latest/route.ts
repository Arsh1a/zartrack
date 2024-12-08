import { fetchLatest } from "@/lib/bonbast";

export const revalidate = 45;

export async function GET() {
  const data = await fetchLatest();

  if (!data) {
    throw new Error("Failed to get latest prices");
  }

  return Response.json({ ...data });
}
