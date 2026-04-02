"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPermitTypeChange: (value: string) => void;
  searchValue?: string;
  statusValue?: string;
  permitTypeValue?: string;
}

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "intake", label: "Intake" },
  { value: "in_review", label: "In Review" },
  { value: "revision", label: "Revision" },
  { value: "approved", label: "Approved" },
  { value: "issued", label: "Issued" },
  { value: "on_hold", label: "On Hold" },
];

const permitTypes = [
  { value: "all", label: "All Permit Types" },
  { value: "building", label: "Building" },
  { value: "electrical", label: "Electrical" },
  { value: "mechanical", label: "Mechanical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "demolition", label: "Demolition" },
  { value: "roofing", label: "Roofing" },
  { value: "fire_alarm", label: "Fire Alarm" },
  { value: "sign", label: "Sign" },
];

export function ProjectFilters({
  onSearchChange,
  onStatusChange,
  onPermitTypeChange,
  searchValue = "",
  statusValue = "all",
  permitTypeValue = "all",
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by project name or address..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[250px]"
        />

        <select
          value={statusValue}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={permitTypeValue}
          onChange={(e) => onPermitTypeChange(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {permitTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
}
