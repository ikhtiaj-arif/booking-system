/* eslint-disable @typescript-eslint/no-explicit-any */
import { addBooking, deleteBooking, getBookings } from "@/prisma-db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { resource, startTime, endTime, requestedBy } = body;

  if (!resource || !startTime || !endTime || !requestedBy) {
    return Response.json(
      { success: false, message: "All fields are required." },
      { status: 400 }
    );
  }

  return await addBooking(
    resource,
    new Date(startTime),
    new Date(endTime),
    requestedBy
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");
  const date = searchParams.get("date");

  // 1. create a search query variable
  // 2. check if resource is present and not equal to all, then add resource equal to resource value
  const searchQuery: any = {};
  if (resource && resource !== "all") {
    searchQuery.resource = resource;
  }

  if (date) {
    // 1. convert the value into date
    // 2. set the date start to 12:00am of that date
    // 3. set the date end to 11:59pm of that date
    //4. assign the start time and end time on the searchQuery with gte lte

    const selectedDate = new Date(date);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    searchQuery.startTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  const data = await getBookings(searchQuery);

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    await deleteBooking(id);

    return NextResponse.json(
      { message: "Booking deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the booking.",
      },
      { status: 500 }
    );
  }
}
