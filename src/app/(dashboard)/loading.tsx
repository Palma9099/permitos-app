// Skeleton loading state for dashboard
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-slate-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Table Skeleton */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Widget Skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-3 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="space-y-6">
          <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
          <div className="h-64 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
