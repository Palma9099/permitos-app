import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Verify the webhook signature using Svix.
 * Returns the parsed event or null if verification fails.
 */
async function verifyWebhook(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[clerk-webhook] CLERK_WEBHOOK_SECRET not set");
    return null;
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("[clerk-webhook] Missing svix headers");
    return null;
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  try {
    const { Webhook } = await import("svix");
    const wh = new Webhook(WEBHOOK_SECRET);
    return wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: Record<string, any> };
  } catch (err) {
    console.error("[clerk-webhook] Verification failed:", err);
    return null;
  }
}

/**
 * Find or create the default organization.
 * Used when a user signs up but no org exists yet.
 */
async function getOrCreateDefaultOrg() {
  let org = await db.organization.findFirst({ orderBy: { createdAt: "asc" } });
  if (!org) {
    org = await db.organization.create({
      data: { name: "Default Organization", slug: "default-org" },
    });
  }
  return org;
}

async function handleUserCreated(data: Record<string, any>) {
  const clerkId = data.id;
  const email = data.email_addresses?.[0]?.email_address;
  if (!clerkId || !email) return;

  const existing = await db.user.findUnique({ where: { clerkId } });
  if (existing) return;

  const org = await getOrCreateDefaultOrg();

  await db.user.create({
    data: {
      clerkId,
      email,
      firstName: data.first_name || null,
      lastName: data.last_name || null,
      avatarUrl: data.image_url || null,
      role: "ADMIN",
      organizationId: org.id,
    },
  });
  console.log(`[clerk-webhook] User synced: ${email} → org ${org.slug}`);
}

async function handleUserUpdated(data: Record<string, any>) {
  const clerkId = data.id;
  if (!clerkId) return;

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) {
    await handleUserCreated(data);
    return;
  }

  await db.user.update({
    where: { clerkId },
    data: {
      email: data.email_addresses?.[0]?.email_address || user.email,
      firstName: data.first_name ?? user.firstName,
      lastName: data.last_name ?? user.lastName,
      avatarUrl: data.image_url ?? user.avatarUrl,
    },
  });
}

async function handleUserDeleted(data: Record<string, any>) {
  const clerkId = data.id;
  if (!clerkId) return;
  // Preserve DB user record — projects and tasks should remain intact
  console.log(`[clerk-webhook] User deleted in Clerk: ${clerkId} — DB record preserved`);
}

async function handleOrganizationCreated(data: Record<string, any>) {
  const clerkOrgId = data.id;
  const name = data.name;
  const slug = data.slug;
  if (!clerkOrgId || !name || !slug) return;

  const existing = await db.organization.findUnique({ where: { clerkId: clerkOrgId } });
  if (existing) return;

  await db.organization.create({
    data: {
      clerkId: clerkOrgId,
      name,
      slug,
      logoUrl: data.image_url || null,
    },
  });
  console.log(`[clerk-webhook] Organization synced: ${name}`);
}

async function handleOrganizationUpdated(data: Record<string, any>) {
  const clerkOrgId = data.id;
  if (!clerkOrgId) return;

  const org = await db.organization.findUnique({ where: { clerkId: clerkOrgId } });
  if (!org) {
    await handleOrganizationCreated(data);
    return;
  }

  await db.organization.update({
    where: { clerkId: clerkOrgId },
    data: {
      name: data.name || org.name,
      slug: data.slug || org.slug,
      logoUrl: data.image_url ?? org.logoUrl,
    },
  });
}

async function handleMembershipCreated(data: Record<string, any>) {
  const clerkUserId = data.public_user_data?.user_id;
  const clerkOrgId = data.organization?.id;
  const role = data.role;
  if (!clerkUserId || !clerkOrgId) return;

  const user = await db.user.findUnique({ where: { clerkId: clerkUserId } });
  const org = await db.organization.findUnique({ where: { clerkId: clerkOrgId } });
  if (!user || !org) return;

  await db.user.update({
    where: { clerkId: clerkUserId },
    data: {
      organizationId: org.id,
      role: role === "admin" ? "ADMIN" : "MEMBER",
    },
  });
  console.log(`[clerk-webhook] User ${user.email} → org ${org.slug} as ${role}`);
}

export async function POST(request: Request) {
  const evt = await verifyWebhook(request);
  if (!evt) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  if (!db) {
    console.warn("[clerk-webhook] No database connection — skipping");
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
      case "user.updated":
        await handleUserUpdated(evt.data);
        break;
      case "user.deleted":
        await handleUserDeleted(evt.data);
        break;
      case "organization.created":
        await handleOrganizationCreated(evt.data);
        break;
      case "organization.updated":
        await handleOrganizationUpdated(evt.data);
        break;
      case "organizationMembership.created":
        await handleMembershipCreated(evt.data);
        break;
      default:
        console.log(`[clerk-webhook] Unhandled: ${evt.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[clerk-webhook] Error handling ${evt.type}:`, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
