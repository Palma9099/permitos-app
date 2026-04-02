"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createPermitSchema, updatePermitSchema, type CreatePermitInput, type UpdatePermitInput } from "@/lib/validations";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Create a new permit
 */
export async function createPermit(input: CreatePermitInput): Promise<ActionResult> {
  try {
    const parsed = createPermitSchema.safeParse(input);

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
        data: { id: `perm-${Date.now()}` },
      };
    }

    const permit = await db.permit.create({
      data: {
        projectId: parsed.data.projectId,
        type: parsed.data.type,
        permitNumber: parsed.data.permitNumber,
        fees: parsed.data.fees ?? 0,
        notes: parsed.data.notes,
        status: "PENDING",
      },
    });

    revalidatePath(`/projects/${parsed.data.projectId}`);
    return {
      success: true,
      data: { id: permit.id },
    };
  } catch (error) {
    console.error("[createPermit] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to create permit. Please try again.",
    };
  }
}

/**
 * Update permit status
 */
export async function updatePermitStatus(id: string, status: string, projectId?: string): Promise<ActionResult> {
  try {
    // Mock mode: return success
    if (!db) {
      if (projectId) {
        revalidatePath(`/projects/${projectId}`);
      }
      return {
        success: true,
        data: { id },
      };
    }

    const permit = await db.permit.update({
      where: { id },
      data: { status },
    });

    if (permit.projectId) {
      revalidatePath(`/projects/${permit.projectId}`);
    }
    return {
      success: true,
      data: permit,
    };
  } catch (error) {
    console.error("[updatePermitStatus] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to update permit status. Please try again.",
    };
  }
}

/**
 * Update permit
 */
export async function updatePermit(input: UpdatePermitInput): Promise<ActionResult> {
  try {
    const parsed = updatePermitSchema.safeParse(input);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return {
        success: false,
        error: firstError?.message ?? "Invalid input provided",
      };
    }

    // Mock mode: return success
    if (!db) {
      return {
        success: true,
        data: input,
      };
    }

    const updateData: any = {};
    if (parsed.data.status) updateData.status = parsed.data.status;
    if (parsed.data.permitNumber !== undefined) updateData.permitNumber = parsed.data.permitNumber;
    if (parsed.data.fees !== undefined) updateData.fees = parsed.data.fees;
    if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;

    const permit = await db.permit.update({
      where: { id: parsed.data.id },
      data: updateData,
    });

    if (permit.projectId) {
      revalidatePath(`/projects/${permit.projectId}`);
    }
    return {
      success: true,
      data: permit,
    };
  } catch (error) {
    console.error("[updatePermit] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to update permit. Please try again.",
    };
  }
}

/**
 * Delete permit
 */
export async function deletePermit(id: string, projectId?: string): Promise<ActionResult> {
  try {
    // Mock mode: return success
    if (!db) {
      if (projectId) {
        revalidatePath(`/projects/${projectId}`);
      }
      return {
        success: true,
        data: { id },
      };
    }

    const permit = await db.permit.delete({
      where: { id },
    });

    if (permit.projectId) {
      revalidatePath(`/projects/${permit.projectId}`);
    }
    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    console.error("[deletePermit] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to delete permit. Please try again.",
    };
  }
}
