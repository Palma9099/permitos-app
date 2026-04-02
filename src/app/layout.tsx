import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "PermitOS — The Operating System for Building Permits",
  description:
    "Track every permit project, automate submissions, and eliminate bottlenecks. Full visibility from application to approval.",
  openGraph: {
    title: "PermitOS — The Operating System for Building Permits",
    description:
      "Track every permit project, automate submissions, and eliminate bottlenecks.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/login"
      signUpUrl="/signup"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" className="h-full">
        <body className="antialiased h-full">{children}</body>
      </html>
    </ClerkProvider>
  );
}
