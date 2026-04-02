import { z } from "zod";

// ─── Project Schemas ───────────────────────────────────────

export const projectStatusValues = [
  "INTAKE",
  "DRAFTING",
  "INTERNAL_REVIEW",
  "SUBMITTED",
  "IN_REVIEW",
  "REVISION",
  "APPROVED",
  "ISSUED",
  "CLOSED",
] as const;

export const permitTypeValues = [
  "BUILDING",
  "ELECTRICAL",
  "MECHANICAL",
  "PLUMBING",
  "ROOFING",
  "DEMOLITION",
  "FENCE",
  "FIRE",
  "SITE_WORK",
  "OTHER",
] as const;

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(200),
  address: z.string().min(5, "Address is required"),
  city: z.string().optional(),
  state: z.string().default("FL"),
  zip: z.string().optional(),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  permitType: z.enum(permitTypeValues).default("BUILDING"),
  value: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string(),
  status: z.enum(projectStatusValues).optional(),
  progress: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ─── Task Schemas ──────────────────────────────────────────

export const taskStatusValues = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"] as const;
export const taskPriorityValues = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const createTaskSchema = z.object({
  title: z.string().min(2, "Task title is required").max(200),
  description: z.string().optional(),
  priority: z.enum(taskPriorityValues).default("MEDIUM"),
  dueDate: z.coerce.date().optional(),
  projectId: z.string().min(1, "Project is required"),
  assigneeId: z.string().optional(),
});

export const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(taskStatusValues).optional(),
  priority: z.enum(taskPriorityValues).optional(),
  dueDate: z.coerce.date().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// ─── Permit Schemas ────────────────────────────────────────

export const permitStatusValues = [
  "PENDING",
  "SUBMITTED",
  "IN_REVIEW",
  "CORRECTIONS_REQUIRED",
  "APPROVED",
  "ISSUED",
  "EXPIRED",
  "DENIED",
  "WITHDRAWN",
] as const;

export const createPermitSchema = z.object({
  projectId: z.string(),
  type: z.enum(permitTypeValues),
  permitNumber: z.string().optional(),
  fees: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export const updatePermitSchema = z.object({
  id: z.string(),
  status: z.enum(permitStatusValues).optional(),
  permitNumber: z.string().optional(),
  fees: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export type CreatePermitInput = z.infer<typeof createPermitSchema>;
export type UpdatePermitInput = z.infer<typeof updatePermitSchema>;

// ─── Document Schemas ──────────────────────────────────────

export const documentTypeValues = [
  "PLANS",
  "CALCULATIONS",
  "SURVEY",
  "NOC",
  "PRODUCT_APPROVAL",
  "APPLICATION",
  "COMMENT_LETTER",
  "REVISION",
  "PHOTO",
  "CONTRACT",
  "REPORT",
  "OTHER",
] as const;

export const documentStatusValues = [
  "DRAFT",
  "PENDING_REVIEW",
  "APPROVED",
  "REJECTED",
] as const;

export const documentStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const requiredDocumentsByPermitType: Record<string, string[]> = {
  BUILDING: [
    "PLANS",
    "CALCULATIONS",
    "SURVEY",
    "NOC",
    "PRODUCT_APPROVAL",
    "APPLICATION",
  ],
  ELECTRICAL: ["PLANS", "CALCULATIONS", "APPLICATION"],
  MECHANICAL: ["PLANS", "CALCULATIONS", "APPLICATION"],
  PLUMBING: ["PLANS", "APPLICATION"],
  ROOFING: ["PLANS", "PRODUCT_APPROVAL", "NOC", "APPLICATION"],
};

export const createDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  type: z.enum(documentTypeValues).default("OTHER"),
  projectId: z.string(),
  status: z.enum(documentStatusValues).default("DRAFT"),
  url: z.string().url().optional(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

// ─── Workflow Transitions ──────────────────────────────────

// Valid status transitions for projects
export const projectTransitions: Record<string, string[]> = {
  INTAKE: ["DRAFTING", "CLOSED"],
  DRAFTING: ["INTERNAL_REVIEW", "INTAKE", "CLOSED"],
  INTERNAL_REVIEW: ["SUBMITTED", "DRAFTING", "CLOSED"],
  SUBMITTED: ["IN_REVIEW", "CLOSED"],
  IN_REVIEW: ["REVISION", "APPROVED", "CLOSED"],
  REVISION: ["INTERNAL_REVIEW", "IN_REVIEW", "CLOSED"],
  APPROVED: ["ISSUED", "CLOSED"],
  ISSUED: ["CLOSED"],
  CLOSED: ["INTAKE"], // reopen
};

export function canTransitionTo(currentStatus: string, newStatus: string): boolean {
  return projectTransitions[currentStatus]?.includes(newStatus) ?? false;
}

// Human-readable status labels
export const projectStatusLabels: Record<string, string> = {
  INTAKE: "Intake",
  DRAFTING: "Drafting",
  INTERNAL_REVIEW: "Internal Review",
  SUBMITTED: "Submitted",
  IN_REVIEW: "In Review",
  REVISION: "Revision",
  APPROVED: "Approved",
  ISSUED: "Issued",
  CLOSED: "Closed",
};

export const permitTypeLabels: Record<string, string> = {
  BUILDING: "Building",
  ELECTRICAL: "Electrical",
  MECHANICAL: "Mechanical",
  PLUMBING: "Plumbing",
  ROOFING: "Roofing",
  DEMOLITION: "Demolition",
  FENCE: "Fence",
  FIRE: "Fire",
  SITE_WORK: "Site Work",
  OTHER: "Other",
};

export const taskStatusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  DONE: "Done",
};

export const taskPriorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};
