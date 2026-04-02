import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="text-center space-y-6 max-w-md px-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">404</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Page not found
          </h1>
          <p className="text-slate-600 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>

        {/* Additional help text */}
        <p className="text-slate-500 text-sm">
          If you believe this is a mistake, please{" "}
          <a
            href="mailto:support@permitos.com"
            className="text-blue-600 hover:underline"
          >
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
}
