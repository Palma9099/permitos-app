import { getDocuments } from "@/lib/data/documents";
import { mockProjects } from "@/lib/mock-data";
import { DocumentsPageClient } from "./documents-client";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  // Transform projects to match the component interface
  const projects = mockProjects.map((proj: any) => ({
    id: proj.id,
    name: proj.name,
    permitType: proj.permitType,
  }));

  return <DocumentsPageClient documents={documents} projects={projects} />;
}
