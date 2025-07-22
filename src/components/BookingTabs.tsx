'use client'

import BookingDashboard from "@/components/BookingDashboard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BookingForm from "./BookingForm";


export default function BookingTabs() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [activeTab, setActiveTab] = useState("dashboard");

    const handleBookingCreated = () => {
        setRefreshTrigger((prev) => prev + 1)
       
    }
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
                    <BookingDashboard refreshTrigger={refreshTrigger} />
                </div>
            )}

            {activeTab === "book" && (
                <div className="space-y-6">
                    <div className="">
                        <BookingForm onBookingCreated={handleBookingCreated}  />
                    </div>
                </div>
            )}


        </div>
    );
}
