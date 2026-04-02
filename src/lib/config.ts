// Application configuration
// Centralizes all environment variable access with type safety

export const config = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    name: process.env.NEXT_PUBLIC_APP_NAME || "PermitOS",
    env: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  },
  auth: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/login",
    signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/signup",
    afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/dashboard",
    afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/dashboard",
  },
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_DATABASE_URL,
  },
  storage: {
    bucket: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
  },
  email: {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || "noreply@permitos.com",
  },
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  posthog: {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  },
} as const;
