// Dashboard data access layer
// Aggregates KPIs, chart data, and agent activities for the main dashboard.
// Currently uses mock data. Replace implementations with Prisma queries when ready.

import {
  mockKpiCards,
  mockTimeByPartyData,
  mockApprovalTimeData,
  mockCommentRoundsData,
  mockAgentActivities,
  mockTasks,
  mockProjects,
} from "@/lib/mock-data";
import type {
  KpiCard,
  TimeByPartyData,
  ApprovalTimeData,
  CommentRoundsData,
  AgentActivity,
  Task,
} from "@/lib/types";

export interface DashboardSummary {
  kpiCards: KpiCard[];
  recentTasks: Task[];
  agentActivities: AgentActivity[];
  taskCountByStatus: Record<string, number>;
  projectCountByStatus: Record<string, number>;
}

export async function getKpiCards(): Promise<KpiCard[]> {
  // TODO: Replace with Prisma aggregation query
  // return db.project.findMany({
  //   select: {
  //     status: true,
  //   },
  // }).then((projects) => {
  //   const statusCounts = {};
  //   // Aggregate by status and calculate KPIs
  // })

  return mockKpiCards;
}

export async function getTimeByPartyData(): Promise<TimeByPartyData[]> {
  // TODO: Replace with Prisma query that groups time tracking by month and party
  // return db.timeTracking.groupBy({
  //   by: ["month", "party"],
  //   _sum: { hours: true },
  // })

  return mockTimeByPartyData;
}

export async function getApprovalTimeData(): Promise<ApprovalTimeData[]> {
  // TODO: Replace with Prisma query calculating approval times per month
  // return db.project.findMany({
  //   where: { approvedAt: { not: null }, submittedAt: { not: null } },
  //   select: {
  //     submittedAt: true,
  //     approvedAt: true,
  //   },
  // }).then((projects) => {
  //   // Calculate days between submission and approval, group by month
  // })

  return mockApprovalTimeData;
}

export async function getCommentRoundsData(): Promise<CommentRoundsData[]> {
  // TODO: Replace with Prisma query aggregating comment rounds by month
  // return db.project.findMany({
  //   select: {
  //     createdAt: true,
  //     commentRounds: true,
  //   },
  // }).then((projects) => {
  //   // Group by month and average comment rounds
  // })

  return mockCommentRoundsData;
}

export async function getAgentActivities(): Promise<AgentActivity[]> {
  // TODO: Replace with Prisma query fetching active AI agent tasks
  // return db.agentTask.findMany({
  //   where: { status: { in: ["in_progress", "queued"] } },
  //   orderBy: { createdAt: "desc" },
  //   take: 5,
  // })

  return mockAgentActivities;
}

export async function getRecentTasks(limit: number = 5): Promise<Task[]> {
  // TODO: Replace with Prisma query
  // return db.task.findMany({
  //   include: { assignee: true },
  //   orderBy: { createdAt: "desc" },
  //   take: limit,
  // })

  return mockTasks.slice(0, limit);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // TODO: Replace with optimized Prisma query using batch operations
  // const [kpis, tasks, activities, taskCounts, projectCounts] = await Promise.all([
  //   db.project.groupBy(...),
  //   db.task.findMany(...),
  //   db.agentTask.findMany(...),
  //   db.task.groupBy({ by: ["status"], _count: true }),
  //   db.project.groupBy({ by: ["status"], _count: true }),
  // ])

  const kpiCards = await getKpiCards();
  const recentTasks = await getRecentTasks(5);
  const agentActivities = await getAgentActivities();

  // Calculate task counts by status
  const taskCountByStatus: Record<string, number> = {
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
    blocked: 0,
  };
  mockTasks.forEach((task) => {
    taskCountByStatus[task.status]++;
  });

  // Calculate project counts by status
  const projectCountByStatus: Record<string, number> = {
    intake: 0,
    in_review: 0,
    revision: 0,
    approved: 0,
    issued: 0,
    on_hold: 0,
    rejected: 0,
  };
  mockProjects.forEach((project) => {
    projectCountByStatus[project.status]++;
  });

  return {
    kpiCards,
    recentTasks,
    agentActivities,
    taskCountByStatus,
    projectCountByStatus,
  };
}
