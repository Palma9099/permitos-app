"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Project, Task, Permit } from "@/lib/types";
import {
  formatDate,
  formatCurrency,
  formatPercent,
  getStatusColor,
  getStatusLabel,
  getTaskStatusLabel,
  getTaskStatusColor,
  getPriorityLabel,
  getPriorityColor,
} from "@/lib/format";
import { mockTasks, mockPermits } from "@/lib/mock-data";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";

interface ProjectDetailTabsProps {
  project: Project;
}

export function ProjectDetailTabs({ project }: ProjectDetailTabsProps) {
  const projectTasks = mockTasks.filter((t) => t.projectId === project.id);
  const projectPermits = mockPermits.filter((p) => p.projectId === project.id);
  const progress = (project.completedTasks / project.totalTasks) * 100;

  // Mock activity data
  const activities = [
    {
      id: "act-1",
      timestamp: "2026-03-29",
      action: "Project created",
      actor: "Sarah Martinez",
    },
    {
      id: "act-2",
      timestamp: "2026-03-28",
      action: "Status changed to In Review",
      actor: "James Chen",
    },
    {
      id: "act-3",
      timestamp: "2026-03-27",
      action: "1 comment received from AHJ",
      actor: "System",
    },
    {
      id: "act-4",
      timestamp: "2026-03-26",
      action: "Permit submitted",
      actor: "Sarah Martinez",
    },
  ];

  // Mock documents
  const documents = [
    {
      id: "doc-1",
      name: "Floor Plans",
      type: "PDF",
      size: "2.4 MB",
      date: "2026-03-28",
    },
    {
      id: "doc-2",
      name: "Structural Calcs",
      type: "PDF",
      size: "1.8 MB",
      date: "2026-03-27",
    },
    {
      id: "doc-3",
      name: "MEP Drawings",
      type: "PDF",
      size: "3.1 MB",
      date: "2026-03-26",
    },
    {
      id: "doc-4",
      name: "COI - Certificate of Insurance",
      type: "PDF",
      size: "0.5 MB",
      date: "2026-03-25",
    },
  ];

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="border-b px-6 pt-6">
        <TabsList className="grid w-full max-w-md grid-cols-5 bg-transparent p-0 h-auto gap-0 border-b">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="permits"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Permits
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Activity
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatDate(project.createdAt)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Comment Rounds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{project.commentRounds}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatPercent(progress)}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
            <CardDescription>
              {project.completedTasks} of {project.totalTasks} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold">{project.completedTasks}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-lg font-semibold">
                  {project.totalTasks - project.completedTasks}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{project.totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {project.submittedAt && (
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Submitted
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(project.submittedAt)}
                  </p>
                </div>
                {project.approvedAt && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Approved
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(project.approvedAt)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="permits" className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Permits</CardTitle>
            <CardDescription>
              {projectPermits.length} permit(s) for this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectPermits.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Fees</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectPermits.map((permit) => (
                    <TableRow key={permit.id}>
                      <TableCell className="capitalize">
                        {permit.type.replace("_", " ")}
                      </TableCell>
                      <TableCell>{permit.number || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(permit.status)}>
                          {getStatusLabel(permit.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {permit.submittedAt
                          ? formatDate(permit.submittedAt)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {permit.issuedAt ? formatDate(permit.issuedAt) : "-"}
                      </TableCell>
                      <TableCell>{formatCurrency(permit.fees)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No permits yet
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tasks" className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              {projectTasks.length} task(s) for this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectTasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {task.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {task.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {getTaskStatusLabel(task.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800">
                            {task.assignee.initials}
                          </div>
                          <span className="text-sm">
                            {task.assignee.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(task.dueDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No tasks yet
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents" className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              {documents.length} document(s) uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium line-clamp-2">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.size}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(doc.date)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Recent updates to this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {activity.action.includes("created") && (
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.action.includes("Status") && (
                        <Clock className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.action.includes("comment") && (
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.action.includes("submitted") && (
                        <Zap className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    {index < activities.length - 1 && (
                      <div className="h-12 w-0.5 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.actor} on {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
