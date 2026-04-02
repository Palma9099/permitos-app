// Project data access layer
// Currently uses mock data. Replace implementations with Prisma queries when ready.
// All functions are async to match future DB access patterns.

import { mockProjects, mockPermits } from "@/lib/mock-data";
import type { Project, Permit, ProjectStatus, PermitType } from "@/lib/types";

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus | "all";
  permitType?: PermitType | "all";
}

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  // TODO: Replace with Prisma query
  // return db.project.findMany({
  //   where: {
  //     AND: [
  //       filters?.search ? {
  //         OR: [
  //           { name: { contains: filters.search, mode: "insensitive" } },
  //           { address: { contains: filters.search, mode: "insensitive" } }
  //         ]
  //       } : undefined,
  //       filters?.status && filters.status !== "all" ? { status: filters.status } : undefined,
  //       filters?.permitType && filters.permitType !== "all" ? { permitType: filters.permitType } : undefined,
  //     ].filter(Boolean),
  //   },
  //   include: { assignee: true, permits: true },
  // })

  let results = [...mockProjects];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }

  if (filters?.status && filters.status !== "all") {
    results = results.filter((p) => p.status === filters.status);
  }

  if (filters?.permitType && filters.permitType !== "all") {
    results = results.filter((p) => p.permitType === filters.permitType);
  }

  return results;
}

export async function getProjectById(id: string): Promise<Project | null> {
  // TODO: Replace with Prisma query
  // return db.project.findUnique({
  //   where: { id },
  //   include: { assignee: true, permits: true },
  // })

  return mockProjects.find((p) => p.id === id) ?? null;
}

export async function getProjectPermits(projectId: string): Promise<Permit[]> {
  // TODO: Replace with Prisma query
  // return db.permit.findMany({
  //   where: { projectId },
  // })

  return mockPermits.filter((p) => p.projectId === projectId);
}

export async function getProjectCount(): Promise<number> {
  // TODO: Replace with Prisma query
  // return db.project.count()

  return mockProjects.length;
}
