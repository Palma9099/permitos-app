import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";

const CLERK_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY
);

export async function getCurrentUserId(): Promise<string | null> {
  if (!CLERK_CONFIGURED) return "mock-user-1";
  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<string> {
  if (!CLERK_CONFIGURED) return "mock-user-1";
  const { userId } = await auth();
  if (!userId) redirect("/login");
  return userId;
}

export async function getCurrentUser() {
  if (!CLERK_CONFIGURED) {
    return {
      id: "mock-user-1",
      firstName: "Adrian",
      lastName: "Palma",
      email: "adrian@airavata.eng",
      avatarUrl: null,
    };
  }
  try {
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

export async function getOrCreateDbUser() {
  const clerkUser = await getCurrentUser();
  if (!clerkUser) return null;
  if (!db) return { id: "mock-user-1", clerkId: clerkUser.id, email: clerkUser.email, firstName: clerkUser.firstName, lastName: clerkUser.lastName, role: "ADMIN" as const, organizationId: "mock-org-1" };

  let user = await db.user.findUnique({ where: { clerkId: clerkUser.id } });
  if (!user) {
    // Find or create default org
    let org = await db.organization.findFirst();
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

export function getAuthConfig() {
  return {
    signInUrl: "/login",
    signUpUrl: "/signup",
    afterSignInUrl: "/dashboard",
    afterSignUpUrl: "/dashboard",
  };
}
