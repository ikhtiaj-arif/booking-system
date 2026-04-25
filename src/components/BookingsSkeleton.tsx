export function BookingCardSkeleton() {
  return (
    <div className="glass rounded-xl border border-white/[0.06] p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="skeleton-dark h-4 w-32" />
        <div className="skeleton-dark h-5 w-20 rounded-full" />
      </div>
      {/* Divider */}
      <div className="h-px bg-white/[0.04]" />
      {/* Rows */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="skeleton-dark h-3.5 w-3.5 rounded" />
          <div className="skeleton-dark h-3 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton-dark h-3.5 w-3.5 rounded" />
          <div className="skeleton-dark h-3 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton-dark h-3.5 w-3.5 rounded" />
          <div className="skeleton-dark h-3 w-28" />
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="skeleton-dark h-5 w-14 rounded-full" />
        <div className="skeleton-dark h-7 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function BookingGroupSkeleton() {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Group header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="skeleton-dark h-8 w-8 rounded-lg" />
          <div className="skeleton-dark h-4 w-36" />
        </div>
        <div className="skeleton-dark h-5 w-20 rounded-full" />
      </div>
      {/* Cards */}
      <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(3).fill(0).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function BookingDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="rounded-xl glass border border-white/[0.06] px-4 py-3">
            <div className="skeleton-dark h-2 w-12 mb-2" />
            <div className="skeleton-dark h-7 w-8" />
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className="glass rounded-xl border border-white/[0.07] px-4 py-3">
        <div className="flex gap-4">
          <div className="skeleton-dark h-9 flex-1 rounded-xl" />
          <div className="skeleton-dark h-9 flex-1 rounded-xl" />
          <div className="skeleton-dark h-9 w-20 rounded-xl" />
        </div>
      </div>
      {/* Groups */}
      <BookingGroupSkeleton />
      <BookingGroupSkeleton />
    </div>
  )
}
