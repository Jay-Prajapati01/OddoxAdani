import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Shield, Menu, X, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { getNavigationForRole, roleLabels, roleColors } from "@/config/navigation";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { role: actualRole } = useAuth();
  const { getEffectiveRole, isPreviewActive } = useDemo();

  const effectiveRole = getEffectiveRole();
  const navigation = getNavigationForRole(effectiveRole);

  const isActive = (href: string) => {
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border",
        collapsed && "justify-center px-2"
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sidebar-foreground">GearGuard</span>
            <span className="text-xs text-sidebar-foreground/60">Maintenance Tracker</span>
          </div>
        )}
      </div>

      {/* Role Badge with Preview Indicator */}
      {!collapsed && effectiveRole && (
        <div className="px-4 py-3 border-b border-sidebar-border space-y-2">
          <Badge 
            className={cn(
              "w-full justify-center transition-all duration-300",
              roleColors[effectiveRole],
              "text-primary-foreground"
            )}
          >
            {roleLabels[effectiveRole]}
          </Badge>
          
          {/* Demo Mode Indicator */}
          {isPreviewActive && (
            <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-warning/10 border border-warning/30 animate-fade-in">
              <Monitor className="w-3 h-3 text-warning" />
              <span className="text-[10px] font-medium text-warning">Demo Preview</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item, index) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "nav-link opacity-0 animate-slide-in-left",
              isActive(item.href) && "nav-link-active",
              collapsed && "justify-center px-2"
            )}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse Button - Desktop Only */}
      <div className="hidden lg:block p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-card shadow-md"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transform transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-sidebar-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          isPreviewActive ? "border-warning/30" : "border-sidebar-border"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
