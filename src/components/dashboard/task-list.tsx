import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/types";
import { formatRelativeDate } from "@/lib/format";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const overdueTasks = tasks.filter((t) => t.status === "overdue");
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      if (!acc[task.projectName]) {
        acc[task.projectName] = [];
      }
      acc[task.projectName].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{tasks.length} Tasks</CardTitle>
          {overdueTasks.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {overdueTasks.length} overdue
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {Object.entries(groupedTasks).map(([projectName, projectTasks]) => (
            <div key={projectName}>
              <div className="bg-muted/50 px-6 py-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {projectName}
                </p>
              </div>
              <div className="divide-y">
                {projectTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {task.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatRelativeDate(task.dueDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
