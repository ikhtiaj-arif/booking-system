'use client'

import BookingDashboard from "@/components/BookingDashboard";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/types";
import { useState } from "react";

interface BookingTabsProps {
    bookings: Booking[];
}

export default function BookingTabs({ bookings }: BookingTabsProps) {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="w-full">
            <div className="flex w-full max-w-3xl mx-auto mb-8">
                <Button
                    variant={activeTab === "dashboard" ? "default" : "outline"}
                    className="flex-1 mr-2"
                    onClick={() => setActiveTab("dashboard")}
                >
                    Dashboard
                </Button>
                <Button
                    variant={activeTab === "book" ? "default" : "outline"}
                    className="flex-1 mx-2"
                    onClick={() => setActiveTab("book")}
                >
                    New Booking
                </Button>

            </div>

            {activeTab === "dashboard" && (
                <div className="space-y-6">
                    <BookingDashboard bookings={bookings} />
                </div>
            )}

            {activeTab === "book" && (
                <div className="space-y-6">
                    <div className="flex justify-center">Booking Form</div>
                </div>
            )}

            {activeTab === "test" && (
                <div className="space-y-6">
                    <div className="flex justify-center">Test API Response</div>
                </div>
            )}
        </div>
    );
}
