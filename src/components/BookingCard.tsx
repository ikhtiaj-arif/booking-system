"use client"

import { BookingWithStatus } from "@/lib/types"
import { formatDateTime } from "@/lib/utils"
import { Calendar, Clock, Trash2, User } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "./ui/alert-dialog"

interface BookingCardProps {
  booking: BookingWithStatus
  fetchBookings: () => void
}

const STATUS_CONFIG = {
  ongoing: {
    label: "ONGOING",
    classes: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    glow: "glow-green",
    dot: "bg-emerald-400 animate-pulse",
  },
  upcoming: {
    label: "UPCOMING",
    classes: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    glow: "glow-blue",
    dot: "bg-violet-400",
  },
  past: {
    label: "PAST",
    classes: "bg-white/[0.05] text-slate-500 border-white/[0.07]",
    glow: "",
    dot: "bg-slate-600",
  },
}

function getDurationLabel(start: Date, end: Date): string {
  const diffMs = new Date(end).getTime() - new Date(start).getTime()
  const totalMinutes = Math.round(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export default function BookingCard({ booking, fetchBookings }: BookingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const canDelete = booking.status === "upcoming"
  const statusCfg = STATUS_CONFIG[booking.status]

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/bookings?id=${booking.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete booking")
      fetchBookings()
    } catch (error) {
      console.error("Error deleting booking:", error)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="glass glass-hover rounded-xl border border-white/[0.08] p-4 flex flex-col gap-3 group">
      {/* Card header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-100 text-sm leading-snug">{booking.resource}</h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wider whitespace-nowrap ${statusCfg.classes} ${statusCfg.glow}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06]" />

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span>{formatDateTime(new Date(booking.startTime))}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">
            {formatDateTime(new Date(booking.startTime))} → {formatDateTime(new Date(booking.endTime))}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span>{booking.requestedBy}</span>
        </div>
      </div>

      {/* Duration pill */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-600 bg-white/[0.04] border border-white/[0.06] rounded-full px-2.5 py-0.5 font-medium">
          ⏱ {getDurationLabel(new Date(booking.startTime), new Date(booking.endTime))}
        </span>

        {canDelete && (
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogTrigger asChild>
              <button
                id={`cancel-booking-${booking.id}`}
                className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 bg-red-500/[0.06] hover:bg-red-500/10 rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                Cancel
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="glass border border-white/[0.1] text-slate-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-slate-100">Cancel this booking?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. Are you sure you want to cancel the booking for{" "}
                  <strong className="text-slate-200">{booking.resource}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isDeleting}
                  className="bg-white/[0.05] border-white/[0.1] text-slate-300 hover:bg-white/[0.08] hover:text-slate-100"
                >
                  Keep it
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-500 text-white glow-red"
                >
                  {isDeleting ? "Cancelling…" : "Yes, Cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}
