"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockTasks } from "@/lib/mock-data";
import {
  formatRelativeDate,
  getTaskStatusColor,
  getTaskStatusLabel,
  getPriorityColor,
  getPriorityLabel,
} from "@/lib/format";
import { Search, Calendar } from "lucide-react";

export default function TasksPage() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return mockTasks.filter((task) => {
      const matchesSearch =
        !searchValue ||
        task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.projectName.toLowerCase().includes(searchValue.toLowerCase());
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchValue, statusFilter, priorityFilter]);

  const overdueTasks = filteredTasks.filter((t) => t.status === "overdue").length;

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
    { value: "blocked", label: "Blocked" },
  ];

  const priorityOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const isOverdue = (task: (typeof mockTasks)[0]) => {
    return task.status === "overdue";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage and track all permit tasks</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks by title or project..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                setStatusFilter(statusFilter === option.value ? null : option.value)
              }
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="hidden h-4 w-px bg-border sm:block" />

        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                setPriorityFilter(priorityFilter === option.value ? null : option.value)
              }
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                priorityFilter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        {filteredTasks.length} tasks {overdueTasks > 0 && `• ${overdueTasks} overdue`}
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className={isOverdue(task) ? "border-red-200" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {task.projectName}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{task.description}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={getTaskStatusColor(task.status)}>
                    {getTaskStatusLabel(task.status)}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </div>

                {/* Assignee and Due Date */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {task.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{task.assignee.name}</p>
                      <p className="text-xs text-muted-foreground">Assignee</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-sm ${
                      isOverdue(task) ? "text-red-600 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    {formatRelativeDate(task.dueDate)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed py-12">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
