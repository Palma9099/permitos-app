import { db } from "@/lib/db";

export interface DocumentFilters {
  projectId?: string;
  type?: string;
}

const mockDocuments = [
  { id: "doc-1", name: "Structural Plans v3.pdf", type: "PLANS", projectId: "proj-1", size: 4500000, mimeType: "application/pdf", url: null, key: null, version: 3, uploadedById: "user-1", createdAt: new Date("2026-01-15"), updatedAt: new Date("2026-01-15") },
  { id: "doc-2", name: "Wind Load Calculations.pdf", type: "CALCULATIONS", projectId: "proj-1", size: 1200000, mimeType: "application/pdf", url: null, key: null, version: 1, uploadedById: "user-1", createdAt: new Date("2026-01-10"), updatedAt: new Date("2026-01-10") },
  { id: "doc-3", name: "Survey Report.pdf", type: "SURVEY", projectId: "proj-2", size: 3200000, mimeType: "application/pdf", url: null, key: null, version: 1, uploadedById: "user-2", createdAt: new Date("2026-02-01"), updatedAt: new Date("2026-02-01") },
  { id: "doc-4", name: "NOC Letter - Miami.pdf", type: "NOC", projectId: "proj-3", size: 800000, mimeType: "application/pdf", url: null, key: null, version: 1, uploadedById: "user-1", createdAt: new Date("2026-02-15"), updatedAt: new Date("2026-02-15") },
  { id: "doc-5", name: "Product Approval - TAS 201.pdf", type: "PRODUCT_APPROVAL", projectId: "proj-1", size: 2100000, mimeType: "application/pdf", url: null, key: null, version: 1, uploadedById: "user-3", createdAt: new Date("2026-01-20"), updatedAt: new Date("2026-01-20") },
  { id: "doc-6", name: "Comment Letter Round 2.pdf", type: "COMMENT_LETTER", projectId: "proj-3", size: 950000, mimeType: "application/pdf", url: null, key: null, version: 1, uploadedById: null, createdAt: new Date("2026-03-01"), updatedAt: new Date("2026-03-01") },
];

export async function getDocuments(filters?: DocumentFilters) {
  if (!db) {
    let results = [...mockDocuments];
    if (filters?.projectId) results = results.filter((d) => d.projectId === filters.projectId);
    if (filters?.type && filters.type !== "all") results = results.filter((d) => d.type === filters.type);
    return results;
  }

  const where: any = {};
  if (filters?.projectId) where.projectId = filters.projectId;
  if (filters?.type && filters.type !== "all") where.type = filters.type;

  return db.document.findMany({
    where,
    include: { uploadedBy: true, project: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocumentById(id: string) {
  if (!db) {
    return mockDocuments.find((d) => d.id === id) || null;
  }

  return db.document.findUnique({
    where: { id },
    include: { uploadedBy: true, project: { select: { name: true } } },
  });
}

export async function getDocumentCount(projectId?: string) {
  if (!db) {
    return projectId
      ? mockDocuments.filter((d) => d.projectId === projectId).length
      : mockDocuments.length;
  }

  return db.document.count({
    where: projectId ? { projectId } : undefined,
  });
}
