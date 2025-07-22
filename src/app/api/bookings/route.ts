import { BookingFormData } from "@/lib/types";
import { addBooking, getBookings } from "@/prisma-db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: BookingFormData = await request.json();

  const { resource, startTime, endTime, requestedBy } = body;

  // Validate required fields
  if (!resource || !startTime || !endTime || !requestedBy) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const newBooking = await addBooking(
    resource,
    new Date(startTime),
    new Date(endTime),
    requestedBy
  );

  return new Response(JSON.stringify(newBooking), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET() {
  const data = await getBookings();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
