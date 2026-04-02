"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface TaskData {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  dueDate: Date | null;
  priority: string;
  status: string;
  isOverdue?: boolean;
}

interface ProjectData {
  id: string;
  name: string;
  address: string;
  jurisdiction: string;
  status: string;
  value: number;
  progress?: number;
  commentRounds?: number;
}

interface DashboardClientProps {
  activeProjectsCount: number;
  activeProjectsBreakdown: {
    intake: number;
    drafting: number;
    submitted: number;
  };
  inReviewCount: number;
  needingActionCount: number;
  totalPipelineValue: number;
  pipelineBreakdown: {
    intake: number;
    drafting: number;
    internal_review: number;
    submitted: number;
    in_review: number;
    revision: number;
    approved: number;
    issued: number;
    on_hold: number;
  };
  overdueTasks: TaskData[];
  projectsNeedingAttention: ProjectData[];
  docsPendingReview: number;
  avgCommentRounds: number;
}

const getPriorityColor = (priority: string) => {
  const p = priority?.toUpperCase() || "MEDIUM";
  if (p === "URGENT") return "bg-red-100 text-red-800";
  if (p === "HIGH") return "bg-orange-100 text-orange-800";
  if (p === "MEDIUM") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
};

const getStatusColor = (status: string) => {
  const s = status?.toUpperCase() || "";
  if (s === "INTAKE") return "bg-gray-100";
  if (s === "DRAFTING") return "bg-blue-100";
  if (s === "INTERNAL_REVIEW") return "bg-purple-100";
  if (s === "SUBMITTED") return "bg-indigo-100";
  if (s === "IN_REVIEW") return "bg-yellow-100";
  if (s === "REVISION") return "bg-orange-100";
  if (s === "APPROVED") return "bg-green-100";
  if (s === "ISSUED") return "bg-emerald-100";
  if (s === "ON_HOLD") return "bg-gray-200";
  return "bg-gray-100";
};

