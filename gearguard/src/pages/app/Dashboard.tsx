import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { ManagerWidgets } from "@/components/dashboard/ManagerWidgets";
import { TechnicianWidgets } from "@/components/dashboard/TechnicianWidgets";
import { AdminWidgets } from "@/components/dashboard/AdminWidgets";
import { UserWidgets } from "@/components/dashboard/UserWidgets";
import { AnimatedWidgetContainer } from "@/components/dashboard/AnimatedWidgetContainer";
import { Badge } from "@/components/ui/badge";
import { Monitor } from "lucide-react";
import { roleLabels } from "@/config/navigation";

export default function Dashboard() {
  const { user } = useAuth();
  const { getEffectiveRole, isPreviewActive, actualRole } = useDemo();
  
  const effectiveRole = getEffectiveRole();

  const renderDashboard = () => {
    switch (effectiveRole) {
      case "manager":
        return <ManagerWidgets />;
      case "technician":
        return <TechnicianWidgets />;
      case "admin":
        return <AdminWidgets />;
      case "user":
        return <UserWidgets />;
      default:
        return <ManagerWidgets />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Here's your personalized dashboard overview.
          </p>
        </div>
        
        {/* Demo Preview Indicator */}
        {isPreviewActive && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/10 border border-warning/30 animate-fade-in">
            <Monitor className="w-4 h-4 text-warning" />
            <span className="text-sm text-warning">
              Previewing as <strong>{effectiveRole && roleLabels[effectiveRole]}</strong>
            </span>
            {actualRole && (
              <Badge variant="outline" className="text-xs border-warning/30 text-warning">
                Your role: {roleLabels[actualRole]}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Role-specific widgets with animation */}
      <AnimatedWidgetContainer 
        roleKey={effectiveRole || "default"} 
        className={isPreviewActive ? "demo-mode-indicator" : ""}
      >
        {renderDashboard()}
      </AnimatedWidgetContainer>
    </div>
  );
}
