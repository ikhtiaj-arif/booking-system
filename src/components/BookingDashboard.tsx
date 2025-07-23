
import { BookingWithStatus } from '@/lib/types';
import { addBookingStatus, groupByResource, sortBookingsByTime } from '@/lib/utils';
import { lazy, Suspense, useEffect, useState } from 'react';
// import BookingCard from './BookingCard';
import { BookingCardSkeleton } from './BookingsSkeleton';
import Filters from './Filters';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const BookingCard = lazy(() => import("./BookingCard"))
interface BookingDashboardProps {
    refreshTrigger: number
}


const BookingDashboard = ({ refreshTrigger }: BookingDashboardProps) => {

    const [bookings, setBookings] = useState<BookingWithStatus[]>([]);
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
            const bookingsWithStatus = data?.map(addBookingStatus)

            setBookings(sortBookingsByTime(bookingsWithStatus))

        } catch (err) {
            console.log(err);
        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTrigger, selectedResource, selectedDate]);

    const handleClearFilters = () => {
        setSelectedResource("all")
        setSelectedDate("")
    }



    const groupedBookings = groupByResource(bookings)

    if (loading) {
        return (<>
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
        </>
        )
    }
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
                                        <Suspense key={booking.id} fallback={<BookingCardSkeleton />}>
                                            <BookingCard booking={booking} fetchBookings={fetchBookings} />
                                        </Suspense>
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