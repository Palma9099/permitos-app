// Project status
export type ProjectStatus = "intake" | "in_review" | "revision" | "approved" | "issued" | "on_hold" | "rejected";

// Permit types
export type PermitType = "building" | "electrical" | "mechanical" | "plumbing" | "demolition" | "roofing" | "fire_alarm" | "sign";

// Task priority
export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue" | "blocked";

// Agent activity types
export type AgentActivityType = "research" | "revision" | "submission" | "preparation" | "analysis";
export type AgentActivityStatus = "completed" | "in_progress" | "queued";

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  jurisdiction: string;
  status: ProjectStatus;
  permitType: PermitType;
  assignee: TeamMember;
  contractor: string;
  architect: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  approvedAt: string | null;
  estimatedApproval: string | null;
  commentRounds: number;
  totalTasks: number;
  completedTasks: number;
  value: number; // project value in dollars
}

export interface Permit {
  id: string;
  projectId: string;
  type: PermitType;
  number: string | null;
  status: ProjectStatus;
  submittedAt: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  fees: number;
}

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: TeamMember;
  dueDate: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  initials: string;
}

export interface AgentActivity {
  id: string;
  type: AgentActivityType;
  title: string;
  description: string;
  status: AgentActivityStatus;
  projectCount: number;
  progress: number; // 0-100
}

export interface KpiCard {
  title: string;
  value: number;
  change: number; // percentage
  changeLabel: string;
  trend: "up" | "down";
}

export interface TimeByPartyData {
  month: string;
  contractor: number;
  subcontractor: number;
  architect: number;
  owner: number;
  ahj: number;
}

export interface ApprovalTimeData {
  month: string;
  days: number;
}

export interface CommentRoundsData {
  month: string;
  rounds: number;
}
