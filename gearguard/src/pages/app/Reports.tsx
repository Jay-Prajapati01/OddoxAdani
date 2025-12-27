import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Wrench,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { CanAccess } from "@/components/auth/CanAccess";

const requestsByTeam = [
  { team: "Mechanics", requests: 45, completed: 38 },
  { team: "Electricians", requests: 28, completed: 24 },
  { team: "IT Support", requests: 32, completed: 30 },
];

const requestsByCategory = [
  { name: "Machinery", value: 35, color: "hsl(230, 80%, 50%)" },
  { name: "Electronics", value: 20, color: "hsl(160, 84%, 39%)" },
  { name: "HVAC", value: 15, color: "hsl(25, 95%, 53%)" },
  { name: "Vehicles", value: 18, color: "hsl(199, 89%, 48%)" },
  { name: "IT Equipment", value: 12, color: "hsl(38, 92%, 50%)" },
];

const monthlyTrend = [
  { month: "Aug", corrective: 28, preventive: 22 },
  { month: "Sep", corrective: 32, preventive: 25 },
  { month: "Oct", corrective: 25, preventive: 28 },
  { month: "Nov", corrective: 30, preventive: 30 },
  { month: "Dec", corrective: 22, preventive: 32 },
  { month: "Jan", corrective: 18, preventive: 35 },
];

const kpiData = [
  {
    title: "Total Requests",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: Wrench,
    color: "bg-primary",
  },
  {
    title: "Completion Rate",
    value: "94%",
    change: "+3%",
    trend: "up",
    icon: CheckCircle2,
    color: "bg-success",
  },
  {
    title: "Avg. Resolution Time",
    value: "4.2h",
    change: "-15%",
    trend: "down",
    icon: Clock,
    color: "bg-info",
  },
  {
    title: "Overdue Tasks",
    value: "5",
    change: "-40%",
    trend: "down",
    icon: AlertTriangle,
    color: "bg-warning",
  },
];

const topEquipment = [
  { name: "CNC Machine #45", requests: 12, status: "high" },
  { name: "Conveyor Belt #8", requests: 9, status: "high" },
  { name: "Industrial Printer #7", requests: 7, status: "medium" },
  { name: "HVAC Unit #12", requests: 6, status: "medium" },
  { name: "Forklift #3", requests: 5, status: "low" },
];

export default function Reports() {
  const { isRole } = useAuth();
  const isManager = isRole("manager");

  // Show access denied for non-managers
  if (!isManager) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md">
          Reports and analytics are only available to Managers. 
          Contact your administrator if you need access to this section.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Insights into your maintenance operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiData.map((kpi, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  kpi.trend === "up" && kpi.title !== "Overdue Tasks" ? "text-success" :
                  kpi.trend === "down" && kpi.title === "Overdue Tasks" ? "text-success" :
                  kpi.trend === "down" && kpi.title === "Avg. Resolution Time" ? "text-success" :
                  "text-destructive"
                }`}>
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Requests by Team */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              Requests by Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestsByTeam} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="team" type="category" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="requests" name="Total Requests" fill="hsl(230, 80%, 50%)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Requests by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              Requests by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {requestsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            Monthly Request Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="corrective" 
                  name="Corrective" 
                  stroke="hsl(0, 84%, 60%)" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(0, 84%, 60%)" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="preventive" 
                  name="Preventive" 
                  stroke="hsl(160, 84%, 39%)" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(160, 84%, 39%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Equipment by Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="w-5 h-5 text-muted-foreground" />
            Equipment Requiring Most Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEquipment.map((equipment, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-sm font-medium text-primary">
                    {i + 1}
                  </div>
                  <span className="font-medium text-foreground">{equipment.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        equipment.status === "high" ? "bg-destructive" :
                        equipment.status === "medium" ? "bg-warning" : "bg-success"
                      }`}
                      style={{ width: `${(equipment.requests / 12) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    {equipment.requests} requests
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
