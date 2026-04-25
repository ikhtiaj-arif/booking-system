'use client'

import { BookingFormData, RESOURCES } from '@/lib/types';
import { validateBookingTime } from '@/lib/utils';
import { AlertCircle, CalendarPlus, CheckCircle2, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

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

      setFormData({ resource: "", startTime: "", endTime: "", requestedBy: "" });
      onBookingCreated?.();

    } catch (err) {
      const fallbackError = "Something went wrong.";
      const msg = err instanceof Error ? err.message : fallbackError;
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (fieldName: keyof BookingFormData, value: string) => {
    setFormData((data) => ({ ...data, [fieldName]: value }))
    setError(null)
    setSuccess(null)
  }

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl text-sm text-slate-200
    bg-white/[0.05] border border-white/[0.1]
    focus:outline-none focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20
    placeholder:text-slate-600 transition-all duration-200
  `

  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"

  return (
    <div className="max-w-lg mx-auto">
      <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
        {/* Form header */}
        <div className="px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-fuchsia-500/[0.07] to-purple-500/[0.07]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600 glow-primary">
              <CalendarPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Book a Resource</h2>
              <p className="text-xs text-slate-500 mt-0.5">Min 15 min · Max 2 hours · 10-min buffer</p>
            </div>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Resource selector */}
          <div>
            <label className={labelClass}>Resource</label>
            <div className="relative">
              <select
                id="resource"
                value={formData.resource}
                onChange={(e) => handleInputChange("resource", e.target.value)}
                className={`${inputClass} appearance-none pr-10 cursor-pointer`}
              >
                <option value="" disabled style={{ background: "#141420" }}>Select a resource…</option>
                {RESOURCES.map((r) => (
                  <option key={r} value={r} style={{ background: "#141420" }}>{r}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="startTime" className={labelClass}>Start Time</label>
            <input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className={inputClass}
            />
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="endTime" className={labelClass}>End Time</label>
            <input
              id="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              min={formData.startTime || new Date().toISOString().slice(0, 16)}
              className={inputClass}
            />
          </div>

          {/* Requested By */}
          <div>
            <label htmlFor="requestedBy" className={labelClass}>Requested By</label>
            <input
              id="requestedBy"
              type="text"
              placeholder="Your name or team…"
              value={formData.requestedBy}
              onChange={(e) => handleInputChange("requestedBy", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/25 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Success alert */}
          {success && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25 text-emerald-300 text-sm">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="submit-booking"
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 rounded-xl font-semibold text-sm text-white
              bg-gradient-to-r from-fuchsia-600 to-purple-600
              hover:from-fuchsia-500 hover:to-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 glow-primary
              flex items-center justify-center gap-2 cursor-pointer
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating Booking…
              </>
            ) : (
              <>
                <CalendarPlus className="w-4 h-4" />
                Create Booking
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;