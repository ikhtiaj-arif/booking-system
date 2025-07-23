/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// const addBookings = async () => {
//   const bookingsCount = await prisma.booking.count();

//   if (bookingsCount == 0) {
//     await prisma.booking.createMany({
//       data: [
//         {
//           resource: "Meeting Room A",
//           startTime: new Date("2025-07-23T10:00:00Z"),
//           endTime: new Date("2025-07-23T11:00:00Z"),
//           requestedBy: "john.doe@example.com",
//         },
//         {
//           resource: "Meeting Room B",
//           startTime: new Date("2025-07-23T12:00:00Z"),
//           endTime: new Date("2025-07-23T13:30:00Z"),
//           requestedBy: "jane.smith@example.com",
//         },
//         {
//           resource: "Conference Room B",
//           startTime: new Date("2025-07-24T09:00:00Z"),
//           endTime: new Date("2025-07-24T10:00:00Z"),
//           requestedBy: "alex.lee@example.com",
//         },
//       ],
//     });
//   }
// };

// addBookings();

export async function getBookings(searchQuery: any = {}) {
  return await prisma.booking.findMany({
    where: searchQuery,
    orderBy: {
      startTime: "asc",
    },
  });
}

export async function getBooking(id: string) {
  return await prisma.booking.findUniqueOrThrow({
    where: { id },
  });
}

export async function addBooking(
  resource: string,
  startTime: Date,
  endTime: Date,
  requestedBy: string
) {
  // 1. find existing bookings by resource
  // 2. convert the start and end date time and remove 10 min from the start time, add 10 min after end time to get the extended buffer time
  // 3. Use array.some to find the first conflict, as some returns true and stops the loop when the condition matches
  // 4. compare the current start time and end time with the buffered time to find conflicts

  const bufferMinutes = 10;
  const bufferMs = bufferMinutes * 60 * 1000;

  const existingBookings = await prisma.booking.findMany({
    where: { resource },
  });

  const hasConflict = existingBookings.some((booking) => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);

    const bufferedStart = new Date(bookingStart.getTime() - bufferMs);
    const bufferedEnd = new Date(bookingEnd.getTime() + bufferMs);

    return startTime < bufferedEnd && endTime > bufferedStart;
  });

  if (hasConflict) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Your requested slot overlaps with an existing booking or its 10-minute buffer. Please try a different time.",
      },
      { status: 409 }
    );
  }

  await prisma.booking.create({
    data: { resource, startTime, endTime, requestedBy },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Booking created successfully!",
    },
    { status: 200 }
  );
}

export async function deleteBooking(id: string) {
  return await prisma.booking.delete({
    where: { id },
  });
}
