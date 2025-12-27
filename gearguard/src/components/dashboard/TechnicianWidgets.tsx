import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Kanban,
  Calendar,
  Timer,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRealTimeUpdates } from "@/hooks/useRoleSync";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { cn } from "@/lib/utils";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge variant="info">New</Badge>;
    case "in_progress":
      return <Badge variant="warning">In Progress</Badge>;
    case "scheduled":
      return <Badge variant="outline">Scheduled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-l-destructive";
    case "medium":
      return "border-l-warning";
    case "low":
      return "border-l-success";
    default:
      return "border-l-muted";
  }
};

export function TechnicianWidgets() {
  const { updateKey, isPreviewActive } = useRealTimeUpdates();
  const { requests, lastUpdate } = useMaintenance();
  
  // Real-time data from shared context
  const myAssignedTasks = requests.filter(r => 
    r.status === "new" || r.status === "in_progress"
  ).slice(0, 5);
  
  const totalAssigned = requests.filter(r => r.status === "new" || r.status === "in_progress").length;
  const inProgress = requests.filter(r => r.status === "in_progress").length;
  const completedToday = requests.filter(r => r.status === "repaired").length;
  
  const overdueAssigned = requests.filter(r => 
    new Date(r.dueDate) < new Date() && 
    r.status !== "repaired" && 
    r.status !== "scrap"
  );

  const todayJobs = myAssignedTasks.slice(0, 3).map((task, i) => ({
    time: `${9 + i * 2}:00`,
    task: `${task.equipment} - ${task.subject}`,
    status: task.status
  }));

  return (
    <div key={`${updateKey}-${lastUpdate}`} className={cn("space-y-6 animate-widget-enter", isPreviewActive && "pointer-events-none")}>
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Workspace</h1>
          <p className="text-muted-foreground">Manage and complete your assigned tasks</p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/maintenance">
            <Button className="gap-2">
              <Kanban className="w-4 h-4" />
              Open Kanban Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-info-light border-info/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalAssigned}</div>
              <div className="text-sm text-muted-foreground">Assigned Tasks</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning-light border-warning/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning flex items-center justify-center">
              <Play className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success-light border-success/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{completedToday}</div>
              <div className="text-sm text-muted-foreground">Completed Today</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Assigned Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-muted-foreground" />
              My Assigned Tasks
            </CardTitle>
            <Link to="/app/maintenance">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {myAssignedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border border-border border-l-4 ${getPriorityColor(task.priority)} hover:bg-muted/50 transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-foreground">{task.subject}</div>
                    <div className="text-sm text-muted-foreground">{task.equipment}</div>
                  </div>
                  {getStatusBadge(task.status)}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      {task.actualHours || 0}/{task.estimatedHours}h
                    </span>
                    <span className="text-warning font-medium">
                      Due: {task.dueDate}
                    </span>
                  </div>
                  <div className="w-24">
                    <Progress value={((task.actualHours || 0) / task.estimatedHours) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Schedule & Overdue */}
        <div className="space-y-6">
          {/* Today's Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayJobs.map((job, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="text-sm font-mono text-muted-foreground w-12">{job.time}</div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground">{job.task}</div>
                  </div>
                  {getStatusBadge(job.status)}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Overdue */}
          {overdueAssigned.length > 0 && (
            <Card className="border-destructive/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Overdue Tasks ({overdueAssigned.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueAssigned.slice(0, 3).map((task) => {
                  const daysOverdue = Math.ceil((new Date().getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={task.id} className="p-3 rounded-lg bg-destructive/10">
                      <div className="font-medium text-foreground text-sm">{task.subject}</div>
                      <div className="text-xs text-muted-foreground">{task.equipment}</div>
                      <div className="text-xs text-destructive font-medium mt-1">
                        {daysOverdue} day(s) overdue
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Quick Link to Kanban */}
          <Link to="/app/maintenance">
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-primary/5 border-primary/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Kanban className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">Kanban Board</div>
                  <div className="text-sm text-muted-foreground">Drag & drop to update status</div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-primary" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
