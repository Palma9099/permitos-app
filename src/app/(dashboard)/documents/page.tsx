"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, FileText, Download } from "lucide-react";

interface Document {
  id: string;
  name: string;
  project: string;
  uploadedDate: string;
  size: string;
  type: "pdf" | "image" | "word" | "spreadsheet";
}

const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Site Plan - 123 Ocean Drive.pdf",
    project: "Brickell Luxury Condo Tower",
    uploadedDate: "2026-03-28",
    size: "4.2 MB",
    type: "pdf",
  },
  {
    id: "doc-2",
    name: "Structural Calculations.pdf",
    project: "Fort Lauderdale Beach Residential",
    uploadedDate: "2026-03-27",
    size: "8.7 MB",
    type: "pdf",
  },
  {
    id: "doc-3",
    name: "FPL Approval Letter.pdf",
    project: "Hialeah Industrial Complex",
    uploadedDate: "2026-03-26",
    size: "2.1 MB",
    type: "pdf",
  },
  {
    id: "doc-4",
    name: "NOC - Miami-Dade.pdf",
    project: "Coral Gables Historic Renovation",
    uploadedDate: "2026-03-25",
    size: "1.8 MB",
    type: "pdf",
  },
  {
    id: "doc-5",
    name: "Permit Application.pdf",
    project: "Wynwood Arts District Mixed-Use",
    uploadedDate: "2026-03-24",
    size: "3.4 MB",
    type: "pdf",
  },
  {
    id: "doc-6",
    name: "Revised Floor Plans.pdf",
    project: "Pembroke Pines Shopping Center",
    uploadedDate: "2026-03-23",
    size: "6.5 MB",
    type: "pdf",
  },
  {
    id: "doc-7",
    name: "Survey Report.pdf",
    project: "Hollywood Oceanfront Condo",
    uploadedDate: "2026-03-22",
    size: "5.3 MB",
    type: "pdf",
  },
  {
    id: "doc-8",
    name: "Foundation Plan.pdf",
    project: "Doral Office Park Expansion",
    uploadedDate: "2026-03-21",
    size: "7.1 MB",
    type: "pdf",
  },
  {
    id: "doc-9",
    name: "Electrical Schematics.pdf",
    project: "Aventura Mall Renovation",
    uploadedDate: "2026-03-20",
    size: "9.2 MB",
    type: "pdf",
  },
  {
    id: "doc-10",
    name: "HVAC Layout Plan.pdf",
    project: "Pinecrest Medical Center",
    uploadedDate: "2026-03-19",
    size: "3.8 MB",
    type: "pdf",
  },
];

const getFileIcon = (type: string) => {
  return <FileText className="h-8 w-8 text-muted-foreground" />;
};

export default function DocumentsPage() {
  const [searchValue, setSearchValue] = useState("");

  const filteredDocuments = useMemo(() => {
    if (!searchValue) return mockDocuments;
    const search = searchValue.toLowerCase();
    return mockDocuments.filter(
      (doc) =>
        doc.name.toLowerCase().includes(search) ||
        doc.project.toLowerCase().includes(search)
    );
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            All project documents and files
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          New Upload
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents by name or project..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold line-clamp-2">
                      {doc.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {doc.project}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4 pb-4">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}</p>
                  <p>Size: {doc.size}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 mt-auto"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed py-12">
            <p className="text-muted-foreground">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
