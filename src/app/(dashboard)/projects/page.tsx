import { getProjects } from "@/lib/data/projects";
import { ProjectsPageClient } from "./projects-client";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}
