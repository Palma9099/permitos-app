// Team data access layer
// Manages user and team member data.
// Currently uses mock data. Replace implementations with Prisma queries when ready.

import { mockTeamMembers } from "@/lib/mock-data";
import type { TeamMember } from "@/lib/types";

/**
 * Mock current user - Adrian Palma (founder/engineer)
 * In production, this would be fetched from Clerk auth
 */
const mockCurrentUser: TeamMember = {
  id: "user-1",
  name: "Adrian Palma",
  email: "adrian@permitos.com",
  role: "Founder & Engineer",
  avatar: null,
  initials: "AP",
};

export async function getTeamMembers(): Promise<TeamMember[]> {
  // TODO: Replace with Prisma query
  // return db.teamMember.findMany({
  //   where: { active: true },
  //   orderBy: { name: "asc" },
  // })

  return mockTeamMembers;
}

export async function getTeamMemberById(
  id: string
): Promise<TeamMember | null> {
  // TODO: Replace with Prisma query
  // return db.teamMember.findUnique({
  //   where: { id },
  // })

  return mockTeamMembers.find((m) => m.id === id) ?? null;
}

export async function getCurrentUser(): Promise<TeamMember> {
  // TODO: Replace with Clerk auth
  // const { userId } = await auth();
  // if (!userId) throw new Error("Unauthorized");
  // return db.teamMember.findUnique({
  //   where: { clerkId: userId },
  // })

  return mockCurrentUser;
}

export async function getTeamMemberByEmail(
  email: string
): Promise<TeamMember | null> {
  // TODO: Replace with Prisma query
  // return db.teamMember.findUnique({
  //   where: { email },
  // })

  return mockTeamMembers.find((m) => m.email === email) ?? null;
}

export async function getTeamMemberCount(): Promise<number> {
  // TODO: Replace with Prisma query
  // return db.teamMember.count({ where: { active: true } })

  return mockTeamMembers.length;
}
