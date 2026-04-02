import { ProjectStatus, TaskPriority, TaskStatus } from "./types";

/**
 * Format a number as USD currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a date string to a human-readable format
 * Input: "2026-03-15" or ISO string
 * Output: "Mar 15, 2026"
 */
export function formatDate(date: string): string {
  if (!date) return "";
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Format a date relative to now
 * Input: "2026-03-15"
 * Output: "2 days ago", "in 3 days", "today", "tomorrow", "yesterday"
 */
export function formatRelativeDate(date: string): string {
  if (!date) return "";

  const dateObj = new Date(date);
  const now = new Date();

  // Normalize to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";
  if (diffDays > 0) return `in ${diffDays} days`;
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

  return formatDate(date);
}

/**
 * Get Tailwind color classes for project status
 */
export function getStatusColor(status: ProjectStatus): string {
  const colorMap: Record<ProjectStatus, string> = {
    intake: "bg-gray-100 text-gray-800",
    in_review: "bg-blue-100 text-blue-800",
    revision: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    issued: "bg-emerald-100 text-emerald-800",
    on_hold: "bg-orange-100 text-orange-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colorMap[status];
}

/**
 * Get human-readable label for project status
 */
export function getStatusLabel(status: ProjectStatus): string {
  const labelMap: Record<ProjectStatus, string> = {
    intake: "Intake",
    in_review: "In Review",
    revision: "Revision",
    approved: "Approved",
    issued: "Issued",
    on_hold: "On Hold",
    rejected: "Rejected",
  };
  return labelMap[status];
}

/**
 * Get Tailwind color classes for task priority
 */
export function getPriorityColor(priority: TaskPriority): string {
  const colorMap: Record<TaskPriority, string> = {
    urgent: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };
  return colorMap[priority];
}

/**
 * Get human-readable label for task priority
 */
export function getPriorityLabel(priority: TaskPriority): string {
  const labelMap: Record<TaskPriority, string> = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return labelMap[priority];
}

/**
 * Get Tailwind color classes for task status
 */
export function getTaskStatusColor(status: TaskStatus): string {
  const colorMap: Record<TaskStatus, string> = {
    pending: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    blocked: "bg-orange-100 text-orange-800",
  };
  return colorMap[status];
}

/**
 * Get human-readable label for task status
 */
export function getTaskStatusLabel(status: TaskStatus): string {
  const labelMap: Record<TaskStatus, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    overdue: "Overdue",
    blocked: "Blocked",
  };
  return labelMap[status];
}

/**
 * Get icon name for project status
 */
export function getStatusIcon(status: ProjectStatus): string {
  const iconMap: Record<ProjectStatus, string> = {
    intake: "inbox",
    in_review: "clock",
    revision: "edit",
    approved: "check-circle",
    issued: "award",
    on_hold: "pause-circle",
    rejected: "x-circle",
  };
  return iconMap[status];
}

/**
 * Get icon name for task status
 */
export function getTaskStatusIcon(status: TaskStatus): string {
  const iconMap: Record<TaskStatus, string> = {
    pending: "circle",
    in_progress: "loader",
    completed: "check-circle",
    overdue: "alert-circle",
    blocked: "lock",
  };
  return iconMap[status];
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format a percentage with one decimal place
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
