
import { Booking } from '@/lib/types';
import { useEffect, useState } from 'react';
import BookingCard from './BookingCard';
import { Card, CardContent } from './ui/card';

interface BookingDashboardProps {
    refreshTrigger: number
}


const BookingDashboard = ({ refreshTrigger }: BookingDashboardProps) => {

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        const res = await fetch('/bookings/api'); // create this API route
        const data = await res.json();
        setBookings(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, [refreshTrigger]);

    return (
        <div>
            {bookings.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">No bookings found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {bookings.map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                    </CardContent>
                </div>
            )}
        </div>
    );
};

export default BookingDashboard;