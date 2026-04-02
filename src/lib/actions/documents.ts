"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth, getOrCreateDbUser } from "@/lib/auth";
import { createDocumentSchema, type CreateDocumentInput } from "@/lib/validations";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Create a new document record
 * Validates input with Zod and handles both mock and database modes
 * Note: File storage (S3/R2) should be handled separately before calling this
 */
export async function createDocument(input: CreateDocumentInput): Promise<ActionResult> {
  try {
    await requireAuth();
    const parsed = createDocumentSchema.safeParse(input);

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
        data: { id: `doc-${Date.now()}` },
      };
    }

    const user = await getOrCreateDbUser();
    if (!user) {
      return { success: false, error: "User not found or creation failed" };
    }

    const doc = await db.document.create({
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        projectId: parsed.data.projectId,
        url: parsed.data.url,
        size: parsed.data.size,
        mimeType: parsed.data.mimeType,
        uploadedById: user.id,
      },
    });

    revalidatePath("/documents");
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return {
      success: true,
      data: { id: doc.id },
    };
  } catch (error) {
    console.error("[createDocument] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to create document. Please try again.",
    };
  }
}

/**
 * Delete a document record
 * Assumes file storage cleanup is handled by a separate service
 */
export async function deleteDocument(id: string): Promise<ActionResult> {
  try {
    await requireAuth();

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid document ID" };
    }

    // Mock mode: return success
    if (!db) {
      return { success: true };
    }

    const doc = await db.document.findUnique({
      where: { id },
      select: { projectId: true, key: true, url: true },
    });

    if (!doc) {
      return { success: false, error: "Document not found" };
    }

    // TODO: Delete from S3/R2 storage using doc.key or doc.url
    // This should be implemented in a separate storage service
    // Example:
    // if (doc.key) {
    //   await deleteFromStorage(doc.key);
    // }

    await db.document.delete({
      where: { id },
    });

    revalidatePath("/documents");
    revalidatePath(`/projects/${doc.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteDocument] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to delete document. Please try again.",
    };
  }
}

/**
 * Bulk delete documents
 * Cascades deletion to associated records as configured in database
 */
export async function bulkDeleteDocuments(ids: string[]): Promise<ActionResult> {
  try {
    await requireAuth();

    if (!Array.isArray(ids) || ids.length === 0) {
      return { success: false, error: "No documents to delete" };
    }

    // Validate all IDs are strings
    if (!ids.every((id) => typeof id === "string")) {
      return { success: false, error: "Invalid document IDs" };
    }

    // Mock mode: return success
    if (!db) {
      return { success: true };
    }

    const docs = await db.document.findMany({
      where: { id: { in: ids } },
      select: { id: true, projectId: true, key: true },
    });

    if (docs.length === 0) {
      return { success: false, error: "No documents found" };
    }

    // TODO: Batch delete from S3/R2 storage
    // const keysToDelete = docs.map((d) => d.key).filter(Boolean);
    // if (keysToDelete.length > 0) {
    //   await deleteMultipleFromStorage(keysToDelete);
    // }

    await db.document.deleteMany({
      where: { id: { in: ids } },
    });

    const projectIds = new Set(docs.map((d: any) => d.projectId));
    revalidatePath("/documents");
    projectIds.forEach((projectId) => {
      revalidatePath(`/projects/${projectId}`);
    });

    return { success: true };
  } catch (error) {
    console.error("[bulkDeleteDocuments] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to delete documents. Please try again.",
    };
  }
}

/**
 * Update document metadata (name, type only)
 * Storage operations should not be done here
 */
export async function updateDocumentMetadata(
  id: string,
  updates: { name?: string; type?: string }
): Promise<ActionResult> {
  try {
    await requireAuth();

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid document ID" };
    }

    if (!updates || Object.keys(updates).length === 0) {
      return { success: false, error: "No updates provided" };
    }

    // Mock mode: return success
    if (!db) {
      return { success: true, data: { id } };
    }

    const doc = await db.document.findUnique({
      where: { id },
      select: { projectId: true },
    });

    if (!doc) {
      return { success: false, error: "Document not found" };
    }

    const updated = await db.document.update({
      where: { id },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.type && { type: updates.type }),
      },
    });

    revalidatePath("/documents");
    revalidatePath(`/projects/${doc.projectId}`);
    return {
      success: true,
      data: { id: updated.id },
    };
  } catch (error) {
    console.error("[updateDocumentMetadata] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to update document. Please try again.",
    };
  }
}

/**
 * Get document by ID
 * For client-side fetching (consider using queries instead)
 */
export async function getDocument(id: string) {
  try {
    await requireAuth();

    if (!db) {
      return null;
    }

    const doc = await db.document.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    return doc;
  } catch (error) {
    console.error("[getDocument] Unexpected error:", error);
    return null;
  }
}

/**
 * Get all documents for a project
 * For client-side fetching (consider using queries instead)
 */
export async function getProjectDocuments(projectId: string) {
  try {
    await requireAuth();

    if (!projectId || typeof projectId !== "string") {
      return [];
    }

    if (!db) {
      return [];
    }

    const docs = await db.document.findMany({
      where: { projectId },
      include: {
        uploadedBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return docs;
  } catch (error) {
    console.error("[getProjectDocuments] Unexpected error:", error);
    return [];
  }
}
