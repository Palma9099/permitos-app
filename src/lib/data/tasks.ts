import { db } from "@/lib/db";
import { mockTasks } from "@/lib/mock-data";

export interface TaskFilters {
  projectId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
}

function normalizeMockTask(t: any) {
  return {
    id: t.id,
    title: t.title,
    description: t.description || null,
    status: t.status === "pending" ? "TODO" : t.status === "completed" ? "DONE" : t.status === "overdue" ? "TODO" : (t.status || "TODO").toUpperCase().replace(/ /g, "_"),
    priority: (t.priority || "MEDIUM").toUpperCase(),
    dueDate: t.dueDate ? new Date(t.dueDate) : null,
    projectId: t.projectId,
    projectName: t.projectName || "",
    assigneeId: t.assignee?.id || null,
    assignee: t.assignee ? {
      id: t.assignee.id,
      firstName: t.assignee.name?.split(" ")[0] || "",
      lastName: t.assignee.name?.split(" ").slice(1).join(" ") || "",
      email: t.assignee.email || "",
      avatarUrl: t.assignee.avatar,
    } : null,
    createdById: null,
    createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
    updatedAt: new Date(),
    isOverdue: t.dueDate ? new Date(t.dueDate) < new Date() && t.status !== "completed" && t.status !== "DONE" : false,
  };
}

export async function getTasks(filters?: TaskFilters) {
  if (!db) {
    let results = mockTasks.map(normalizeMockTask);
    if (filters?.projectId) results = results.filter((t) => t.projectId === filters.projectId);
    if (filters?.assigneeId) results = results.filter((t) => t.assigneeId === filters.assigneeId);
    if (filters?.status && filters.status !== "all") {
      results = results.filter((t) => t.status === filters.status!.toUpperCase());
    }
    if (filters?.priority && filters.priority !== "all") {
      results = results.filter((t) => t.priority === filters.priority!.toUpperCase());
    }
    return results;
  }

  const where: any = {};
  if (filters?.projectId) where.projectId = filters.projectId;
  if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
  if (filters?.status && filters.status !== "all") where.status = filters.status;
  if (filters?.priority && filters.priority !== "all") where.priority = filters.priority;

  return db.task.findMany({
    where,
    include: {
      assignee: true,
      project: { select: { name: true } },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });
}

export async function getTaskById(id: string) {
  if (!db) {
    const t = mockTasks.find((t) => t.id === id);
    return t ? normalizeMockTask(t) : null;
  }

  return db.task.findUnique({
    where: { id },
    include: { assignee: true, project: { select: { name: true } } },
  });
}

export async function getTaskCount(filters?: { projectId?: string; status?: string }) {
  if (!db) {
    let tasks = mockTasks;
    if (filters?.projectId) tasks = tasks.filter((t) => t.projectId === filters.projectId);
    if (filters?.status) tasks = tasks.filter((t) => {
      const normalized = t.status === "pending" ? "TODO" : t.status === "completed" ? "DONE" : (t.status || "TODO").toUpperCase();
      return normalized === filters.status;
    });
    return tasks.length;
  }

  const where: any = {};
  if (filters?.projectId) where.projectId = filters.projectId;
  if (filters?.status) where.status = filters.status;
  return db.task.count({ where });
}

export async function getOverdueTasks() {
  if (!db) {
    return mockTasks
      .filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed")
      .map(normalizeMockTask);
  }

  return db.task.findMany({
    where: {
      dueDate: { lt: new Date() },
      status: { not: "DONE" },
    },
    include: { assignee: true, project: { select: { name: true } } },
    orderBy: { dueDate: "asc" },
  });
}

export async function getTasksByStatus(status: string) {
  if (!db) {
    return mockTasks
      .filter((t) => {
        const normalized = t.status === "pending" ? "TODO" : t.status === "completed" ? "DONE" : (t.status || "TODO").toUpperCase();
        return normalized === status;
      })
      .map(normalizeMockTask);
  }

  return db.task.findMany({
    where: { status },
    include: { assignee: true, project: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}
