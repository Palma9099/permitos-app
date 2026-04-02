"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeByPartyData } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TimeByPartyChartProps {
  data: TimeByPartyData[];
}

export function TimeByPartyChart({ data }: TimeByPartyChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Time by Party</CardTitle>
        <CardDescription>
          Track how long your application stays with contractors, subcontractors, architects, owners, and AHJs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="contractor" fill="#3b82f6" name="Contractor" />
            <Bar dataKey="subcontractor" fill="#8b5cf6" name="Subcontractor" />
            <Bar dataKey="architect" fill="#ec4899" name="Architect" />
            <Bar dataKey="owner" fill="#f59e0b" name="Owner" />
            <Bar dataKey="ahj" fill="#10b981" name="AHJ" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
