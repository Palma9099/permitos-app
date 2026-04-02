import { db } from "@/lib/db";
import { mockProjects, mockPermits } from "@/lib/mock-data";

export interface ProjectFilters {
  search?: string;
  status?: string;
  permitType?: string;
  organizationId?: string;
}

function normalizeMockProject(p: any) {
  return {
    id: p.id,
    name: p.name,
    address: p.address,
    city: p.city || "",
    state: p.state || "FL",
    zip: p.zipCode || "",
    jurisdiction: p.jurisdiction,
    status: (p.status || "intake").toUpperCase().replace(/ /g, "_"),
    permitType: (p.permitType || "building").toUpperCase().replace(/ /g, "_"),
    value: p.value || 0,
    progress: p.completedTasks && p.totalTasks ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0,
    commentRounds: p.commentRounds || 0,
    description: null,
    notes: null,
    assigneeId: p.assignee?.id || null,
    assignee: p.assignee ? {
      id: p.assignee.id,
      firstName: p.assignee.name?.split(" ")[0] || "",
      lastName: p.assignee.name?.split(" ").slice(1).join(" ") || "",
      email: p.assignee.email || "",
      avatarUrl: p.assignee.avatar,
      role: p.assignee.role || "MEMBER",
    } : null,
    organizationId: "mock-org-1",
    submittedAt: p.submittedAt ? new Date(p.submittedAt) : null,
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    _count: {
      tasks: p.totalTasks || 0,
      documents: 0,
      permits: 0,
    },
  };
}

export async function getProjects(filters?: ProjectFilters) {
  if (!db) {
    let results = mockProjects.map(normalizeMockProject);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }
    if (filters?.status && filters.status !== "all") {
      const s = filters.status.toUpperCase().replace(/ /g, "_");
      results = results.filter((p) => p.status === s);
    }
    if (filters?.permitType && filters.permitType !== "all") {
      const t = filters.permitType.toUpperCase().replace(/ /g, "_");
      results = results.filter((p) => p.permitType === t);
    }
    return results;
  }

  const where: any = {};
  if (filters?.organizationId) where.organizationId = filters.organizationId;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { address: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters?.status && filters.status !== "all") where.status = filters.status;
  if (filters?.permitType && filters.permitType !== "all") where.permitType = filters.permitType;

  return db.project.findMany({
    where,
    include: {
      assignee: true,
      _count: { select: { tasks: true, documents: true, permits: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  if (!db) {
    const p = mockProjects.find((p) => p.id === id);
    return p ? normalizeMockProject(p) : null;
  }

  return db.project.findUnique({
    where: { id },
    include: {
      assignee: true,
      permits: { orderBy: { createdAt: "desc" } },
      tasks: {
        include: { assignee: true },
        orderBy: { createdAt: "desc" },
      },
      documents: {
        include: { uploadedBy: true },
        orderBy: { createdAt: "desc" },
      },
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { tasks: true, documents: true, permits: true } },
    },
  });
}

export async function getProjectPermits(projectId: string) {
  if (!db) {
    return mockPermits
      .filter((p) => p.projectId === projectId)
      .map((p) => ({
        ...p,
        status: (p.status || "pending").toUpperCase().replace(/ /g, "_"),
        type: (p.type || "building").toUpperCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
        approvedAt: null,
        issuedAt: p.issuedAt ? new Date(p.issuedAt) : null,
        submittedAt: p.submittedAt ? new Date(p.submittedAt) : null,
        expiresAt: p.expiresAt ? new Date(p.expiresAt) : null,
      }));
  }

  return db.permit.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectCount(organizationId?: string) {
  if (!db) return mockProjects.length;
  return db.project.count({
    where: organizationId ? { organizationId } : undefined,
  });
}

export async function getProjectsByStatus(organizationId?: string) {
  if (!db) {
    const counts: Record<string, number> = {};
    mockProjects.forEach((p) => {
      const status = (p.status || "intake").toUpperCase().replace(/ /g, "_");
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }

  const results = await db.project.groupBy({
    by: ["status"],
    _count: true,
    where: organizationId ? { organizationId } : undefined,
  });
  return Object.fromEntries(results.map((r: any) => [r.status, r._count]));
}
