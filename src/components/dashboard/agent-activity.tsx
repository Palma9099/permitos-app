import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AgentActivity } from "@/lib/types";
import {
  Search,
  Edit3,
  Send,
  FileText,
  CheckCircle,
  Sparkles,
} from "lucide-react";

interface AgentActivityPanelProps {
  activities: AgentActivity[];
}

export function AgentActivityPanel({ activities }: AgentActivityPanelProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "research":
        return <Search className="h-5 w-5 text-blue-500" />;
      case "revision":
        return <Edit3 className="h-5 w-5 text-purple-500" />;
      case "submission":
        return <Send className="h-5 w-5 text-indigo-500" />;
      case "preparation":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "analysis":
        return <FileText className="h-5 w-5 text-cyan-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-base">Agents processing...</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4 p-6">
          {activities.map((activity) => (
            <div key={activity.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                {activity.status === "completed" && (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                )}
              </div>
              {activity.status === "in_progress" && (
                <div className="ml-8 space-y-1">
                  <Progress value={activity.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {activity.progress}% complete
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
