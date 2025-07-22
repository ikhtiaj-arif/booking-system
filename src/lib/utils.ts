import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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


export function validateBookingTime(startTime: string, endTime: string): string | null {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const now = new Date()

  if (start <= now) {
    return "Start time must be in the future!"
  }

  if (end <= start) {
    return "End time must be after start time!"
  }

  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
  if (durationMinutes < 15) {
    return "Booking duration must be at least 15 minutes"
  }

  if (durationMinutes > 120) {
    return "Booking duration cannot exceed 2 hours"
  }

  return null
}
