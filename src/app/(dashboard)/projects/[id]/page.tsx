"use client";

import React from "react";
import { ProjectDetailHeader } from "@/components/projects/project-detail-header";
import { ProjectDetailTabs } from "@/components/projects/project-detail-tabs";
import { mockProjects } from "@/lib/mock-data";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = mockProjects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Project not found</h1>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background">
      <ProjectDetailHeader project={project} />
      <ProjectDetailTabs project={project} />
    </div>
  );
}
