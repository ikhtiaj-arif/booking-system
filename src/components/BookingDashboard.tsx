
import { Booking } from '@/lib/types';
import { useEffect, useState } from 'react';
import BookingCard from './BookingCard';
import Filters from './Filters';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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



    function groupByResource(bookings: Booking[]) {
        const grouped: Record<string, Booking[]> = {}

        for (const booking of bookings) {
            const resource = booking.resource

            if (!grouped[resource]) {
                grouped[resource] = []
            }

            grouped[resource].push(booking);

        }
        return grouped

    }
    const groupedBookings = groupByResource(bookings)
    console.log("bookings", groupedBookings);

    if (loading)
        return (<div>Loading..</div>)
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
                    {Object.entries(groupedBookings).map(([resource, resourceBookings]) => (
                        <Card key={resource}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {resource}
                                    <span className="text-sm font-normal text-gray-500">
                                        {resourceBookings.length} booking{resourceBookings.length !== 1 ? "s" : ""}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {resourceBookings.map((booking) => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingDashboard;