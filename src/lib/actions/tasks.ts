"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth, getOrCreateDbUser } from "@/lib/auth";
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "@/lib/validations";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Create a new task
 * Validates input with Zod and handles both mock and database modes
 */
export async function createTask(input: CreateTaskInput): Promise<ActionResult> {
  try {
    await requireAuth();
    const parsed = createTaskSchema.safeParse(input);

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
        data: { id: `task-${Date.now()}` },
      };
    }

    const user = await getOrCreateDbUser();
    if (!user) {
      return { success: false, error: "User not found or creation failed" };
    }

    const task = await db.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        dueDate: parsed.data.dueDate,
        projectId: parsed.data.projectId,
        status: "TODO",
        assigneeId: parsed.data.assigneeId ?? user.id,
        createdById: user.id,
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return {
      success: true,
      data: { id: task.id },
    };
  } catch (error) {
    console.error("[createTask] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to create task. Please try again.",
    };
  }
}

/**
 * Update an existing task
 * Validates input with Zod
 */
export async function updateTask(input: UpdateTaskInput): Promise<ActionResult> {
  try {
    await requireAuth();
    const parsed = updateTaskSchema.safeParse(input);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return {
        success: false,
        error: firstError?.message ?? "Invalid input provided",
      };
    }

    const { id, ...data } = parsed.data;

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid task ID" };
    }

    // Mock mode: return success
    if (!db) {
      return {
        success: true,
        data: { id },
      };
    }

    // Verify task exists and get projectId
    const existingTask = await db.task.findUnique({
      where: { id },
      select: { projectId: true },
    });

    if (!existingTask) {
      return { success: false, error: "Task not found" };
    }

    // Auto-set completedAt when transitioning to DONE
    if (data.status === "DONE") {
      (data as any).completedAt = new Date();
    }

    const task = await db.task.update({
      where: { id },
      data,
    });

    revalidatePath("/tasks");
    revalidatePath(`/projects/${existingTask.projectId}`);
    return {
      success: true,
      data: { id: task.id },
    };
  } catch (error) {
    console.error("[updateTask] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to update task. Please try again.",
    };
  }
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<ActionResult> {
  try {
    await requireAuth();

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid task ID" };
    }

    // Mock mode: return success
    if (!db) {
      return { success: true };
    }

    const task = await db.task.findUnique({
      where: { id },
      select: { projectId: true },
    });

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    await db.task.delete({
      where: { id },
    });

    revalidatePath("/tasks");
    revalidatePath(`/projects/${task.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteTask] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to delete task. Please try again.",
    };
  }
}

/**
 * Bulk update task statuses
 * Useful for drag-and-drop kanban updates
 */
export async function bulkUpdateTaskStatus(
  updates: Array<{ id: string; status: string }>
): Promise<ActionResult> {
  try {
    await requireAuth();

    if (!Array.isArray(updates) || updates.length === 0) {
      return { success: false, error: "No tasks to update" };
    }

    // Mock mode: return success
    if (!db) {
      return { success: true };
    }

    const projectIds = new Set<string>();

    for (const update of updates) {
      const parsed = updateTaskSchema.safeParse({
        id: update.id,
        status: update.status,
      });

      if (!parsed.success) {
        continue;
      }

      const task = await db.task.findUnique({
        where: { id: update.id },
        select: { projectId: true },
      });

      if (task) {
        projectIds.add(task.projectId);

        const data: any = { status: update.status };
        if (update.status === "DONE") {
          data.completedAt = new Date();
        }

        await db.task.update({
          where: { id: update.id },
          data,
        });
      }
    }

    revalidatePath("/tasks");
    projectIds.forEach((projectId) => {
      revalidatePath(`/projects/${projectId}`);
    });

    return { success: true };
  } catch (error) {
    console.error("[bulkUpdateTaskStatus] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to update tasks. Please try again.",
    };
  }
}

/**
 * Fetch a single task (for client components)
 */
export async function getTask(id: string) {
  try {
    await requireAuth();

    if (!db) {
      return null;
    }

    const task = await db.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true, status: true },
        },
      },
    });

    return task;
  } catch (error) {
    console.error("[getTask] Unexpected error:", error);
    return null;
  }
}
