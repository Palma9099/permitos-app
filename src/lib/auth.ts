// Authentication placeholder
// When ready to connect Clerk:
// 1. Install: npm install @clerk/nextjs
// 2. Add CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env
// 3. Wrap app in ClerkProvider
// 4. Replace mock functions below with Clerk helpers
//
// import { auth, currentUser } from "@clerk/nextjs/server";

export async function getCurrentUserId(): Promise<string> {
  // TODO: Replace with Clerk auth()
  // const { userId } = await auth();
  // return userId || null;

  return "user-1"; // Mock: Adrian Palma
}

export async function requireAuth(): Promise<string> {
  // TODO: Replace with Clerk auth() + redirect
  // import { redirect } from "next/navigation";
  // const { userId } = await auth();
  // if (!userId) redirect("/sign-in");
  // return userId;

  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export function getAuthConfig() {
  return {
    signInUrl: "/login",
    signUpUrl: "/signup",
    afterSignInUrl: "/dashboard",
    afterSignUpUrl: "/dashboard",
  };
}

export async function getCurrentUserEmail(): Promise<string | null> {
  // TODO: Replace with Clerk currentUser()
  // const user = await currentUser();
  // return user?.emailAddresses?.[0]?.emailAddress || null;

  return "adrian@permitos.com"; // Mock
}
