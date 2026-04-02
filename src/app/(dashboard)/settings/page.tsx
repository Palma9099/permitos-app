"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Cloud, Database, Mail, Zap, BarChart3 } from "lucide-react";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Airavata Engineering");
  const [timezone, setTimezone] = useState("America/New_York");
  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    deadlineReminders: true,
    permitStatusChanges: true,
    commentNotifications: false,
  });

  const integrations = [
    {
      id: "clerk",
      name: "Clerk Auth",
      description: "Authentication & User Management",
      status: "configured",
      icon: CheckCircle2,
      color: "text-blue-600",
    },
    {
      id: "postgres",
      name: "PostgreSQL",
      description: "Database",
      status: "not_connected",
      icon: Database,
      color: "text-slate-600",
    },
    {
      id: "r2",
      name: "Cloudflare R2",
      description: "File Storage",
      status: "not_connected",
      icon: Cloud,
      color: "text-orange-600",
    },
    {
      id: "resend",
      name: "Resend",
      description: "Email Service",
      status: "not_connected",
      icon: Mail,
      color: "text-red-600",
    },
    {
      id: "sentry",
      name: "Sentry",
      description: "Error Tracking",
      status: "not_connected",
      icon: Zap,
      color: "text-purple-600",
    },
    {
      id: "posthog",
      name: "PostHog",
      description: "Analytics",
      status: "not_connected",
      icon: BarChart3,
      color: "text-green-600",
    },
  ];

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your workspace configuration</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Manage your workspace information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter organization name"
                />
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Logo</span>
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Task Assignments */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Task Assignments</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a task is assigned to you
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.taskAssignments}
                    onChange={() => toggleNotification("taskAssignments")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {/* Deadline Reminders */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Deadline Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders for upcoming task deadlines
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.deadlineReminders}
                    onChange={() => toggleNotification("deadlineReminders")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {/* Permit Status Changes */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Permit Status Changes</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when permit status updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.permitStatusChanges}
                    onChange={() => toggleNotification("permitStatusChanges")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {/* Comment Notifications */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Comment Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone comments on your tasks
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.commentNotifications}
                    onChange={() => toggleNotification("commentNotifications")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Manage integrations and third-party services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {integrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <Card key={integration.id} className="flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-muted ${integration.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                {integration.name}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {integration.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end gap-3">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              integration.status === "configured"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              integration.status === "configured"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {integration.status === "configured"
                              ? "Connected"
                              : "Not Connected"}
                          </Badge>
                        </div>
                        <Button
                          variant={
                            integration.status === "configured"
                              ? "outline"
                              : "default"
                          }
                          size="sm"
                          className="w-full"
                        >
                          {integration.status === "configured"
                            ? "Manage"
                            : "Connect"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Plan</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="rounded-lg border p-4 bg-blue-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">
                      Free Trial — 14 days remaining
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Trial expires on April 15, 2026
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Trial
                  </Badge>
                </div>
              </div>

              {/* Plan Features */}
              <div className="space-y-4">
                <h3 className="font-semibold">Trial Includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Up to 5 team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">All core features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
              </div>

              {/* Upgrade CTA */}
              <div className="pt-4">
                <Button size="lg" className="w-full md:w-auto">
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
