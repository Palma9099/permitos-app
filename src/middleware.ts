import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CLERK_CONFIGURED =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

// Dynamic import so middleware doesn't crash when Clerk env vars are missing
let clerkMiddlewareHandler: any = null;

if (CLERK_CONFIGURED) {
  try {
    const clerk = require("@clerk/nextjs/server");
    const isPublicRoute = clerk.createRouteMatcher([
      "/",
      "/login(.*)",
      "/signup(.*)",
      "/api/webhooks(.*)",
      "/robots.txt",
      "/sitemap.xml",
    ]);

    clerkMiddlewareHandler = clerk.clerkMiddleware(
      async (auth: any, request: NextRequest) => {
        if (!isPublicRoute(request)) {
          await auth.protect();
        }
      }
    );
  } catch {
    // Clerk not available — fall through to passthrough middleware
  }
}

export default function middleware(request: NextRequest) {
  if (clerkMiddlewareHandler) {
    return clerkMiddlewareHandler(request);
  }
  // No Clerk configured — let everything through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
