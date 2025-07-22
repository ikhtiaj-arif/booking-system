/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addBookings = async () => {
  const bookingsCount = await prisma.booking.count();

  if (bookingsCount == 0) {
    await prisma.booking.createMany({
      data: [
        {
          resource: "Meeting Room A",
          startTime: new Date("2025-07-23T10:00:00Z"),
          endTime: new Date("2025-07-23T11:00:00Z"),
          requestedBy: "john.doe@example.com",
        },
        {
          resource: "Meeting Room B",
          startTime: new Date("2025-07-23T12:00:00Z"),
          endTime: new Date("2025-07-23T13:30:00Z"),
          requestedBy: "jane.smith@example.com",
        },
        {
          resource: "Conference Room B",
          startTime: new Date("2025-07-24T09:00:00Z"),
          endTime: new Date("2025-07-24T10:00:00Z"),
          requestedBy: "alex.lee@example.com",
        },
      ],
    });
  }
};

addBookings();

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

export const addBooking = async (
  resource: string,
  startTime: Date,
  endTime: Date,
  requestedBy: string
) => {
  return await prisma.booking.create({
    data: {
      resource,
      startTime,
      endTime,
      requestedBy,
    },
  });
};
