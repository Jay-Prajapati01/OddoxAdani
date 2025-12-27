import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Shield,
  Wrench,
  User,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useNavigate } from "react-router-dom";

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleInfo: Record<string, { color: string; bgColor: string; description: string; permissions: string[] }> = {
  admin: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    description: "Full system access with user and equipment management capabilities",
    permissions: ["Manage Equipment", "Manage Teams", "Manage Users", "System Settings", "View All Data"],
  },
  manager: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    description: "Oversee maintenance operations and manage technician assignments",
    permissions: ["View Reports", "Schedule Maintenance", "Assign Tasks", "View Calendar", "Manage Requests"],
  },
  technician: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    description: "Execute maintenance tasks and update work progress",
    permissions: ["View Tasks", "Update Status", "Log Duration", "View Calendar", "Self-Assign"],
  },
  user: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    description: "Submit maintenance requests and track their status",
    permissions: ["Create Requests", "View My Requests", "Track Status"],
  },
};

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const { user } = useAuth();
  const { getEffectiveRole, isPreviewActive } = useDemo();
  const { requests } = useMaintenance();
  const navigate = useNavigate();

  const effectiveRole = getEffectiveRole() || user?.role || "user";
  const roleData = roleInfo[effectiveRole];

  // Calculate stats
  const completedTasks = requests.filter(r => r.status === "repaired").length;
  const totalTasks = requests.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressTasks = requests.filter(r => r.status === "in_progress").length;

  const handleGoToSettings = () => {
    onOpenChange(false);
    navigate("/app/settings");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>Your account information and statistics</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Header */}
          <div className="relative">
            {/* Gradient Background */}
            <div className="h-24 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center -mt-12 relative z-10">
              <Avatar className="w-24 h-24 border-4 border-card shadow-xl ring-4 ring-primary/20">
                <AvatarImage src={user?.avatar} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                  {user?.name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-1/2 translate-x-12 w-5 h-5 rounded-full bg-success border-2 border-card" title="Online" />
            </div>

            {/* User Info */}
            <div className="text-center mt-4">
              <h3 className="text-xl font-bold text-foreground">{user?.name || "User"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              
              {/* Role Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mt-3 ${roleData.bgColor} ${roleData.color} font-semibold text-sm`}>
                {effectiveRole === "admin" && <Shield className="w-4 h-4" />}
                {effectiveRole === "manager" && <Briefcase className="w-4 h-4" />}
                {effectiveRole === "technician" && <Wrench className="w-4 h-4" />}
                {effectiveRole === "user" && <User className="w-4 h-4" />}
                <span className="capitalize">{effectiveRole}</span>
                {isPreviewActive && (
                  <Badge variant="outline" className="ml-1 text-xs">Preview</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Performance</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Completed</span>
                </div>
                <div className="text-2xl font-bold text-foreground mt-1">{completedTasks}</div>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-br from-success/5 to-success/10 border border-success/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground">Success Rate</span>
                </div>
                <div className="text-2xl font-bold text-foreground mt-1">{completionRate}%</div>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-br from-warning/5 to-warning/10 border border-warning/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-xs text-muted-foreground">In Progress</span>
                </div>
                <div className="text-2xl font-bold text-foreground mt-1">{inProgressTasks}</div>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-br from-info/5 to-info/10 border border-info/20">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-info" />
                  <span className="text-xs text-muted-foreground">Tier</span>
                </div>
                <div className="text-2xl font-bold text-foreground mt-1">Gold</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Role Permissions */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Permissions</h4>
            <p className="text-xs text-muted-foreground mb-3">{roleData.description}</p>
            <div className="flex flex-wrap gap-2">
              {roleData.permissions.map((permission, i) => (
                <Badge key={i} variant="secondary" className="gap-1 py-1 px-2 text-xs">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  {permission}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Account Details */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Account Details</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium">{user?.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="text-sm font-medium">+1 555-0123</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="text-sm font-medium">Manufacturing City, MC</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Department</div>
                  <div className="text-sm font-medium">Maintenance Operations</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Member Since</div>
                  <div className="text-sm font-medium">January 2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4">
            <Button className="w-full gap-2" onClick={handleGoToSettings}>
              <Settings className="w-4 h-4" />
              Edit Profile Settings
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
