import BookingDashboard from "@/components/BookingDashboard";
import { getBookings } from "@/prisma-db";
import { Booking } from "@prisma/client";



export default async function bookingsDB() {

    const bookingsData: Booking[] = await getBookings()
    console.log(bookingsData);
    return (
        <div>
            <BookingDashboard bookings={bookingsData} />
        </div>
    )
}