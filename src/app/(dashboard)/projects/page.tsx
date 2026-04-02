"use client";

import React, { useState } from "react";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectTable } from "@/components/projects/project-table";
import { mockProjects } from "@/lib/mock-data";

export default function ProjectsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [permitTypeFilter, setPermitTypeFilter] = useState("all");

  // Calculate the filtered count
  let filteredCount = mockProjects.length;
  if (searchValue) {
    const search = searchValue.toLowerCase();
    filteredCount = mockProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.address.toLowerCase().includes(search)
    ).length;
  }
  if (statusFilter !== "all") {
    filteredCount = mockProjects.filter((p) => p.status === statusFilter).length;
  }
  if (permitTypeFilter !== "all") {
    filteredCount = mockProjects.filter(
      (p) => p.permitType === permitTypeFilter
    ).length;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">Manage and track all permit projects</p>
      </div>

      <ProjectFilters
        searchValue={searchValue}
        statusValue={statusFilter}
        permitTypeValue={permitTypeFilter}
        onSearchChange={setSearchValue}
        onStatusChange={setStatusFilter}
        onPermitTypeChange={setPermitTypeFilter}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {filteredCount} projects
        </span>
      </div>

      <ProjectTable
        projects={mockProjects}
        searchValue={searchValue}
        statusFilter={statusFilter}
        permitTypeFilter={permitTypeFilter}
      />
    </div>
  );
}
