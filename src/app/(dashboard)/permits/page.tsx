"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { mockPermits, mockProjects } from "@/lib/mock-data";
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/format";
import { Search } from "lucide-react";

export default function PermitsPage() {
  const [searchValue, setSearchValue] = React.useState("");

  const permitsWithProjects = useMemo(() => {
    return mockPermits.map((permit) => ({
      ...permit,
      project: mockProjects.find((p) => p.id === permit.projectId),
    }));
  }, []);

  const filteredPermits = useMemo(() => {
    if (!searchValue) return permitsWithProjects;
    const search = searchValue.toLowerCase();
    return permitsWithProjects.filter(
      (p) =>
        p.number?.toLowerCase().includes(search) ||
        p.project?.name.toLowerCase().includes(search)
    );
  }, [searchValue, permitsWithProjects]);

  const stats = {
    total: mockPermits.length,
    pending: mockPermits.filter((p) => p.status === "in_review").length,
    approved: mockPermits.filter((p) => p.status === "approved").length,
    issued: mockPermits.filter((p) => p.status === "issued").length,
  };

  const permitTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      building: "Building",
      electrical: "Electrical",
      mechanical: "Mechanical",
      plumbing: "Plumbing",
      demolition: "Demolition",
      roofing: "Roofing",
      fire_alarm: "Fire Alarm",
      sign: "Sign",
    };
    return labels[type] || type;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Permits</h1>
        <p className="text-muted-foreground">Track all active permits and their status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Permits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.issued}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by permit number or project name..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Permits Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permit Number</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Fees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermits.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell className="font-mono text-sm">
                      {permit.number || "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {permit.project?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {permitTypeLabel(permit.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(permit.status)}>
                        {getStatusLabel(permit.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {permit.submittedAt ? formatDate(permit.submittedAt) : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {permit.issuedAt ? formatDate(permit.issuedAt) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(permit.fees)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
