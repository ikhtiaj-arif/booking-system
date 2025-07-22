"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Booking } from "@/lib/types"
import { formatDateTime } from "@/lib/utils"
import { Calendar, Clock, User } from "lucide-react"

interface BookingCardProps {
    booking: Booking
}

export default function BookingCard({ booking }: BookingCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{booking.resource}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(new Date(booking.startTime))}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                        {formatDateTime(new Date(booking.startTime))} - {formatDateTime(new Date(booking.endTime))}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{booking.requestedBy}</span>
                </div>
            </CardContent>
        </Card>
    )
}