const formatStatusLabel = (status: string) => {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const calculateDaysOverdue = (dueDate: Date | null): number => {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = now.getTime() - due.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export function DashboardClient({
  activeProjectsCount,
  activeProjectsBreakdown,
  inReviewCount,
  needingActionCount,
  totalPipelineValue,
  pipelineBreakdown,
  overdueTasks,
  projectsNeedingAttention,
  docsPendingReview,
  avgCommentRounds,
}: DashboardClientProps) {
  const totalProjects = Object.values(pipelineBreakdown).reduce((a, b) => a + b, 0);
  const totalProjectsInPipeline = totalProjects - pipelineBreakdown.issued; // Exclude issued from "pipeline"

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Real-time operations center and permit pipeline overview
        </p>
      </div>

      {/* KPI Row - 4 Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Projects Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {activeProjectsCount}
              </p>
              <div className="mt-4 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Intake:</span>
                  <span className="font-medium">{activeProjectsBreakdown.intake}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drafting:</span>
                  <span className="font-medium">{activeProjectsBreakdown.drafting}</span>
                </div>
                <div className="flex justify-between">
                  <span>Submitted:</span>
                  <span className="font-medium">{activeProjectsBreakdown.submitted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* In AHJ Review Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div>
            <p className="text-sm font-medium text-gray-600">In AHJ Review</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{inReviewCount}</p>
            <p className="mt-4 text-xs text-gray-600">
              Projects awaiting AHJ response
            </p>
          </div>
        </div>

        {/* Needing Action Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Needing Action</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {needingActionCount}
            </p>
            <p className="mt-4 text-xs text-gray-600">
              Overdue tasks + revisions due
            </p>
          </div>
        </div>

        {/* Total Pipeline Value Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatCurrency(totalPipelineValue)}
            </p>
            <p className="mt-4 text-xs text-gray-600">
              Active projects total value
            </p>
          </div>
        </div>
      </div>

      {/* Project Pipeline Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Project Pipeline</h2>

        {/* Horizontal Bar with Status Breakdown */}
        <div className="space-y-6">
          {/* Pipeline Progress Bar */}
          <div className="flex h-10 gap-0.5 rounded-lg overflow-hidden bg-gray-100">
            {pipelineBreakdown.intake > 0 && (
              <div
                className="bg-gray-400 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{
                  width: `${(pipelineBreakdown.intake / totalProjects) * 100}%`,
                }}
                title={`Intake: ${pipelineBreakdown.intake}`}
              >
                {totalProjects > 12 && pipelineBreakdown.intake > 1 ? pipelineBreakdown.intake : ""}
              </div>
            )}
            {pipelineBreakdown.drafting > 0 && (
              <div
                className="bg-blue-500 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{
                  width: `${(pipelineBreakdown.drafting / totalProjects) * 100}%`,
                }}
                title={`Drafting: ${pipelineBreakdown.drafting}`}
              >
                {totalProjects > 12 && pipelineBreakdown.drafting > 1 ? pipelineBreakdown.drafting : ""}
              </div>
            )}
            {pipelineBreakdown.internal_review > 0 && (
              <div
                className="bg-purple-500 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{
                  width: `${(pipelineBreakdown.internal_review / totalProjects) * 100}%`,
                }}
                title={`Internal Review: ${pipelineBreakdown.internal_review}`}
              >
                {totalProjects > 12 && pipelineBreakdown.internal_review > 1 ? pipelineBreakdown.internal_review : ""}
              </div>
            )}
            {pipelineBreakdown.submitted > 0 && (
              <div
                className="bg-indigo-500 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{
                  width: `${(pipelineBreakdown.submitted / totalProjects) * 100}%`,
                }}
                title={`Submitted: ${pipelineBreakdown.submitted}`}
              >
                {totalProjects > 12 && pipelineBreakdown.submitted > 1 ? pipelineBreakdown.submitted : ""}
              </div>
            )}
            {pipelineBreakdown.in_review > 0 && (
              <div
                className="bg-yellow-400 flex items-center justify-center text-xs font-bold text-gray-800 transition-all"
                style={{
                  width: `${(pipelineBreakdown.in_review / totalProjects) * 100}%`,
                }}
                title={`In Review: ${pipelineBreakdown.in_review}`}
              >
                {totalProjects > 12 && pipelineBreakdown.in_review > 1 ? pipelineBreakdown.in_review : ""}
              </div>
            )}
            {pipelineBreakdown.revision > 0 && (
              <div
                className="bg-orange-500 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{
                  width: `${(pipelineBreakdown.revision / totalProjects) * 100}%`,
                }}
                title={`Revision: ${pipelineBreakdown.revision}`}
              >
                {totalProjects > 12 && pipelineBreakdown.revision > 1 ? pipelineBreakdown.revision : ""}
              </div>
            )}
            {pipelineBreakdown.approved > 0 && (
              <div
                className="bg-green-500 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{
                  width: `${(pipelineBreakdown.approved / totalProjects) * 100}%`,
                }}
                title={`Approved: ${pipelineBreakdown.approved}`}
              >
                {totalProjects > 12 && pipelineBreakdown.approved > 1 ? pipelineBreakdown.approved : ""}
              </div>
            )}
            {pipelineBreakdown.issued > 0 && (
              <div
                className="bg-emerald-500 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{
                  width: `${(pipelineBreakdown.issued / totalProjects) * 100}%`,
                }}
                title={`Issued: ${pipelineBreakdown.issued}`}
              >
                {totalProjects > 12 && pipelineBreakdown.issued > 1 ? pipelineBreakdown.issued : ""}
              </div>
            )}
            {pipelineBreakdown.on_hold > 0 && (
              <div
                className="bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 transition-all"
                style={{
                  width: `${(pipelineBreakdown.on_hold / totalProjects) * 100}%`,
                }}
                title={`On Hold: ${pipelineBreakdown.on_hold}`}
              >
                {totalProjects > 12 && pipelineBreakdown.on_hold > 1 ? pipelineBreakdown.on_hold : ""}
              </div>
            )}
          </div>

          {/* Legend and Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4">
            <div className="text-center">
              <div className="w-4 h-4 bg-gray-400 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">Intake</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.intake}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.intake / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">Drafting</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.drafting}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.drafting / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-purple-500 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">Int. Review</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.internal_review}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.internal_review / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-indigo-500 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">Submitted</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.submitted}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.submitted / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-yellow-400 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">AHJ Review</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.in_review}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.in_review / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-orange-500 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">Revision</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.revision}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.revision / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">Approved</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.approved}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.approved / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-emerald-500 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">Issued</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.issued}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.issued / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-gray-300 rounded mx-auto mb-2"></div>
              <p className="text-xs font-medium text-gray-700">On Hold</p>
              <p className="text-sm font-bold text-gray-900">
                {pipelineBreakdown.on_hold}{" "}
                <span className="text-xs text-gray-600">
                  ({((pipelineBreakdown.on_hold / totalProjects) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity / Urgent Items Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projects Needing Attention */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Projects Needing Attention
          </h2>

          {projectsNeedingAttention.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>All projects on track</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectsNeedingAttention.slice(0, 6).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{project.address}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(project.status)}`}>
                          {formatStatusLabel(project.status)}
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatCurrency(project.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {projectsNeedingAttention.length > 6 && (
                <p className="text-xs text-gray-600 text-center pt-2">
                  +{projectsNeedingAttention.length - 6} more
                </p>
              )}
            </div>
          )}
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Overdue Tasks</h2>

          {overdueTasks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No overdue tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTasks.slice(0, 6).map((task) => {
                const daysOverdue = calculateDaysOverdue(task.dueDate);
                return (
                  <div
                    key={task.id}
                    className="p-4 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority?.toUpperCase() || "MEDIUM"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.projectName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-700 font-medium">
                        {daysOverdue} day{daysOverdue !== 1 ? "s" : ""} overdue
                      </span>
                      <span className="text-xs text-gray-600">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
              {overdueTasks.length > 6 && (
                <p className="text-xs text-gray-600 text-center pt-2">
                  +{overdueTasks.length - 6} more overdue
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Avg Days in Review</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">32</p>
          <p className="mt-2 text-xs text-gray-600">Average AHJ review time</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Avg Comment Rounds</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{avgCommentRounds}</p>
          <p className="mt-2 text-xs text-gray-600">From active projects</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Docs This Month</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
          <p className="mt-2 text-xs text-gray-600">Total uploaded</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
          <p className="mt-2 text-xs text-gray-600">This week</p>
        </div>
      </div>
    </div>
  );
}
