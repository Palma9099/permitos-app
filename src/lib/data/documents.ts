import { db } from "@/lib/db";

export interface DocumentFilters {
  projectId?: string;
  type?: string;
}

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

const mockDocuments = [
  {
    id: "doc-1",
    name: "Structural Plans v3.pdf",
    type: "PLANS",
    projectId: "proj-1",
    projectName: "Brickell Luxury Condo Tower",
    size: 4500000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 3,
    status: "APPROVED",
    uploadedById: "user-1",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-03-10"),
  },
  {
    id: "doc-2",
    name: "Wind Load Calculations.pdf",
    type: "CALCULATIONS",
    projectId: "proj-1",
    projectName: "Brickell Luxury Condo Tower",
    size: 1200000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 2,
    status: "APPROVED",
    uploadedById: "user-1",
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-02-20"),
  },
  {
    id: "doc-3",
    name: "Topographic Survey Report.pdf",
    type: "SURVEY",
    projectId: "proj-2",
    projectName: "Wynwood Arts District Mixed-Use",
    size: 3200000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "PENDING_REVIEW",
    uploadedById: "user-2",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
  {
    id: "doc-4",
    name: "NOC Letter - City of Miami.pdf",
    type: "NOC",
    projectId: "proj-3",
    projectName: "Fort Lauderdale Beach Residential",
    size: 800000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "APPROVED",
    uploadedById: "user-1",
    createdAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-03-05"),
  },
  {
    id: "doc-5",
    name: "Product Approval - TAS 201 Hurricane Clips.pdf",
    type: "PRODUCT_APPROVAL",
    projectId: "proj-1",
    projectName: "Brickell Luxury Condo Tower",
    size: 2100000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "APPROVED",
    uploadedById: "user-3",
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-02-10"),
  },
  {
    id: "doc-6",
    name: "Department Comments Round 2.pdf",
    type: "COMMENT_LETTER",
    projectId: "proj-3",
    projectName: "Fort Lauderdale Beach Residential",
    size: 950000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 2,
    status: "APPROVED",
    uploadedById: null,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
  {
    id: "doc-7",
    name: "Building Permit Application Form.pdf",
    type: "APPLICATION",
    projectId: "proj-1",
    projectName: "Brickell Luxury Condo Tower",
    size: 850000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "APPROVED",
    uploadedById: "user-1",
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-03-15"),
  },
  {
    id: "doc-8",
    name: "Electrical Plans - MEP Systems.pdf",
    type: "PLANS",
    projectId: "proj-5",
    projectName: "Hialeah Industrial Complex",
    size: 2800000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 2,
    status: "PENDING_REVIEW",
    uploadedById: "user-2",
    createdAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-03-20"),
  },
  {
    id: "doc-9",
    name: "Electrical Load Calculations.pdf",
    type: "CALCULATIONS",
    projectId: "proj-5",
    projectName: "Hialeah Industrial Complex",
    size: 1450000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "DRAFT",
    uploadedById: "user-3",
    createdAt: new Date("2026-02-20"),
    updatedAt: new Date("2026-02-20"),
  },
  {
    id: "doc-10",
    name: "Electrical Permit Application.pdf",
    type: "APPLICATION",
    projectId: "proj-5",
    projectName: "Hialeah Industrial Complex",
    size: 620000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "PENDING_REVIEW",
    uploadedById: "user-1",
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-03-10"),
  },
  {
    id: "doc-11",
    name: "Mechanical Plans - HVAC Design.pdf",
    type: "PLANS",
    projectId: "proj-6",
    projectName: "Pembroke Pines Shopping Center",
    size: 3100000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "DRAFT",
    uploadedById: "user-4",
    createdAt: new Date("2026-03-22"),
    updatedAt: new Date("2026-03-22"),
  },
  {
    id: "doc-12",
    name: "Mechanical Calc Package v2.pdf",
    type: "CALCULATIONS",
    projectId: "proj-6",
    projectName: "Pembroke Pines Shopping Center",
    size: 1850000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 2,
    status: "DRAFT",
    uploadedById: "user-2",
    createdAt: new Date("2026-03-18"),
    updatedAt: new Date("2026-03-25"),
  },
  {
    id: "doc-13",
    name: "Roofing Product Certifications.pdf",
    type: "PRODUCT_APPROVAL",
    projectId: "proj-4",
    projectName: "Coral Gables Historic Renovation",
    size: 1600000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "APPROVED",
    uploadedById: "user-3",
    createdAt: new Date("2026-01-25"),
    updatedAt: new Date("2026-02-15"),
  },
  {
    id: "doc-14",
    name: "Historic Preservation NOC.pdf",
    type: "NOC",
    projectId: "proj-4",
    projectName: "Coral Gables Historic Renovation",
    size: 920000,
    mimeType: "application/pdf",
    url: null,
    key: null,
    version: 1,
    status: "APPROVED",
    uploadedById: "user-1",
    createdAt: new Date("2026-02-05"),
    updatedAt: new Date("2026-02-28"),
  },
];

export async function getDocuments(filters?: DocumentFilters) {
  if (!db) {
    let results = [...mockDocuments];
    if (filters?.projectId)
      results = results.filter((d) => d.projectId === filters.projectId);
    if (filters?.type && filters.type !== "all")
      results = results.filter((d) => d.type === filters.type);
    return results.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
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
