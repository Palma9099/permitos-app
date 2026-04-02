"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink } from "lucide-react";

interface Jurisdiction {
  id: string;
  name: string;
  phone: string;
  portalUrl: string;
  windSpeed: string;
  hvhzStatus: boolean;
  floodZone: string;
  activeProjects: number;
}

const mockJurisdictions: Jurisdiction[] = [
  {
    id: "j-1",
    name: "City of Miami",
    phone: "(305) 416-1400",
    portalUrl: "https://www.miamigov.com",
    windSpeed: "145 mph",
    hvhzStatus: true,
    floodZone: "AE, A",
    activeProjects: 5,
  },
  {
    id: "j-2",
    name: "Miami-Dade County",
    phone: "(786) 315-4500",
    portalUrl: "https://www.miamidade.gov",
    windSpeed: "150 mph",
    hvhzStatus: true,
    floodZone: "AE, A, X",
    activeProjects: 3,
  },
  {
    id: "j-3",
    name: "City of Fort Lauderdale",
    phone: "(954) 828-5700",
    portalUrl: "https://www.fortlauderdale.gov",
    windSpeed: "145 mph",
    hvhzStatus: true,
    floodZone: "AE, A",
    activeProjects: 2,
  },
  {
    id: "j-4",
    name: "Broward County",
    phone: "(954) 357-8000",
    portalUrl: "https://www.broward.org",
    windSpeed: "140 mph",
    hvhzStatus: false,
    floodZone: "X, A",
    activeProjects: 1,
  },
  {
    id: "j-5",
    name: "City of Coral Gables",
    phone: "(305) 446-6800",
    portalUrl: "https://www.coralgables.com",
    windSpeed: "150 mph",
    hvhzStatus: true,
    floodZone: "AE, A",
    activeProjects: 2,
  },
  {
    id: "j-6",
    name: "City of Hollywood",
    phone: "(954) 921-3500",
    portalUrl: "https://www.hollywoodfl.org",
    windSpeed: "145 mph",
    hvhzStatus: true,
    floodZone: "AE, A",
    activeProjects: 1,
  },
  {
    id: "j-7",
    name: "City of Hialeah",
    phone: "(305) 883-5500",
    portalUrl: "https://www.hialeahfl.gov",
    windSpeed: "150 mph",
    hvhzStatus: true,
    floodZone: "X, A",
    activeProjects: 2,
  },
  {
    id: "j-8",
    name: "City of Pembroke Pines",
    phone: "(954) 392-2000",
    portalUrl: "https://www.pembrokepines.org",
    windSpeed: "140 mph",
    hvhzStatus: false,
    floodZone: "X",
    activeProjects: 1,
  },
];

export default function JurisdictionsPage() {
  const [searchValue, setSearchValue] = useState("");

  const filteredJurisdictions = useMemo(() => {
    if (!searchValue) return mockJurisdictions;
    const search = searchValue.toLowerCase();
    return mockJurisdictions.filter((j) =>
      j.name.toLowerCase().includes(search)
    );
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Jurisdictions</h1>
        <p className="text-muted-foreground">
          Building department contacts, portals, and requirements
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jurisdictions..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Jurisdictions Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredJurisdictions.length > 0 ? (
          filteredJurisdictions.map((jurisdiction) => (
            <Card key={jurisdiction.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{jurisdiction.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {jurisdiction.activeProjects}{" "}
                    {jurisdiction.activeProjects === 1 ? "project" : "projects"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Phone */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Building Department
                  </p>
                  <a
                    href={`tel:${jurisdiction.phone}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {jurisdiction.phone}
                  </a>
                </div>

                {/* Portal */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Permit Portal
                  </p>
                  <a
                    href={jurisdiction.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Open Portal
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Building Requirements */}
                <div className="pt-2 border-t space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Wind Speed
                      </p>
                      <p className="text-sm font-medium">{jurisdiction.windSpeed}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">
                        HVHZ
                      </p>
                      <Badge
                        variant={jurisdiction.hvhzStatus ? "default" : "secondary"}
                      >
                        {jurisdiction.hvhzStatus ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Flood Zone
                    </p>
                    <p className="text-sm font-medium">{jurisdiction.floodZone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed py-12">
            <p className="text-muted-foreground">No jurisdictions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
