import { getProjects } from "@/lib/data/projects";
import { getTasks, getOverdueTasks } from "@/lib/data/tasks";
import { getDocuments } from "@/lib/data/documents";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  // Fetch all data in parallel
  const [projects, tasks, documents, overdueTasks] = await Promise.all([
    getProjects(),
    getTasks(),
    getDocuments(),
    getOverdueTasks(),
  ]);

  // Compute KPIs
  const activeProjects = projects.filter((p: any) => p.status !== "CLOSED");
  const inReviewProjects = projects.filter((p: any) => p.status === "IN_REVIEW");
  const revisionProjects = projects.filter((p: any) => p.status === "REVISION");

  // Count projects by status for pipeline breakdown
  const intakeProjects = projects.filter((p: any) => p.status === "INTAKE").length;
  const draftingProjects = projects.filter((p: any) => p.status === "DRAFTING").length;
  const submittedProjects = projects.filter((p: any) => p.status === "SUBMITTED").length;
  const internalReviewProjects = projects.filter((p: any) => p.status === "INTERNAL_REVIEW").length;
  const approvedProjects = projects.filter((p: any) => p.status === "APPROVED").length;
  const issuedProjects = projects.filter((p: any) => p.status === "ISSUED").length;
  const onHoldProjects = projects.filter((p: any) => p.status === "ON_HOLD").length;

  // Count documents pending review
  const docsPendingReview = documents.length;

  // Total pipeline value
  const totalPipelineValue = activeProjects.reduce((sum: number, p: any) => sum + (p.value || 0), 0);

  // Needing action = overdue tasks + revision projects
  const needingAction = overdueTasks.length + revisionProjects.length;

  // Average comment rounds from active projects
  const avgCommentRounds =
    activeProjects.length > 0
      ? Math.round(
          activeProjects.reduce((sum: number, p: any) => sum + (p.commentRounds || 0), 0) /
            activeProjects.length
        )
      : 0;

  // Project pipeline breakdown
  const pipelineBreakdown = {
    intake: intakeProjects,
    drafting: draftingProjects,
    internal_review: internalReviewProjects,
    submitted: submittedProjects,
    in_review: inReviewProjects.length,
    revision: revisionProjects.length,
    approved: approvedProjects,
    issued: issuedProjects,
    on_hold: onHoldProjects,
  };

  // Projects needing attention (revision or with overdue tasks)
  const projectsNeedingAttention = projects.filter(
    (p: any) =>
      p.status === "REVISION" ||
      overdueTasks.some((t: any) => t.projectId === p.id)
  );

  return (
    <DashboardClient
      activeProjectsCount={activeProjects.length}
      activeProjectsBreakdown={{
        intake: intakeProjects,
        drafting: draftingProjects,
        submitted: submittedProjects,
      }}
      inReviewCount={inReviewProjects.length}
      needingActionCount={needingAction}
      totalPipelineValue={totalPipelineValue}
      pipelineBreakdown={pipelineBreakdown}
      overdueTasks={overdueTasks}
      projectsNeedingAttention={projectsNeedingAttention}
      docsPendingReview={docsPendingReview}
      avgCommentRounds={avgCommentRounds}
    />
  );
}
