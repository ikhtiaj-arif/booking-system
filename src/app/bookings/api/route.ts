import { getBookings } from "@/prisma-db";

export async function GET() {
  const data = await getBookings();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
