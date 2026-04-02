"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  projectStatusLabels,
  permitTypeLabels,
} from "@/lib/validations";

interface ProjectsPageClientProps {
  projects: any[];
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [permitTypeFilter, setPermitTypeFilter] = useState("all");

  // Filter projects client-side
  let filtered = projects;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }
  if (statusFilter !== "all") {
    filtered = filtered.filter((p) => p.status === statusFilter);
  }
  if (permitTypeFilter !== "all") {
    filtered = filtered.filter((p) => p.permitType === permitTypeFilter);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">
            Manage and track all permit projects
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by project name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700"
        >
          <option value="all">All Statuses</option>
          {Object.entries(projectStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={permitTypeFilter}
          onChange={(e) => setPermitTypeFilter(e.target.value)}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700"
        >
          <option value="all">All Permit Types</option>
          {Object.entries(permitTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        Showing {filtered.length} project{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Project Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Jurisdiction</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Permit Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Assignee</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/projects/${project.id}`} className="block">
                    <div className="font-medium text-gray-900 hover:text-blue-600">
                      {project.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {project.address}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{project.jurisdiction}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {permitTypeLabels[project.permitType] || project.permitType}
                </td>
                <td className="px-4 py-3">
                  {project.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                        {(project.assignee.firstName?.[0] || "") + (project.assignee.lastName?.[0] || "")}
                      </div>
                      <span className="text-sm text-gray-700">
                        {project.assignee.firstName} {project.assignee.lastName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{project.progress || 0}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">
                  {project.value
                    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(project.value)
                    : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  No projects found. Create your first project to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    INTAKE: "bg-gray-100 text-gray-700",
    DRAFTING: "bg-blue-50 text-blue-700",
    INTERNAL_REVIEW: "bg-purple-50 text-purple-700",
    SUBMITTED: "bg-indigo-50 text-indigo-700",
    IN_REVIEW: "bg-yellow-50 text-yellow-700",
    REVISION: "bg-orange-50 text-orange-700",
    APPROVED: "bg-green-50 text-green-700",
    ISSUED: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-gray-100 text-gray-500",
  };
  const label = projectStatusLabels[status] || status;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
}
