// Data access layer - Single import point for components
// Re-exports all service modules
//
// Usage in components:
//   import { getProjects, getTaskById, getDashboardSummary } from "@/lib/data";
//
// This abstraction allows swapping mock implementations with Prisma queries
// by only modifying the service files in this directory, not the components.

// Projects
export {
  getProjects,
  getProjectById,
  getProjectPermits,
  getProjectCount,
  type ProjectFilters,
} from "./projects";

// Tasks
export {
  getTasks,
  getTaskById,
  getOverdueTasks,
  getTaskCount,
  getTasksByStatus,
  type TaskFilters,
} from "./tasks";

// Dashboard
export {
  getKpiCards,
  getTimeByPartyData,
  getApprovalTimeData,
  getCommentRoundsData,
  getAgentActivities,
  getRecentTasks,
  getDashboardSummary,
  type DashboardSummary,
} from "./dashboard";

// Team
export {
  getTeamMembers,
  getTeamMemberById,
  getCurrentUser,
  getTeamMemberByEmail,
  getTeamMemberCount,
} from "./team";

// Organization
export {
  getCurrentOrganization,
  getOrganizationById,
  getOrganizationBySlug,
} from "./organization";
