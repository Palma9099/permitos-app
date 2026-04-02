import { notFound } from "next/navigation";
import { getProjectById, getProjectPermits } from "@/lib/data/projects";
import { getTasks } from "@/lib/data/tasks";
import { getDocuments } from "@/lib/data/documents";
import { ProjectDetailClient } from "./project-detail-client";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const [tasks, documents, permits] = await Promise.all([
    getTasks({ projectId: id }),
    getDocuments({ projectId: id }),
    getProjectPermits(id),
  ]);

  return (
    <ProjectDetailClient
      project={project}
      tasks={tasks}
      documents={documents}
      permits={permits}
    />
  );
}
