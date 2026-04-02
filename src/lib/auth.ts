import { redirect } from "next/navigation";
import { db } from "./db";

const CLERK_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY
);

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Only allow mock mode in development without Clerk
const USE_MOCK_AUTH = !CLERK_CONFIGURED && !IS_PRODUCTION;

/**
 * Get the current Clerk user ID.
 * In dev without Clerk: returns mock user.
 * In production without Clerk: returns null (blocks access).
 */
export async function getCurrentUserId(): Promise<string | null> {
  if (USE_MOCK_AUTH) return "mock-user-1";
  if (!CLERK_CONFIGURED) return null; // Production without Clerk = no auth

  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

/**
 * Require authentication. Redirects to login if not authenticated.
 * In dev without Clerk: returns mock user ID.
 * In production without Clerk: redirects to login.
 */
export async function requireAuth(): Promise<string> {
  if (USE_MOCK_AUTH) return "mock-user-1";

  if (!CLERK_CONFIGURED) {
    redirect("/login");
  }

  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    if (!userId) redirect("/login");
    return userId;
  } catch {
    redirect("/login");
  }
}

/**
 * Get the current user profile.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  if (USE_MOCK_AUTH) {
    return {
      id: "mock-user-1",
      firstName: "Adrian",
      lastName: "Palma",
      email: "adrian@airavata.eng",
      avatarUrl: null,
    };
  }

  if (!CLERK_CONFIGURED) return null;

  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      avatarUrl: user.imageUrl,
    };
  } catch {
    return null;
  }
}

/**
 * Get or create the database user for the current session.
 * Returns the DB user with organizationId for scoping queries.
 */
export async function getOrCreateDbUser() {
  const clerkUser = await getCurrentUser();
  if (!clerkUser) return null;

  // Mock mode — return mock user with org
  if (!db) {
    return {
      id: "mock-user-1",
      clerkId: clerkUser.id,
      email: clerkUser.email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      role: "ADMIN" as const,
      organizationId: "mock-org-1",
    };
  }

  let user = await db.user.findUnique({ where: { clerkId: clerkUser.id } });
  if (!user) {
    // Find or create default org
    let org = await db.organization.findFirst({ orderBy: { createdAt: "asc" } });
    if (!org) {
      org = await db.organization.create({
        data: { name: "My Organization", slug: "my-org" },
      });
    }
    user = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        avatarUrl: clerkUser.avatarUrl,
        role: "ADMIN",
        organizationId: org.id,
      },
    });
  }
  return user;
}

/**
 * Get the current user's organization ID for scoping data queries.
 * This is the primary function data layers should call.
 */
export async function getCurrentOrganizationId(): Promise<string | null> {
  if (USE_MOCK_AUTH) return "mock-org-1";

  const user = await getOrCreateDbUser();
  return user?.organizationId ?? null;
}

export function getAuthConfig() {
  return {
    signInUrl: "/login",
    signUpUrl: "/signup",
    afterSignInUrl: "/dashboard",
    afterSignUpUrl: "/dashboard",
  };
}
