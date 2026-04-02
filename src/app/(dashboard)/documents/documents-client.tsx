"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Calculator,
  Map,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteDocument, bulkDeleteDocuments } from "@/lib/actions/documents";

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  size: number;
  projectId: string;
  projectName: string;
  createdAt: Date;
  uploadedBy?: {
    id: string;
    name: string;
  } | null;
}

interface DocumentsPageClientProps {
  documents: Document[];
  projects: Array<{
    id: string;
    name: string;
    permitType: string;
  }>;
}

const documentTypeColors: Record<string, string> = {
  PLANS: "bg-blue-50 text-blue-700 border-blue-200",
  CALCULATIONS: "bg-purple-50 text-purple-700 border-purple-200",
  SURVEY: "bg-green-50 text-green-700 border-green-200",
  COMMENT_LETTER: "bg-orange-50 text-orange-700 border-orange-200",
  PRODUCT_APPROVAL: "bg-teal-50 text-teal-700 border-teal-200",
  NOC: "bg-indigo-50 text-indigo-700 border-indigo-200",
  APPLICATION: "bg-cyan-50 text-cyan-700 border-cyan-200",
  REVISION: "bg-pink-50 text-pink-700 border-pink-200",
  PHOTO: "bg-amber-50 text-amber-700 border-amber-200",
  CONTRACT: "bg-slate-50 text-slate-700 border-slate-200",
  REPORT: "bg-lime-50 text-lime-700 border-lime-200",
  OTHER: "bg-gray-100 text-gray-700 border-gray-200",
};

const documentTypeLabels: Record<string, string> = {
  PLANS: "Plans",
  CALCULATIONS: "Calculations",
  SURVEY: "Survey",
  COMMENT_LETTER: "Comment Letter",
  PRODUCT_APPROVAL: "Product Approval",
  NOC: "NOC",
  APPLICATION: "Application",
  REVISION: "Revision",
  PHOTO: "Photo",
  CONTRACT: "Contract",
  REPORT: "Report",
  OTHER: "Other",
};

const documentStatusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  PENDING_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const documentStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

function getDocumentIcon(type: string) {
  switch (type) {
    case "PLANS":
      return <FileText className="h-4 w-4" />;
    case "CALCULATIONS":
      return <Calculator className="h-4 w-4" />;
    case "SURVEY":
      return <Map className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "APPROVED":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "PENDING_REVIEW":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "DRAFT":
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
    default:
      return null;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DocumentsPageClient({
  documents: initialDocuments,
  projects,
}: DocumentsPageClientProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.projectName.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || doc.type === typeFilter;
      const matchesProject =
        projectFilter === "all" || doc.projectId === projectFilter;
      return matchesSearch && matchesType && matchesProject;
    });
  }, [documents, search, typeFilter, projectFilter]);

  const uniqueTypes = Array.from(new Set(documents.map((d) => d.type))).sort();

  const handleToggleSelectDoc = (docId: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDocs.size === filteredDocuments.length) {
      setSelectedDocs(new Set());
    } else {
      const allIds = new Set(filteredDocuments.map((d) => d.id));
      setSelectedDocs(allIds);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this document? This action cannot be undone."
      )
    ) {
      const result = await deleteDocument(docId);
      if (result.success) {
        setDocuments(documents.filter((d) => d.id !== docId));
        setSelectedDocs(
          (prev) => new Set([...prev].filter((id) => id !== docId))
        );
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDocs.size === 0) return;

    const docCount = selectedDocs.size;
    if (
      confirm(
        `Are you sure you want to delete ${docCount} document${docCount !== 1 ? "s" : ""}? This action cannot be undone.`
      )
    ) {
      setIsDeleting(true);
      const result = await bulkDeleteDocuments(Array.from(selectedDocs));
      setIsDeleting(false);

      if (result.success) {
        setDocuments(documents.filter((d) => !selectedDocs.has(d.id)));
        setSelectedDocs(new Set());
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-gray-600">
            {documents.length} document{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700"
          disabled
          title="Coming Soon"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedDocs.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <span className="flex-1 text-sm font-medium text-blue-900">
            {selectedDocs.size} document{selectedDocs.size !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedDocs(new Set())}
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by document name or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {documentTypeLabels[type] || type}
            </option>
          ))}
        </select>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All Projects</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={
                    filteredDocuments.length > 0 &&
                    selectedDocs.size === filteredDocuments.length
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Project
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Size
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Uploaded
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  className={`hover:bg-gray-50 ${
                    selectedDocs.has(doc.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDocs.has(doc.id)}
                      onChange={() => handleToggleSelectDoc(doc.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <span className="font-medium text-gray-900 truncate max-w-xs">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-xs sm:text-sm truncate max-w-xs">
                      {doc.projectName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={documentTypeColors[doc.type]}
                    >
                      {documentTypeLabels[doc.type] || doc.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={documentStatusColors[doc.status]}
                    >
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(doc.status)}
                        <span>
                          {documentStatusLabels[doc.status] || doc.status}
                        </span>
                      </div>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {formatFileSize(doc.size)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {formatDate(doc.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Download document"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  {documents.length === 0 ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-300" />
                      <p className="font-medium">No documents yet</p>
                      <p className="text-xs text-gray-400">
                        Upload documents to get started
                      </p>
                    </div>
                  ) : (
                    <p>No documents matching your filters</p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredDocuments.length > 0 && (
        <p className="text-sm text-gray-600">
          Showing {filteredDocuments.length} of {documents.length} documents
        </p>
      )}
    </div>
  );
}
