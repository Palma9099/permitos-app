"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MoreHorizontal, CheckCircle, Clock, FileText,
  AlertTriangle, Plus, Upload, ExternalLink, Calendar,
  MapPin, DollarSign, Building2, User, Hash, Trash2,
  FileCheck, ChevronRight, CheckCircle2, AlertCircle, Zap,
  Activity, Users, GitBranch, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { transitionProjectStatus, deleteProject } from "@/lib/actions/projects";
import { createTask, updateTask, deleteTask } from "@/lib/actions/tasks";
import { createPermit, updatePermitStatus } from "@/lib/actions/permits";
import {
  projectStatusLabels, permitTypeLabels, taskStatusLabels,
  taskPriorityLabels, projectTransitions, documentTypeValues,
} from "@/lib/validations";

interface ProjectDetailClientProps {
  project: any;
  tasks: any[];
  documents: any[];
  permits: any[];
}

// Status workflow timeline
const PROJECT_WORKFLOW_STATUSES = [
  "INTAKE",
  "DRAFTING",
  "INTERNAL_REVIEW",
  "SUBMITTED",
  "IN_REVIEW",
  "REVISION",
  "APPROVED",
  "ISSUED",
  "CLOSED",
];

// Required documents for building permits
const REQUIRED_DOCUMENT_TYPES = [
  "PLANS",
  "CALCULATIONS",
  "SURVEY",
  "NOC",
  "PRODUCT_APPROVAL",
  "APPLICATION",
];

