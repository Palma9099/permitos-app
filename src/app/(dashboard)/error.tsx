"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for monitoring (e.g., to Sentry)
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg border border-slate-200">
        {/* Icon */}
        <div className="flex justify-center">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>

        {/* Content */}
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="text-slate-600 text-sm">
            An error occurred while loading this section. Please try again.
          </p>
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
            <p className="font-mono">{error.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="flex-1 py-2 px-4 bg-slate-200 text-slate-900 font-medium rounded-lg hover:bg-slate-300 transition-colors text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
