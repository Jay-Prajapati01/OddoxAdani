import { Link } from "react-router-dom";
import {
  Wrench,
  Users,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Server,
  Shield,
  Settings,
  Plus,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRealTimeUpdates } from "@/hooks/useRoleSync";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useTeams } from "@/contexts/TeamsContext";
import { cn } from "@/lib/utils";

const systemHealth = [
  { name: "Database", status: "healthy", uptime: 99.9 },
  { name: "API Services", status: "healthy", uptime: 99.8 },
  { name: "Storage", status: "healthy", uptime: 100, usage: 45 },
  { name: "Scheduled Jobs", status: "healthy", uptime: 99.5 },
];

const recentEquipment = [
  { name: "CNC Machine #50", action: "Added", date: "2 hours ago" },
  { name: "Forklift #10", action: "Updated", date: "5 hours ago" },
  { name: "Generator #2", action: "Scrapped", date: "1 day ago" },
];

const userActivity = [
  { user: "Sarah Manager", action: "Created maintenance request", time: "10 min ago" },
  { user: "Mike Technician", action: "Completed task", time: "25 min ago" },
  { user: "Admin", action: "Updated team configuration", time: "1 hour ago" },
];

export function AdminWidgets() {
  const { updateKey, isPreviewActive } = useRealTimeUpdates();
  const { requests, lastUpdate: maintenanceUpdate } = useMaintenance();
  const { equipment, lastUpdate: equipmentUpdate } = useEquipment();
  const { teams, lastUpdate: teamsUpdate } = useTeams();
  
  // Calculate real-time stats
  const totalEquipment = equipment.length;
  const totalTeams = teams.length;
  const openRequests = requests.filter(r => r.status === "new" || r.status === "in_progress").length;
  const closedThisMonth = requests.filter(r => r.status === "repaired" || r.status === "scrap").length;
  
  const systemStats = [
    {
      title: "Total Equipment",
      value: totalEquipment.toString(),
      change: equipment.filter(e => e.status === "operational").length > 0 ? `+${equipment.filter(e => e.status === "operational").length}` : "0",
      icon: Wrench,
      color: "bg-primary",
    },
    {
      title: "Maintenance Teams",
      value: totalTeams.toString(),
      change: teams.reduce((sum, t) => sum + t.members.length, 0) > 0 ? `${teams.reduce((sum, t) => sum + t.members.length, 0)} members` : "0",
      icon: Users,
      color: "bg-secondary",
    },
    {
      title: "Open Requests",
      value: openRequests.toString(),
      subtitle: "Active",
      icon: ClipboardList,
      color: "bg-warning",
    },
    {
      title: "Closed This Month",
      value: closedThisMonth.toString(),
      subtitle: "Resolved",
      icon: CheckCircle2,
      color: "bg-success",
    },
  ];
  
  return (
    <div key={`${updateKey}-${maintenanceUpdate}-${equipmentUpdate}-${teamsUpdate}`} className={cn("space-y-6 animate-widget-enter", isPreviewActive && "pointer-events-none")}>
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System configuration and management</p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/equipment">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Equipment
            </Button>
          </Link>
          <Link to="/app/teams">
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              Manage Teams
            </Button>
          </Link>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {systemStats.map((stat, i) => (
          <div
            key={i}
            className="kpi-card animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              {stat.change && (
                <Badge variant="success" className="text-xs">{stat.change}</Badge>
              )}
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Server className="w-5 h-5 text-muted-foreground" />
              System Health
            </CardTitle>
            <Badge variant="success" className="gap-1">
              <Activity className="w-3 h-3" />
              All Systems Operational
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealth.map((system, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    system.status === "healthy" ? "bg-success" : "bg-warning"
                  }`} />
                  <span className="text-sm font-medium text-foreground">{system.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{system.uptime}% uptime</span>
                  {system.usage !== undefined && (
                    <div className="w-16">
                      <Progress value={system.usage} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Equipment Changes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-muted-foreground" />
              Recent Equipment
            </CardTitle>
            <Link to="/app/equipment">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEquipment.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="font-medium text-foreground text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.date}</div>
                </div>
                <Badge variant={
                  item.action === "Added" ? "success" :
                  item.action === "Scrapped" ? "destructive" : "outline"
                }>
                  {item.action}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/app/equipment">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/30 hover:border-primary">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Wrench className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Equipment Management</div>
                <div className="text-sm text-muted-foreground">Add, edit, or scrap equipment</div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </CardContent>
          </Card>
        </Link>
        <Link to="/app/teams">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-secondary/30 hover:border-secondary">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Team Management</div>
                <div className="text-sm text-muted-foreground">Configure maintenance teams</div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-secondary" />
            </CardContent>
          </Card>
        </Link>
        <Link to="/app/settings">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-warning/30 hover:border-warning">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">System Settings</div>
                <div className="text-sm text-muted-foreground">Configure application</div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-warning" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