export function ProjectDetailClient({
  project,
  tasks,
  documents,
  permits,
}: ProjectDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "documents" | "permits" | "activity">("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newPermitType, setNewPermitType] = useState("BUILDING");
  const [newPermitNumber, setNewPermitNumber] = useState("");
  const [newPermitFees, setNewPermitFees] = useState("");
  const [isAddingPermit, setIsAddingPermit] = useState(false);

  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
  ).length;

  // Get available status transitions
  const availableTransitions = projectTransitions[project.status] || [];

  // Calculate progress
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

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
      assigneeId: newTaskAssignee || undefined,
    });

    if (result.success) {
      setNewTaskTitle("");
      setNewTaskPriority("MEDIUM");
      setNewTaskDueDate("");
      setNewTaskAssignee("");
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

  async function handleAddPermit(e: React.FormEvent) {
    e.preventDefault();
    if (!newPermitNumber.trim()) return;

    setIsAddingPermit(true);
    const result = await createPermit({
      projectId: project.id,
      type: newPermitType as any,
      permitNumber: newPermitNumber,
      fees: newPermitFees ? parseFloat(newPermitFees) : undefined,
    });

    if (result.success) {
      setNewPermitType("BUILDING");
      setNewPermitNumber("");
      setNewPermitFees("");
      router.refresh();
    } else {
      setError(result.error || "Failed to create permit");
    }
    setIsAddingPermit(false);
  }

  async function handlePermitStatusChange(permitId: string, status: string) {
    const result = await updatePermitStatus(permitId, status, project.id);
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

  const isDocumentUploaded = (docType: string) => {
    return documents.some((d) => d.type === docType);
  };

  // Mock activity data from project state
  const generateActivityFeed = () => {
    const activities = [];

    if (project.createdAt) {
      activities.push({
        id: "act-1",
        type: "created",
        title: "Project created",
        description: `${project.name} was created`,
        timestamp: new Date(project.createdAt),
        user: project.assignee?.name || "System",
        icon: "plus",
      });
    }

    if (project.submittedAt) {
      activities.push({
        id: "act-2",
        type: "submitted",
        title: "Project submitted",
        description: "Submitted to jurisdiction for review",
        timestamp: new Date(project.submittedAt),
        user: project.assignee?.name || "System",
        icon: "send",
      });
    }

    if (project.approvedAt) {
      activities.push({
        id: "act-3",
        type: "approved",
        title: "Project approved",
        description: "Jurisdiction approved the permit application",
        timestamp: new Date(project.approvedAt),
        user: "Jurisdiction",
        icon: "check",
      });
    }

    // Add task creation activities
    tasks.slice(0, 3).forEach((task, idx) => {
      if (task.createdAt) {
        activities.push({
          id: `act-task-${idx}`,
          type: "task_created",
          title: "Task created",
          description: `"${task.title}" was added`,
          timestamp: new Date(task.createdAt),
          user: "System",
          icon: "task",
        });
      }
    });

    // Add document upload activities
    documents.slice(0, 2).forEach((doc, idx) => {
      activities.push({
        id: `act-doc-${idx}`,
        type: "document_uploaded",
        title: "Document uploaded",
        description: `${doc.name} (${doc.type})`,
        timestamp: new Date(doc.createdAt),
        user: "System",
        icon: "file",
      });
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  };

  const activityFeed = generateActivityFeed();

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
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{project.address}, {project.city}, {project.state} {project.zip}</span>
              </div>
              {project.value && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCurrency(project.value)}</span>
                </div>
              )}
            </div>
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
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Tasks Completed</div>
          <div className="text-2xl font-bold text-gray-900">{completedTasks}/{tasks.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Documents</div>
          <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Permits</div>
          <div className="text-2xl font-bold text-gray-900">{permits.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Overdue Tasks</div>
          <div className={`text-2xl font-bold ${overdueTasks > 0 ? "text-red-600" : "text-gray-900"}`}>{overdueTasks}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Comment Rounds</div>
          <div className="text-2xl font-bold text-gray-900">{project.commentRounds || 0}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 flex">
          {(["overview", "tasks", "documents", "permits", "activity"] as const).map((tab) => (
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
              {/* Project Details Card */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Project Name</label>
                    <p className="text-gray-900 mt-1">{project.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Address</label>
                    <p className="text-gray-900 mt-1">{project.address}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Jurisdiction</label>
                    <p className="text-gray-900 mt-1">{project.jurisdiction}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Permit Type</label>
                    <p className="text-gray-900 mt-1">{permitTypeLabels[project.permitType]}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Assigned To</label>
                    <p className="text-gray-900 mt-1">
                      {project.assignee
                        ? `${project.assignee.firstName} ${project.assignee.lastName}`
                        : "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Project Value</label>
                    <p className="text-gray-900 mt-1">{project.value ? formatCurrency(project.value) : "—"}</p>
                  </div>
                </div>
              </div>

              {/* Contractor & Architect Info */}
              {(project.contractor || project.architect) && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {project.contractor && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-medium">Contractor</label>
                        <p className="text-gray-900 mt-1">{project.contractor}</p>
                      </div>
                    )}
                    {project.architect && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-medium">Architect</label>
                        <p className="text-gray-900 mt-1">{project.architect}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Timeline */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Workflow</h3>
                <div className="flex items-center justify-between gap-1">
                  {PROJECT_WORKFLOW_STATUSES.map((status, idx) => {
                    const isCompleted = PROJECT_WORKFLOW_STATUSES.indexOf(project.status) >= idx;
                    const isCurrent = status === project.status;

                    return (
                      <div key={status} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                          isCurrent
                            ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2"
                            : isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-400"
                        }`}>
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-medium">{idx + 1}</span>}
                        </div>
                        <span className={`text-xs font-medium text-center ${
                          isCurrent ? "text-blue-600" : isCompleted ? "text-green-700" : "text-gray-400"
                        }`}>
                          {projectStatusLabels[status]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Dates */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Dates</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Created</label>
                    <p className="text-gray-900 mt-1">{formatDate(project.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Submitted</label>
                    <p className="text-gray-900 mt-1">{formatDate(project.submittedAt)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Approved</label>
                    <p className="text-gray-900 mt-1">{formatDate(project.approvedAt)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-medium">Last Updated</label>
                    <p className="text-gray-900 mt-1">{formatDate(project.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                  <span className="text-sm font-medium text-gray-600">{taskProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${taskProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Based on completed tasks ({completedTasks}/{tasks.length})</p>
              </div>

              {/* Description */}
              {project.description && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              )}

              {/* Delete button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
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
              {/* Task Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Total Tasks</div>
                      <div className="text-2xl font-bold text-blue-900">{tasks.length}</div>
                    </div>
                    <div>
                      <div className="text-sm text-green-600 font-medium">Completed</div>
                      <div className="text-2xl font-bold text-green-900">{completedTasks}</div>
                    </div>
                    <div>
                      <div className="text-sm text-red-600 font-medium">Overdue</div>
                      <div className="text-2xl font-bold text-red-900">{overdueTasks}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add task form */}
              <form onSubmit={handleAddTask} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="New task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
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
                    <input
                      type="text"
                      placeholder="Assignee ID (optional)"
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isAddingTask || !newTaskTitle.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isAddingTask ? "Adding..." : "Add"}
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
                      {tasks.map((task) => {
                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";
                        return (
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
                            <td className="px-4 py-3 text-sm">
                              <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-600"}>
                                {task.dueDate ? formatDate(task.dueDate) : "—"}
                              </span>
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
                        );
                      })}
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
              {/* Required Documents Checklist */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  Required Documents Checklist
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {REQUIRED_DOCUMENT_TYPES.map((docType) => {
                    const isUploaded = isDocumentUploaded(docType);
                    return (
                      <div key={docType} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                        <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center ${
                          isUploaded ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {isUploaded ? (
                            <CheckCircle2 className="w-5 h-5 text-green-700" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-700" />
                          )}
                        </div>
                        <span className={`text-sm font-medium ${isUploaded ? "text-green-700" : "text-gray-700"}`}>
                          {docType.replace(/_/g, " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <Button size="sm" variant="outline" disabled>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document (Coming Soon)
                </Button>
              </div>

              {/* Uploaded Documents Table */}
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
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {doc.name}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{doc.type}</Badge>
                          </td>
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
              {/* Add Permit Form */}
              <form onSubmit={handleAddPermit} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Add New Permit</h3>
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-3">
                    <label className="text-xs text-gray-600 font-medium mb-1 block">Type</label>
                    <select
                      value={newPermitType}
                      onChange={(e) => setNewPermitType(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
                    >
                      {["BUILDING", "ELECTRICAL", "MECHANICAL", "PLUMBING", "ROOFING", "DEMOLITION", "FIRE"].map((t) => (
                        <option key={t} value={t}>
                          {permitTypeLabels[t]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs text-gray-600 font-medium mb-1 block">Permit Number</label>
                    <input
                      type="text"
                      placeholder="e.g., 2026-001234"
                      value={newPermitNumber}
                      onChange={(e) => setNewPermitNumber(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs text-gray-600 font-medium mb-1 block">Fees (optional)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newPermitFees}
                      onChange={(e) => setNewPermitFees(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                  <div className="col-span-3">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isAddingPermit || !newPermitNumber.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isAddingPermit ? "Adding..." : "Add Permit"}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Permits Cards */}
              {permits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permits.map((permit) => (
                    <div key={permit.id} className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-gray-600 uppercase font-medium">Permit #{permit.permitNumber}</div>
                          <div className="text-lg font-semibold text-gray-900 mt-1">{permitTypeLabels[permit.type]}</div>
                        </div>
                        <PermitStatusBadge status={permit.status} />
                      </div>

                      {/* Status Dropdown */}
                      <div className="pt-2 border-t border-gray-100">
                        <label className="text-xs text-gray-500 uppercase font-medium">Status</label>
                        <select
                          value={permit.status}
                          onChange={(e) => handlePermitStatusChange(permit.id, e.target.value)}
                          className="w-full mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
                        >
                          {["PENDING", "SUBMITTED", "IN_REVIEW", "APPROVED", "ISSUED", "EXPIRED", "DENIED"].map((s) => (
                            <option key={s} value={s}>
                              {s.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Fees */}
                      {permit.fees > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Fees:</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(permit.fees)}</span>
                        </div>
                      )}

                      {/* Key Dates */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        {permit.submittedAt && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Submitted: {formatDate(permit.submittedAt)}</span>
                          </div>
                        )}
                        {permit.issuedAt && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">Issued: {formatDate(permit.issuedAt)}</span>
                          </div>
                        )}
                        {permit.expiresAt && (
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="text-gray-600">Expires: {formatDate(permit.expiresAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No permits added yet.
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-4">
              {activityFeed.length > 0 ? (
                <div className="space-y-3">
                  {activityFeed.map((activity, idx) => {
                    const isLastItem = idx === activityFeed.length - 1;
                    return (
                      <div key={activity.id} className="relative">
                        {/* Timeline line */}
                        {!isLastItem && (
                          <div className="absolute left-5 top-10 w-0.5 h-12 bg-gray-200"></div>
                        )}

                        {/* Activity item */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                              <ActivityIcon type={activity.type} />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-baseline gap-2">
                              <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-500">
                                {formatRelativeTime(activity.timestamp)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-400 mt-1">by {activity.user}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No activities yet.
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

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "created":
      return <Plus className="w-5 h-5" />;
    case "submitted":
      return <GitBranch className="w-5 h-5" />;
    case "approved":
      return <CheckCircle className="w-5 h-5" />;
    case "task_created":
      return <Zap className="w-5 h-5" />;
    case "document_uploaded":
      return <Upload className="w-5 h-5" />;
    default:
      return <Activity className="w-5 h-5" />;
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
