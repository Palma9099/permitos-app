import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/projects", "/permits", "/tasks", "/documents", "/jurisdictions", "/team", "/settings"];
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TODO: Replace with Clerk middleware when auth is connected
  // import { clerkMiddleware } from "@clerk/nextjs/server";
  // export default clerkMiddleware();

  // For now, allow all routes (no auth enforcement)
  // When Clerk is connected, this middleware will:
  // 1. Redirect unauthenticated users from protected routes to /login
  // 2. Redirect authenticated users from auth routes to /dashboard

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
