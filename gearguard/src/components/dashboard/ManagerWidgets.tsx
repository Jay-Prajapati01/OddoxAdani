import { Link } from "react-router-dom";
import {
  Wrench,
  ClipboardList,
  AlertTriangle,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealTimeUpdates } from "@/hooks/useRoleSync";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { cn } from "@/lib/utils";

const teamWorkload = [
  { team: "Mechanics", assigned: 8, available: 3, color: "bg-primary" },
  { team: "Electricians", assigned: 4, available: 2, color: "bg-warning" },
  { team: "IT Support", assigned: 5, available: 4, color: "bg-info" },
];

export function ManagerWidgets() {
  const { updateKey, isPreviewActive } = useRealTimeUpdates();
  const { requests, lastUpdate } = useMaintenance();
  
  // Real-time data from shared context
  const openRequests = requests.filter(r => r.status === "new" || r.status === "in_progress").length;
  const completedToday = requests.filter(r => r.status === "repaired").length;
  const preventiveCount = requests.filter(r => r.type === "preventive").length;
  
  const overdueAlerts = requests.filter(r => 
    new Date(r.dueDate) < new Date() && 
    r.status !== "repaired" && 
    r.status !== "scrap"
  );

  const upcomingPreventive = requests
    .filter(r => r.type === "preventive" && r.status !== "repaired" && r.status !== "scrap")
    .slice(0, 3)
    .map(r => ({
      equipment: r.equipment,
      date: r.dueDate,
      type: r.subject
    }));

  const kpiCards = [
    {
      title: "Total Equipment",
      value: "248",
      change: "+12 this month",
      changeType: "positive",
      icon: Wrench,
      color: "bg-primary",
    },
    {
      title: "Open Requests",
      value: openRequests.toString(),
      change: `${overdueAlerts.length} overdue`,
      changeType: overdueAlerts.length > 0 ? "warning" : "positive",
      icon: ClipboardList,
      color: "bg-warning",
    },
    {
      title: "Completed Today",
      value: completedToday.toString(),
      change: "In repaired status",
      changeType: "positive",
      icon: CheckCircle2,
      color: "bg-success",
    },
    {
      title: "Preventive Tasks",
      value: preventiveCount.toString(),
      change: "Scheduled maintenance",
      changeType: "neutral",
      icon: Calendar,
      color: "bg-info",
    },
  ];
  
  return (
    <div key={`${updateKey}-${lastUpdate}`} className={cn("space-y-6 animate-widget-enter", isPreviewActive && "pointer-events-none")}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-muted-foreground">Plan and oversee maintenance operations</p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/calendar">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Preventive
            </Button>
          </Link>
          <Link to="/app/maintenance">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiCards.map((kpi, i) => (
          <div
            key={i}
            className="kpi-card animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <TrendingUp className={`w-5 h-5 ${
                kpi.changeType === "positive" ? "text-success" : 
                kpi.changeType === "warning" ? "text-warning" : "text-muted-foreground"
              }`} />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{kpi.value}</div>
            <div className="text-sm text-muted-foreground">{kpi.title}</div>
            <div className={`text-xs mt-2 ${
              kpi.changeType === "positive" ? "text-success" : 
              kpi.changeType === "warning" ? "text-warning" : "text-muted-foreground"
            }`}>
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Team Workload */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              Team Workload
            </CardTitle>
            <Link to="/app/teams">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamWorkload.map((team, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${team.color}`} />
                  <span className="font-medium text-foreground">{team.team}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{team.assigned} assigned</Badge>
                  <Badge variant="success">{team.available} available</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Calendar Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              Upcoming Preventive
            </CardTitle>
            <Link to="/app/calendar">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Calendar
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingPreventive.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="font-medium text-foreground text-sm">{item.equipment}</div>
                  <div className="text-xs text-muted-foreground">{item.type}</div>
                </div>
                <Badge variant={item.date === "Today" ? "warning" : "outline"}>{item.date}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overdue Alerts */}
        <Card className={cn("border-warning/50", overdueAlerts.length === 0 && "border-success/50")}>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className={cn(
              "text-lg font-semibold flex items-center gap-2",
              overdueAlerts.length > 0 ? "text-warning" : "text-success"
            )}>
              <AlertTriangle className="w-5 h-5" />
              {overdueAlerts.length > 0 ? `Overdue Alerts (${overdueAlerts.length})` : "All Tasks On Track"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueAlerts.length === 0 ? (
              <div className="text-center py-4 text-success">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No overdue tasks!</p>
              </div>
            ) : (
              overdueAlerts.slice(0, 3).map((alert) => {
                const daysOverdue = Math.ceil((new Date().getTime() - new Date(alert.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                    <div>
                      <div className="font-medium text-foreground text-sm">{alert.equipment}</div>
                      <div className="text-xs text-warning font-medium">{daysOverdue} day(s) overdue</div>
                    </div>
                    <Button size="sm" variant="warning">Assign</Button>
                  </div>
                );
              })
            )}
            <Link to="/app/maintenance" className="block">
              <Button variant="outline" className="w-full gap-2 mt-2">
                View All Tasks
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
