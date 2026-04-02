export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="space-y-4">
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
        {/* Loading text */}
        <p className="text-center text-slate-600 text-sm font-medium">
          Loading PermitOS...
        </p>
      </div>
    </div>
  );
}
