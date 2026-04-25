'use client'

import { BookingWithStatus } from '@/lib/types';
import { addBookingStatus, groupByResource, sortBookingsByTime } from '@/lib/utils';
import { CalendarX, Layers } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BookingCardSkeleton, BookingGroupSkeleton } from './BookingsSkeleton';
import Filters from './Filters';

const BookingCard = lazy(() => import("./BookingCard"))

interface BookingDashboardProps {
  refreshTrigger: number
}

const RESOURCE_COLORS: Record<string, string> = {
  "Conference Room A": "from-fuchsia-500 to-purple-500",
  "Conference Room B": "from-purple-500 to-indigo-500",
  "Projector": "from-indigo-500 to-blue-500",
  "Laptop Cart": "from-cyan-500 to-teal-500",
  "Recording Studio": "from-rose-500 to-pink-500",
}

const BookingDashboard = ({ refreshTrigger }: BookingDashboardProps) => {
  const [bookings, setBookings] = useState<BookingWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")

  const fetchBookings = async () => {
    try {
      setLoading(true);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Filters
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedResource={selectedResource}
          setSelectedResource={setSelectedResource}
          handleClearFilters={handleClearFilters}
        />
        <BookingGroupSkeleton />
        <BookingGroupSkeleton />
      </div>
    )
  }

  // Stats
  const ongoingCount = bookings.filter(b => b.status === "ongoing").length
  const upcomingCount = bookings.filter(b => b.status === "upcoming").length
  const pastCount = bookings.filter(b => b.status === "past").length
  const groupedBookings = groupByResource(bookings)

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: bookings.length, color: "text-slate-300", bg: "bg-white/[0.04]", border: "border-white/[0.07]" },
          { label: "Ongoing", value: ongoingCount, color: "text-emerald-400", bg: "bg-emerald-500/[0.08]", border: "border-emerald-500/20" },
          { label: "Upcoming", value: upcomingCount, color: "text-violet-400", bg: "bg-violet-500/[0.08]", border: "border-violet-500/20" },
          { label: "Past", value: pastCount, color: "text-slate-500", bg: "bg-white/[0.02]", border: "border-white/[0.05]" },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl ${stat.bg} border ${stat.border} px-4 py-3`}>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Filters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
        handleClearFilters={handleClearFilters}
      />

      {/* Bookings */}
      {bookings.length === 0 ? (
        <div className="glass rounded-2xl border border-white/[0.06] py-20 flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20">
            <CalendarX className="w-10 h-10 text-fuchsia-400" />
          </div>
          <div>
            <p className="text-slate-300 font-semibold text-lg">No bookings found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting the filters or create a new booking.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBookings).map(([resource, resourceBookings]) => {
            const gradientClass = RESOURCE_COLORS[resource] ?? "from-purple-500 to-indigo-500"
            return (
              <div key={resource} className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
                {/* Group header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientClass} opacity-90`}>
                      <Layers className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-slate-100">{resource}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-white/[0.05] border border-white/[0.07] rounded-full px-3 py-1">
                    {resourceBookings.length} booking{resourceBookings.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Cards grid */}
                <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resourceBookings.map((booking) => (
                    <Suspense key={booking.id} fallback={<BookingCardSkeleton />}>
                      <BookingCard booking={booking} fetchBookings={fetchBookings} />
                    </Suspense>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default BookingDashboard;