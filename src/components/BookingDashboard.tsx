
import { Booking } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import BookingCard from './BookingCard';

interface BookingDashboardProps {
    bookings: Booking[]
}


const BookingDashboard = ({ bookings }: BookingDashboardProps) => {
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