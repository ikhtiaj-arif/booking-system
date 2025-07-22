/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookingFormData } from "@/lib/types";
import { addBooking, getBookings } from "@/prisma-db";
import { NextRequest, NextResponse } from "next/server";

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
