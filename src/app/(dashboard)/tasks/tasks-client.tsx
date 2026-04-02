"use client";

import React, { useState, useMemo } from "react";
import { AlertCircle, Plus, ChevronDown, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { taskStatusLabels, taskPriorityLabels } from "@/lib/validations";
import { createTask, updateTask, deleteTask } from "@/lib/actions/tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  projectId: string;
  projectName: string;
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  } | null;
  isOverdue: boolean;
}

interface Project {
  id: string;
  name: string;
}

interface TasksPageClientProps {
  tasks: Task[];
  overdueCount: number;
  projects: Project[];
}

const statusBgColors: Record<string, string> = {
  TODO: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  BLOCKED: "bg-red-50 text-red-700",
  DONE: "bg-green-50 text-green-700",
};

const priorityBgColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

function formatDate(date: Date | null): string {
  if (!date) return "No due date";
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function NewTaskForm({
  projects,
  onSuccess,
}: {
  projects: Project[];
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    projectId: projects[0]?.id || "",
    priority: "MEDIUM",
    dueDate: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await createTask({
        title: formData.title,
        projectId: formData.projectId,
        priority: formData.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        description: formData.description || undefined,
      });

      if (result.success) {
        setFormData({
          title: "",
          projectId: projects[0]?.id || "",
          priority: "MEDIUM",
          dueDate: "",
          description: "",
        });
        setIsOpen(false);
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Task title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project</label>
            <select
              required
              value={formData.projectId}
              onChange={(e) =>
                setFormData({ ...formData, projectId: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md bg-white text-sm"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md bg-white text-sm"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional description..."
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TasksPageClient({
  tasks: initialTasks,
  overdueCount,
  projects,
}: TasksPageClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.projectName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesProject =
        projectFilter === "all" || task.projectId === projectFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }, [tasks, search, statusFilter, priorityFilter, projectFilter]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const result = await updateTask({ id: taskId, status: newStatus as any });
    if (result.success) {
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const result = await deleteTask(taskId);
      if (result.success) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-600">Manage and track all permit tasks</p>
        </div>
        <NewTaskForm projects={projects} onSuccess={() => window.location.reload()} />
      </div>

      {/* Overdue Alert */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">
              {overdueCount} overdue {overdueCount === 1 ? "task" : "tasks"}
            </p>
            <p className="text-sm text-red-700">
              Please review and update task statuses
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-white"
        >
          <option value="all">All Statuses</option>
          {Object.entries(taskStatusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-white"
        >
          <option value="all">All Priorities</option>
          {Object.entries(taskPriorityLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-white"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Title
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Project
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Priority
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Assignee
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Due Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className={task.isOverdue ? "bg-red-50" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{task.projectName}</td>
                  <td className="px-6 py-4">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        const statuses = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];
                        const current = statuses.indexOf(task.status);
                        const next = statuses[(current + 1) % statuses.length];
                        handleStatusChange(task.id, next);
                      }}
                    >
                      <Badge className={`${statusBgColors[task.status]} cursor-pointer`}>
                        {taskStatusLabels[task.status as keyof typeof taskStatusLabels]}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={priorityBgColors[task.priority]}>
                      {taskPriorityLabels[task.priority as keyof typeof taskPriorityLabels]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {task.assignee ? task.assignee.firstName : "Unassigned"}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      task.isOverdue ? "font-medium text-red-600" : "text-gray-600"
                    }`}
                  >
                    {formatDate(task.dueDate)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredTasks.length > 0 && (
        <p className="text-sm text-gray-600">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
      )}
    </div>
  );
}
