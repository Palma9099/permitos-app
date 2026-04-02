"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth, getOrCreateDbUser } from "@/lib/auth";
import {
  createProjectSchema,
  updateProjectSchema,
  canTransitionTo,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "@/lib/validations";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Create a new project
 * Validates input with Zod and handles both mock and database modes
 */
export async function createProject(input: CreateProjectInput): Promise<ActionResult> {
  try {
    await requireAuth();
    const parsed = createProjectSchema.safeParse(input);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return {
        success: false,
        error: firstError?.message ?? "Invalid input provided",
      };
    }

    // Mock mode: return success with generated ID
    if (!db) {
      return {
        success: true,
        data: { id: `proj-${Date.now()}` },
      };
    }

    const user = await getOrCreateDbUser();
    if (!user) {
      return { success: false, error: "User not found or creation failed" };
    }

    const project = await db.project.create({
      data: {
        name: parsed.data.name,
        address: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state,
        zip: parsed.data.zip,
        jurisdiction: parsed.data.jurisdiction,
        permitType: parsed.data.permitType,
        value: parsed.data.value,
        description: parsed.data.description,
        status: "INTAKE",
        progress: 0,
        organizationId: user.organizationId ?? "",
        assigneeId: parsed.data.assigneeId ?? user.id,
      },
    });

    revalidatePath("/projects");
    return {
      success: true,
      data: { id: project.id },
    };
  } catch (error) {
    console.error("[createProject] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to create project. Please try again.",
    };
  }
}

/**
 * Update an existing project
 * Validates status transitions and input with Zod
 */
export async function updateProject(input: UpdateProjectInput): Promise<ActionResult> {
  try {
    await requireAuth();
    const parsed = updateProjectSchema.safeParse(input);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return {
        success: false,
        error: firstError?.message ?? "Invalid input provided",
      };
    }

    const { id, ...data } = parsed.data;

    // Mock mode: return success
    if (!db) {
      return {
        success: true,
        data: { id },
      };
    }

    // Validate status transition if status is changing
    if (data.status) {
      const current = await db.project.findUnique({
        where: { id },
        select: { status: true },
      });

      if (!current) {
        return { success: false, error: "Project not found" };
      }

      if (!canTransitionTo(current.status, data.status)) {
        return {
          success: false,
          error: `Cannot transition from ${current.status} to ${data.status}`,
        };
      }

      // Auto-set submittedAt when transitioning to SUBMITTED
      if (data.status === "SUBMITTED" && current.status !== "SUBMITTED") {
        (data as any).submittedAt = new Date();
      }

      // Auto-set approvedAt when transitioning to APPROVED
      if (data.status === "APPROVED" && current.status !== "APPROVED") {
        (data as any).approvedAt = new Date();
      }

      // Auto-set issuedAt when transitioning to ISSUED
      if (data.status === "ISSUED" && current.status !== "ISSUED") {
        (data as any).issuedAt = new Date();
      }

      // Auto-set closedAt when transitioning to CLOSED
      if (data.status === "CLOSED" && current.status !== "CLOSED") {
        (data as any).closedAt = new Date();
      }
    }

    const project = await db.project.update({
      where: { id },
      data,
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    return {
      success: true,
      data: { id: project.id },
    };
  } catch (error) {
    console.error("[updateProject] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to update project. Please try again.",
    };
  }
}

/**
 * Delete a project
 * Cascading deletes are handled by database constraints
 */
export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAuth();

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid project ID" };
    }

    // Mock mode: return success
    if (!db) {
      return { success: true };
    }

    await db.project.delete({
      where: { id },
    });

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("[deleteProject] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to delete project. Please try again.",
    };
  }
}

/**
 * Transition a project to a new status
 * Convenience wrapper around updateProject
 */
export async function transitionProjectStatus(
  id: string,
  newStatus: string
): Promise<ActionResult> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid project ID" };
  }

  if (!newStatus || typeof newStatus !== "string") {
    return { success: false, error: "Invalid status" };
  }

  return updateProject({
    id,
    status: newStatus as any,
  });
}

/**
 * Fetch a single project (for client components)
 * Note: This reads from db directly; consider moving to a dedicated query function
 */
export async function getProject(id: string) {
  try {
    await requireAuth();

    if (!db) {
      return null;
    }

    const project = await db.project.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        tasks: {
          select: { id: true, title: true, status: true },
        },
        permits: {
          select: { id: true, type: true, status: true },
        },
        documents: {
          select: { id: true, name: true, type: true, url: true },
        },
      },
    });

    return project;
  } catch (error) {
    console.error("[getProject] Unexpected error:", error);
    return null;
  }
}
