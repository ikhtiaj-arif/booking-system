export interface Booking {
  id: string;
  resource: string;
  startTime: Date;
  endTime: Date;
  requestedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingFormData {
  resource: string;
  startTime: string;
  endTime: string;
  requestedBy: string;
}

export const RESOURCES = [
  "Conference Room A",
  "Conference Room B",
  "Projector",
  "Laptop Cart",
  "Recording Studio",
];
