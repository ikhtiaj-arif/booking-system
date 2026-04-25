'use client'

import { RESOURCES } from '@/lib/types';
import { CalendarDays, Filter, X } from 'lucide-react';

interface FiltersProps {
  selectedResource: string
  selectedDate: string
  setSelectedResource: (resource: string) => void
  setSelectedDate: (date: string) => void
  handleClearFilters: () => void
}

const Filters = ({
  selectedResource,
  selectedDate,
  setSelectedResource,
  setSelectedDate,
  handleClearFilters,
}: FiltersProps) => {
  const hasActiveFilters = selectedDate !== "" || selectedResource !== "all"

  const inputClass = `
    w-full px-3 py-2 rounded-xl text-sm text-slate-300
    bg-white/[0.05] border border-white/[0.08]
    focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20
    transition-all duration-200
  `

  return (
    <div className="glass rounded-xl border border-white/[0.07] px-4 py-3">
      <div className="flex flex-wrap items-end gap-4">
        {/* Header label */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-full md:w-auto">
          <Filter className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
          )}
        </div>

        {/* Resource filter */}
        <div className="flex-1 min-w-[180px]">
          <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            <Filter className="w-3 h-3" />
            Resource
          </label>
          <div className="relative">
            <select
              id="resource-filter"
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className={`${inputClass} appearance-none pr-8 cursor-pointer`}
            >
              <option value="all" style={{ background: "#141420" }}>All resources</option>
              {RESOURCES.map((r) => (
                <option key={r} value={r} style={{ background: "#141420" }}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date filter */}
        <div className="flex-1 min-w-[160px]">
          <label htmlFor="date-filter" className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            <CalendarDays className="w-3 h-3" />
            Date
          </label>
          <input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 border border-white/[0.07] hover:border-white/[0.15] bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;