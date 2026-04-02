import { KPICards } from "@/components/dashboard/kpi-cards";
import { TimeByPartyChart } from "@/components/dashboard/time-by-party-chart";
import { ApprovalTimeChart } from "@/components/dashboard/approval-time-chart";
import { CommentRoundsChart } from "@/components/dashboard/comment-rounds-chart";
import { TaskList } from "@/components/dashboard/task-list";
import { AgentActivityPanel } from "@/components/dashboard/agent-activity";
import {
  mockKpiCards,
  mockTimeByPartyData,
  mockApprovalTimeData,
  mockCommentRoundsData,
  mockTasks,
  mockAgentActivities,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </div>

      {/* KPI Cards Row */}
      <KPICards cards={mockKpiCards} />

      {/* Main Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Charts (2/3 width) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Time by Party Chart */}
          <TimeByPartyChart data={mockTimeByPartyData} />

          {/* Approval Time and Comment Rounds Charts Row */}
          <div className="grid gap-8 md:grid-cols-2">
            <ApprovalTimeChart data={mockApprovalTimeData} />
            <CommentRoundsChart data={mockCommentRoundsData} />
          </div>
        </div>

        {/* Right Column - Task List and Agent Activity (1/3 width) */}
        <div className="space-y-8">
          <TaskList tasks={mockTasks} />
          <AgentActivityPanel activities={mockAgentActivities} />
        </div>
      </div>
    </div>
  );
}
