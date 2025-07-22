
import { Booking, RESOURCES } from '@/lib/types';
import { useEffect, useState } from 'react';
import BookingCard from './BookingCard';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Filters from './Filters';

interface BookingDashboardProps {
    refreshTrigger: number
}


const BookingDashboard = ({ refreshTrigger }: BookingDashboardProps) => {

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    // api query states
    const [selectedResource, setSelectedResource] = useState("all")
    const [selectedDate, setSelectedDate] = useState("")

    const fetchBookings = async () => {
        try {
            setLoading(true);
            //filter queries
            const params = new URLSearchParams()
            if (selectedResource && selectedResource !== "all") params.append("resource", selectedResource)
            if (selectedDate) params.append("date", selectedDate)


            const res = await fetch(`/api/bookings?${params}`);
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.log(err);
        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [refreshTrigger, selectedResource, selectedDate]);



    const handleClearFilters = () => {
        setSelectedResource("all")
        setSelectedDate("")
    }



    if (loading)
        return (
            <div>Loading..</div>
        )

    return (
        <div>
            {/* filters */}
            <Filters
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedResource={selectedResource}
                setSelectedResource={setSelectedResource}
                handleClearFilters={handleClearFilters}
            />

            {/* component start */}
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