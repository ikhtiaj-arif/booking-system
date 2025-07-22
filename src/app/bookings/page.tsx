import { getBookings } from "@/prisma-db";

interface Booking {
    id: string;
    resource: string;
    startTime: Date;
    endTime: Date;
    requestedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export default async function bookingsDB() {

    const bookingsData: Booking[] = await getBookings()
    console.log(bookingsData);
    return (
        <div>
            bookings
        </div>
    )
}