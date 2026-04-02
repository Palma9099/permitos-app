"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MoreHorizontal, CheckCircle, Clock, FileText,
  AlertTriangle, Plus, Upload, ExternalLink, Calendar,
  MapPin, DollarSign, Building2, User, Hash, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { transitionProjectStatus, deleteProject } from "@/lib/actions/projects";
import { createTask, updateTask, deleteTask } from "@/lib/actions/tasks";
import {
  projectStatusLabels, permitTypeLabels, taskStatusLabels,
  taskPriorityLabels, projectTransitions,
} from "@/lib/validations";

interface ProjectDetailClientProps {
  project: any;
  tasks: any[];
  documents: any[];
  permits: any[];
}

export function ProjectDetailClient({
  project,
  tasks,
  documents,
  permits,
}: ProjectDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "documents" | "permits">("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
  ).length;

  // Get available status transitions
  const availableTransitions = projectTransitions[project.status] || [];

  async function handleStatusChange(newStatus: string) {
    setIsUpdating(true);
    setError(null);
    const result = await transitionProjectStatus(project.id, newStatus);
    if (!result.success) {
      setError(result.error || "Failed to update project status");
      setIsUpdating(false);
    } else {
      router.refresh();
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAddingTask(true);
    const result = await createTask({
      title: newTaskTitle,
      priority: newTaskPriority as any,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
      projectId: project.id,
    });

    if (result.success) {
      setNewTaskTitle("");
      setNewTaskPriority("MEDIUM");
      setNewTaskDueDate("");
      router.refresh();
    } else {
      setError(result.error || "Failed to create task");
    }
    setIsAddingTask(false);
  }

  async function handleTaskStatusChange(taskId: string, status: string) {
    const result = await updateTask({ id: taskId, status: status as any });
    if (result.success) {
      router.refresh();
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const result = await deleteTask(taskId);
    if (result.success) {
      router.refresh();
    }
  }

  async function handleDeleteProject() {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    setIsUpdating(true);
    const result = await deleteProject(project.id);
    if (result.success) {
      router.push("/projects");
    } else {
      setError(result.error || "Failed to delete project");
      setIsUpdating(false);
    }
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Project Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span>{project.address}, {project.city}, {project.state} {project.zip}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status transition buttons */}
        {availableTransitions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {availableTransitions.map((status) => (
              <Button
                key={status}
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => handleStatusChange(status)}
              >
                Move to {projectStatusLabels[status]}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Tasks Completed</div>
          <div className="text-2xl font-bold text-gray-900">{completedTasks}/{tasks.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Documents</div>
          <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Overdue Tasks</div>
          <div className={`text-2xl font-bold ${overdueTasks > 0 ? "text-red-600" : "text-gray-900"}`}>{overdueTasks}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Project Value</div>
          <div className="text-2xl font-bold text-gray-900">{project.value ? formatCurrency(project.value) : "—"}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 flex">
          {(["overview", "tasks", "documents", "permits"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Project Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Jurisdiction</label>
                      <p className="text-gray-900">{project.jurisdiction}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Permit Type</label>
                      <p className="text-gray-900">{permitTypeLabels[project.permitType]}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Assigned To</label>
                      <p className="text-gray-900">
                        {project.assignee
                          ? `${project.assignee.firstName} ${project.assignee.lastName}`
                          : "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Created</label>
                      <p className="text-gray-900">{formatDate(project.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Timeline</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Current Status</label>
                      <p className="text-gray-900">{projectStatusLabels[project.status]}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Submitted</label>
                      <p className="text-gray-900">{project.submittedAt ? formatDate(project.submittedAt) : "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Last Updated</label>
                      <p className="text-gray-900">{formatDate(project.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              )}

              {/* Delete button */}
              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteProject}
                  disabled={isUpdating}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </Button>
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="space-y-4">
              {/* Add task form */}
              <form onSubmit={handleAddTask} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="New task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
                    >
                      {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                        <option key={p} value={p}>
                          {taskPriorityLabels[p]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isAddingTask || !newTaskTitle.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isAddingTask ? "Adding..." : "Add Task"}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Tasks table */}
              {tasks.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Assignee</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{task.title}</td>
                          <td className="px-4 py-3">
                            <select
                              value={task.status}
                              onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                              className="text-xs rounded px-2 py-1 border border-gray-200 bg-white text-gray-700"
                            >
                              {["TODO", "IN_PROGRESS", "BLOCKED", "DONE"].map((s) => (
                                <option key={s} value={s}>
                                  {taskStatusLabels[s]}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <PriorityBadge priority={task.priority} />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {task.dueDate ? formatDate(task.dueDate) : "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {task.assignee
                              ? `${task.assignee.firstName} ${task.assignee.lastName}`
                              : "Unassigned"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No tasks yet. Create one to get started.
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button size="sm" variant="outline" disabled>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document (Coming Soon)
                </Button>
              </div>

              {documents.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{doc.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{doc.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {doc.size ? `${(doc.size / 1024 / 1024).toFixed(1)} MB` : "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No documents uploaded yet.
                </div>
              )}
            </div>
          )}

          {/* Permits Tab */}
          {activeTab === "permits" && (
            <div className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button size="sm" variant="outline" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Permit (Coming Soon)
                </Button>
              </div>

              {permits.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Permit #</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Fees</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {permits.map((permit) => (
                        <tr key={permit.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{permit.permitNumber || "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{permitTypeLabels[permit.type]}</td>
                          <td className="px-4 py-3">
                            <PermitStatusBadge status={permit.status} />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {permit.fees ? formatCurrency(permit.fees) : "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{formatDate(permit.submittedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No permits added yet.
                </div>
              )}
            </div>
          )}
        </div>
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

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };
  const label = taskPriorityLabels[priority] || priority;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
}

function PermitStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-700",
    SUBMITTED: "bg-indigo-50 text-indigo-700",
    IN_REVIEW: "bg-yellow-50 text-yellow-700",
    CORRECTIONS_REQUIRED: "bg-orange-50 text-orange-700",
    APPROVED: "bg-green-50 text-green-700",
    ISSUED: "bg-emerald-50 text-emerald-700",
    EXPIRED: "bg-gray-100 text-gray-500",
    DENIED: "bg-red-100 text-red-700",
    WITHDRAWN: "bg-gray-100 text-gray-600",
  };
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
}
