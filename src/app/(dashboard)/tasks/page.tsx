import { getTasks, getOverdueTasks } from "@/lib/data/tasks";
import { getProjects } from "@/lib/data/projects";
import { TasksPageClient } from "./tasks-client";

export default async function TasksPage() {
  const [tasks, overdueTasks, projects] = await Promise.all([
    getTasks(),
    getOverdueTasks(),
    getProjects(),
  ]);

  return (
    <TasksPageClient
      tasks={tasks}
      overdueCount={overdueTasks.length}
      projects={projects.map((p: any) => ({ id: p.id, name: p.name }))}
    />
  );
}
