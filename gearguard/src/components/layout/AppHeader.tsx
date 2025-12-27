import { useState } from "react";
import { Bell, Search, Plus, User, LogOut, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { roleLabels, roleColors } from "@/config/navigation";
import { CanAccess } from "@/components/auth/CanAccess";
import { DemoRolePreview } from "@/components/demo/DemoRolePreview";
import { ProfileSheet } from "@/components/profile/ProfileSheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { user, logout } = useAuth();
  const { getEffectiveRole, isPreviewActive } = useDemo();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const effectiveRole = getEffectiveRole() || "user";
  const actualRole = user?.role || "user";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenProfile = () => {
    setIsProfileOpen(true);
  };

  const handleGoToSettings = () => {
    navigate("/app/settings");
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-30 h-16 border-b bg-card/80 backdrop-blur-lg transition-colors duration-300",
        isPreviewActive ? "border-warning/30" : "border-border"
      )}>
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Search */}
          <div className="flex-1 max-w-md ml-12 lg:ml-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment, requests..."
                className="pl-10 bg-muted/50 border-transparent focus:bg-background focus:border-border"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Demo Role Preview - Main Feature */}
            <DemoRolePreview />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Actual Role Badge (always shows actual role) */}
            <Badge 
              className={cn(
                "text-primary-foreground hidden md:flex transition-all duration-300",
                roleColors[actualRole],
                isPreviewActive && "opacity-60"
              )}
            >
              {roleLabels[actualRole]}
              {isPreviewActive && " (Actual)"}
            </Badge>

            {/* Quick Add - Role Aware using effective role */}
            <CanAccess roles={["manager", "admin", "user"]}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Quick Add</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <CanAccess roles={["admin"]}>
                    <DropdownMenuItem>New Equipment</DropdownMenuItem>
                  </CanAccess>
                  <CanAccess roles={["manager", "user"]}>
                    <DropdownMenuItem>New Maintenance Request</DropdownMenuItem>
                  </CanAccess>
                  <CanAccess roles={["admin"]}>
                    <DropdownMenuItem>New Team</DropdownMenuItem>
                  </CanAccess>
                </DropdownMenuContent>
              </DropdownMenu>
            </CanAccess>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]" variant="destructive">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{user?.name || "User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name}</span>
                      <span className="text-xs font-normal text-muted-foreground capitalize">
                        {roleLabels[actualRole]}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleOpenProfile} className="gap-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGoToSettings} className="gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive gap-2 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Sheet */}
      <ProfileSheet open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
}
