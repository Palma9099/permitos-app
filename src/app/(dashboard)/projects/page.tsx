import { getProjects } from "@/lib/data/projects";
import { ProjectsPageClient } from "./projects-client";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}
