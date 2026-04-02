import { db } from "@/lib/db";
import { mockPermits } from "@/lib/mock-data";

function normalizeMockPermit(p: any) {
  return {
    id: p.id,
    projectId: p.projectId,
    type: (p.type || "building").toUpperCase().replace(/ /g, "_"),
    permitNumber: p.number,
    status: (p.status || "pending").toUpperCase().replace(/ /g, "_"),
    fees: p.fees || 0,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    submittedAt: p.submittedAt ? new Date(p.submittedAt) : null,
    issuedAt: p.issuedAt ? new Date(p.issuedAt) : null,
    expiresAt: p.expiresAt ? new Date(p.expiresAt) : null,
    approvedAt: null,
  };
}

export interface PermitFilters {
  projectId?: string;
  type?: string;
  status?: string;
}

/**
 * Get permits with optional filters
 */
export async function getPermits(filters?: PermitFilters) {
  if (!db) {
    let results = mockPermits.map(normalizeMockPermit);

    if (filters?.projectId) {
      results = results.filter((p) => p.projectId === filters.projectId);
    }
    if (filters?.type && filters.type !== "all") {
      const t = filters.type.toUpperCase().replace(/ /g, "_");
      results = results.filter((p) => p.type === t);
    }
    if (filters?.status && filters.status !== "all") {
      const s = filters.status.toUpperCase().replace(/ /g, "_");
      results = results.filter((p) => p.status === s);
    }
    return results;
  }

  const where: any = {};
  if (filters?.projectId) where.projectId = filters.projectId;
  if (filters?.type && filters.type !== "all") where.type = filters.type;
  if (filters?.status && filters.status !== "all") where.status = filters.status;

  return db.permit.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single permit by ID
 */
export async function getPermitById(id: string) {
  if (!db) {
    const p = mockPermits.find((p) => p.id === id);
    return p ? normalizeMockPermit(p) : null;
  }

  return db.permit.findUnique({
    where: { id },
  });
}

/**
 * Get permit count for a project
 */
export async function getPermitCount(projectId?: string) {
  if (!db) {
    if (projectId) {
      return mockPermits.filter((p) => p.projectId === projectId).length;
    }
    return mockPermits.length;
  }

  return db.permit.count({
    where: projectId ? { projectId } : undefined,
  });
}

/**
 * Get permits grouped by project
 */
export async function getPermitsByProjectId(projectId: string) {
  return getPermits({ projectId });
}
