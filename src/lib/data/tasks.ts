// Task data access layer
// Currently uses mock data. Replace implementations with Prisma queries when ready.
// All functions are async to match future DB access patterns.

import { mockTasks } from "@/lib/mock-data";
import type { Task, TaskStatus, TaskPriority } from "@/lib/types";

export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  assigneeId?: string;
}

export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  // TODO: Replace with Prisma query
  // return db.task.findMany({
  //   where: {
  //     AND: [
  //       filters?.projectId ? { projectId: filters.projectId } : undefined,
  //       filters?.status && filters.status !== "all" ? { status: filters.status } : undefined,
  //       filters?.priority && filters.priority !== "all" ? { priority: filters.priority } : undefined,
  //       filters?.assigneeId ? { assigneeId: filters.assigneeId } : undefined,
  //     ].filter(Boolean),
  //   },
  //   include: { assignee: true },
  //   orderBy: { createdAt: "desc" },
  // })

  let results = [...mockTasks];

  if (filters?.projectId) {
    results = results.filter((t) => t.projectId === filters.projectId);
  }

  if (filters?.status && filters.status !== "all") {
    results = results.filter((t) => t.status === filters.status);
  }

  if (filters?.priority && filters.priority !== "all") {
    results = results.filter((t) => t.priority === filters.priority);
  }

  if (filters?.assigneeId) {
    results = results.filter((t) => t.assignee.id === filters.assigneeId);
  }

  return results;
}

export async function getTaskById(id: string): Promise<Task | null> {
  // TODO: Replace with Prisma query
  // return db.task.findUnique({
  //   where: { id },
  //   include: { assignee: true },
  // })

  return mockTasks.find((t) => t.id === id) ?? null;
}

export async function getOverdueTasks(): Promise<Task[]> {
  // TODO: Replace with Prisma query
  // return db.task.findMany({
  //   where: {
  //     status: { in: ["pending", "in_progress", "overdue", "blocked"] },
  //     dueDate: { lt: new Date() },
  //   },
  //   include: { assignee: true },
  //   orderBy: { dueDate: "asc" },
  // })

  const now = new Date().toISOString().split("T")[0];
  return mockTasks.filter(
    (t) =>
      ["pending", "in_progress", "overdue", "blocked"].includes(t.status) &&
      t.dueDate < now
  );
}

export async function getTaskCount(): Promise<number> {
  // TODO: Replace with Prisma query
  // return db.task.count()

  return mockTasks.length;
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  // TODO: Replace with Prisma query
  // return db.task.findMany({
  //   where: { status },
  //   include: { assignee: true },
  // })

  return mockTasks.filter((t) => t.status === status);
}
