"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for monitoring (e.g., to Sentry)
    console.error("Root error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>

        {/* Content */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>
          <p className="text-slate-600">
            An unexpected error occurred. Please try again.
          </p>
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <p className="font-mono text-xs">{error.message}</p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => reset()}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
