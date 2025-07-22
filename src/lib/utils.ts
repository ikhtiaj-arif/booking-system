import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Booking, BookingWithStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function validateBookingTime(
  startTime: string,
  endTime: string
): string | null {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (start <= now) {
    return "Start time must be in the future!";
  }

  if (end <= start) {
    return "End time must be after start time!";
  }

  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  if (durationMinutes < 15) {
    return "Booking duration must be at least 15 minutes";
  }

  if (durationMinutes > 120) {
    return "Booking duration cannot exceed 2 hours";
  }

  return null;
}

export function groupByResource(bookings: BookingWithStatus[]): Record<string, BookingWithStatus[]> {
  const grouped: Record<string, BookingWithStatus[]> = {};

  for (const booking of bookings) {
    const resource = booking.resource;

    if (!grouped[resource]) {
      grouped[resource] = [];
    }

    grouped[resource].push(booking);
  }
  return grouped;
}

export function getBookingStatus(
  booking: Booking
): "upcoming" | "ongoing" | "past" {
  const now = new Date();
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  if (now < startTime) return "upcoming";
  if (now >= startTime && now <= endTime) return "ongoing";
  return "past";
}

export function addBookingStatus(booking: Booking): BookingWithStatus {
  return {
    ...booking,
    status: getBookingStatus(booking),
  };
}

export function sortBookingsByTime(
  bookings: BookingWithStatus[]
): BookingWithStatus[] {
  return bookings.sort((a, b) => {
    // Sort by status priority ongoing -> upcoming -> past
    const statusPriority = { ongoing: 0, upcoming: 1, past: 2 };
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];

    if (statusDiff !== 0) return statusDiff;

    // Then sort by start time
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
}
