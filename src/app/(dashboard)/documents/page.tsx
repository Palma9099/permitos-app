import { getDocuments } from "@/lib/data/documents";
import { DocumentsPageClient } from "./documents-client";

export default async function DocumentsPage() {
  const documents = await getDocuments();
  return <DocumentsPageClient documents={documents} />;
}
