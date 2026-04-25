import BookingTabs from "@/components/BookingTabs";
import { CalendarCheck, Shield, Timer } from "lucide-react";

export default async function Home() {
  return (
    <div className="min-h-screen">
      {/* ── Hero Header ───────────────────────────────── */}
      <header className="relative border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center mb-6">
            {/* Logo pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-5 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Real-time Resource Management
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
              <span className="gradient-text">BookSpace</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Reserve shared resources with automatic conflict detection
              and smart buffer time management.
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="p-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20">
                <CalendarCheck className="w-4 h-4 text-fuchsia-400" />
              </div>
              <span>5 Bookable Resources</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <span>Conflict-free Booking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Timer className="w-4 h-4 text-indigo-400" />
              </div>
              <span>10-min Safety Buffer</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <BookingTabs />
      </main>
    </div>
  );
}
