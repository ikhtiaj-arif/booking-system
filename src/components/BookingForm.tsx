'use-client'

import { BookingFormData, RESOURCES } from '@/lib/types';
import { validateBookingTime } from '@/lib/utils';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface BookingFormProps {
    onBookingCreated: () => void

}



const BookingForm = ({ onBookingCreated }: BookingFormProps) => {
    const [formData, setFormData] = useState<BookingFormData>({
        resource: "",
        startTime: "",
        endTime: "",
        requestedBy: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const timeValidationError = validateBookingTime(formData.startTime, formData.endTime);
        if (timeValidationError) {
            setError(timeValidationError);
            toast.error(timeValidationError);
            return;
        }

        if (!formData.resource || !formData.requestedBy) {
            const msg = "Please fill in all fields.";
            setError(msg);
            toast.error(msg);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message);
                toast.error(result.message);
                return;
            }

            setSuccess(result.message);
            toast.success(result.message);

            setFormData({
                resource: "",
                startTime: "",
                endTime: "",
                requestedBy: "",
            });
            onBookingCreated?.();

        } catch (err) {
            const fallbackError = "Something went wrong.";
            setError(err instanceof Error ? err.message : fallbackError);
            toast.error(err instanceof Error ? err.message : fallbackError);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleInputChange = (fieldName: keyof BookingFormData, value: string) => {
        setFormData((data) => ({ ...data, [fieldName]: value }))
        setError(null)
        setSuccess(null)
    }

    return (
        <div>

            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Book a Resource</CardTitle>
                    <CardDescription>Reserve shared resources for your team. Minimum 15 minutes, maximum 2 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resource">Resource</Label>
                            <Select value={formData.resource} onValueChange={(value) => handleInputChange("resource", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a resource" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RESOURCES.map((resource) => (
                                        <SelectItem key={resource} value={resource}>
                                            {resource}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) => handleInputChange("startTime", e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                id="endTime"
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={(e) => handleInputChange("endTime", e.target.value)}
                                min={formData.startTime || new Date().toISOString().slice(0, 16)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requestedBy">Requested By</Label>
                            <Input
                                id="requestedBy"
                                type="text"
                                placeholder="Your name"
                                value={formData.requestedBy}
                                onChange={(e) => handleInputChange("requestedBy", e.target.value)}
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating Booking..." : "Create Booking"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingForm;