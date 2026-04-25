'use client'

import BookingDashboard from "@/components/BookingDashboard";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import { useState } from "react";
import BookingForm from "./BookingForm";

export default function BookingTabs() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState<"dashboard" | "book">("dashboard");

  const handleBookingCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
    setActiveTab("dashboard")
  }

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "book" as const, label: "New Booking", icon: PlusCircle },
  ]

  return (
    <div className="w-full">
      {/* ── Pill Tab Switcher ─────────────────────────── */}
      <div className="flex justify-center mb-8">
        <div className="relative flex p-1 rounded-xl glass border border-white/[0.08] gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg glow-primary"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Panels ────────────────────────────────── */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "dashboard" && (
          <BookingDashboard refreshTrigger={refreshTrigger} />
        )}
        {activeTab === "book" && (
          <BookingForm onBookingCreated={handleBookingCreated} />
        )}
      </div>
    </div>
  );
}
