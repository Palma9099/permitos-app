"use client";

import React, { useState, useMemo } from "react";
import { FileText, Upload, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteDocument } from "@/lib/actions/documents";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  projectId: string;
  createdAt: Date;
  uploadedBy?: {
    id: string;
    name: string;
  } | null;
}

interface DocumentsPageClientProps {
  documents: Document[];
}

const documentTypeColors: Record<string, string> = {
  PLANS: "bg-blue-50 text-blue-700",
  CALCULATIONS: "bg-purple-50 text-purple-700",
  SURVEY: "bg-green-50 text-green-700",
  COMMENT_LETTER: "bg-orange-50 text-orange-700",
  PRODUCT_APPROVAL: "bg-teal-50 text-teal-700",
  NOC: "bg-indigo-50 text-indigo-700",
  APPLICATION: "bg-cyan-50 text-cyan-700",
  REVISION: "bg-pink-50 text-pink-700",
  PHOTO: "bg-amber-50 text-amber-700",
  CONTRACT: "bg-slate-50 text-slate-700",
  REPORT: "bg-lime-50 text-lime-700",
  OTHER: "bg-gray-100 text-gray-700",
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
}: DocumentsPageClientProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || doc.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [documents, search, typeFilter]);

  const uniqueTypes = Array.from(new Set(documents.map((d) => d.type))).sort();

  const handleDeleteDocument = async (docId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this document? This action cannot be undone."
      )
    ) {
      const result = await deleteDocument(docId);
      if (result.success) {
        setDocuments(documents.filter((d) => d.id !== docId));
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
        <Button className="gap-2" disabled title="Storage coming soon">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search documents by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-white"
        >
          <option value="all">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {documentTypeLabels[type] || type}
            </option>
          ))}
        </select>
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Type
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
          <tbody className="divide-y">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <span className="font-medium text-gray-900 truncate">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={documentTypeColors[doc.type] || documentTypeColors.OTHER}>
                      {documentTypeLabels[doc.type] || doc.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatFileSize(doc.size)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
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
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {documents.length === 0 ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-300" />
                      <p>No documents yet</p>
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
