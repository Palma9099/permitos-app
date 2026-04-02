"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  formatPercent,
  getStatusColor,
  getStatusLabel,
} from "@/lib/format";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ProjectTableProps {
  projects: Project[];
  searchValue?: string;
  statusFilter?: string;
  permitTypeFilter?: string;
}

export function ProjectTable({
  projects,
  searchValue = "",
  statusFilter = "all",
  permitTypeFilter = "all",
}: ProjectTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(search) ||
          project.address.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Apply permit type filter
    if (permitTypeFilter && permitTypeFilter !== "all") {
      filtered = filtered.filter((project) => project.permitType === permitTypeFilter);
    }

    return filtered;
  }, [projects, searchValue, statusFilter, permitTypeFilter]);

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center gap-2 font-semibold"
          >
            Project Name
            {sorted === "asc" && <ChevronUp className="h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="h-4 w-4" />}
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.address}, {row.original.city}, {row.original.state}{" "}
            {row.original.zipCode}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "jurisdiction",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center gap-2 font-semibold"
          >
            Jurisdiction
            {sorted === "asc" && <ChevronUp className="h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="h-4 w-4" />}
          </button>
        );
      },
      cell: ({ row }) => <span className="text-sm">{row.original.jurisdiction}</span>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center gap-2 font-semibold"
          >
            Status
            {sorted === "asc" && <ChevronUp className="h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="h-4 w-4" />}
          </button>
        );
      },
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "permitType",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center gap-2 font-semibold"
          >
            Permit Type
            {sorted === "asc" && <ChevronUp className="h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="h-4 w-4" />}
          </button>
        );
      },
      cell: ({ row }) => (
        <span className="text-sm capitalize">
          {row.original.permitType.replace("_", " ")}
        </span>
      ),
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800">
            {row.original.assignee.initials}
          </div>
          <span className="text-sm">{row.original.assignee.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center gap-2 font-semibold"
          >
            Submitted
            {sorted === "asc" && <ChevronUp className="h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="h-4 w-4" />}
          </button>
        );
      },
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.submittedAt
            ? formatDate(row.original.submittedAt)
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "commentRounds",
      header: "Comment Rounds",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.commentRounds}</span>
      ),
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress =
          (row.original.completedTasks / row.original.totalTasks) * 100;
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {formatPercent(progress)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "value",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <button
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center gap-2 font-semibold"
          >
            Value
            {sorted === "asc" && <ChevronUp className="h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="h-4 w-4" />}
          </button>
        );
      },
      cell: ({ row }) => (
        <span className="text-sm font-medium">{formatCurrency(row.original.value)}</span>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredProjects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  const handleRowClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleRowClick(row.original.id)}
                className="cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
