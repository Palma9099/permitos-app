"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  FileCheck,
  CheckSquare,
  FileText,
  MapPin,
  Users,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Permits",
    href: "/permits",
    icon: FileCheck,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    label: "Jurisdictions",
    href: "/jurisdictions",
    icon: MapPin,
  },
  {
    label: "Team",
    href: "/team",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Match the base path
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard");
    }
    // For other routes, check if pathname starts with the href
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight">PermitOS</h1>
      </div>

      {/* Organization Switcher */}
      <div className="px-6 py-4 border-b border-slate-800">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors group">
          <div className="flex flex-col items-start flex-1 text-left">
            <span className="text-xs text-slate-400 font-medium">Organization</span>
            <span className="text-sm font-medium text-white group-hover:text-slate-200">
              Airavata Engineering
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative",
                active
                  ? "bg-slate-800 text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:rounded-r"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-800 text-xs text-slate-400">
        <p>PermitOS v1.0</p>
      </div>
    </aside>
  );
}
