"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import {
  formatCurrency,
  getStatusColor,
  getStatusLabel,
} from "@/lib/format";
import { ArrowLeft, Send } from "lucide-react";

interface ProjectDetailHeaderProps {
  project: Project;
}

export function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b bg-card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Submit to AHJ
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <p className="text-muted-foreground">
          {project.address}, {project.city}, {project.state} {project.zipCode}
        </p>
      </div>

      <div className="mb-6">
        <Badge className={getStatusColor(project.status)}>
          {getStatusLabel(project.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Jurisdiction
          </p>
          <p className="text-sm font-medium mt-1">{project.jurisdiction}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Permit Type
          </p>
          <p className="text-sm font-medium mt-1 capitalize">
            {project.permitType.replace("_", " ")}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Contractor
          </p>
          <p className="text-sm font-medium mt-1">{project.contractor}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Architect
          </p>
          <p className="text-sm font-medium mt-1">{project.architect}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Project Value
          </p>
          <p className="text-sm font-medium mt-1">
            {formatCurrency(project.value)}
          </p>
        </div>
      </div>
    </div>
  );
}
