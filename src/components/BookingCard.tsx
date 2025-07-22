"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingWithStatus } from "@/lib/types"
import { formatDateTime } from "@/lib/utils"
import { Calendar, Clock, Trash2, User } from "lucide-react"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

interface BookingCardProps {
    booking: BookingWithStatus
    fetchBookings: () => void
}

export default function BookingCard({ booking, fetchBookings }: BookingCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const canDelete = booking.status === "upcoming"

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ongoing":
                return "bg-green-500"
            case "upcoming":
                return "bg-blue-500"
            case "past":
                return "bg-gray-500"
            default:
                return "bg-gray-500"
        }
    }


    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/bookings?id=${booking.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete booking")
            }

            fetchBookings()
        } catch (error) {
            console.error("Error deleting booking:", error)
            // You can add a toast here if desired
        } finally {
            setIsDeleting(false)
            setShowConfirm(false)
        }
    }
    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{booking.resource}</CardTitle>
                    <Badge className={`${getStatusColor(booking.status)} text-white`}>
                        {(booking.status).toUpperCase()}
                    </Badge>
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

                {canDelete && (
                    <div className="pt-2">
                        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="w-1/2">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Cancel Booking
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. Are you sure you want to cancel this booking for{" "}
                                        <strong>{booking.resource}</strong>?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>No</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700 w-1/2"
                                    >
                                        {isDeleting ? "Cancelling..." : "Yes, Cancel"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
