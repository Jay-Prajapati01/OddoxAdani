import { useState } from "react";
import { UserRole } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, User, Wrench, Shield, UserCog, X, Monitor } from "lucide-react";
import { roleLabels, roleColors } from "@/config/navigation";
import { cn } from "@/lib/utils";

const roleIcons: Record<UserRole, React.ElementType> = {
  manager: UserCog,
  technician: Wrench,
  admin: Shield,
  user: User,
};

const roleDescriptions: Record<UserRole, string> = {
  manager: "Planning, oversight & reports",
  technician: "Task execution & Kanban",
  admin: "System configuration",
  user: "Request submission only",
};

export function DemoRolePreview() {
  const { 
    isDemoMode, 
    previewRole, 
    actualRole, 
    isPreviewActive, 
    setPreviewRole, 
    clearPreview 
  } = useDemo();
  const [isOpen, setIsOpen] = useState(false);

  // Only show if demo mode is enabled OR user is admin
  if (!isDemoMode && actualRole !== "admin") {
    return null;
  }

  const roles: UserRole[] = ["manager", "technician", "admin", "user"];
  const effectiveRole = previewRole || actualRole;

  return (
    <div className="flex items-center gap-2">
      {/* Demo Mode Active Badge */}
      {isPreviewActive && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 border border-warning/30 animate-fade-in">
              <Monitor className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-medium text-warning">Demo Mode</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[250px]">
            <p className="text-sm">
              You are previewing the dashboard as a different role. 
              Permissions are simulated for evaluation purposes only.
            </p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Clear Preview Button */}
      {isPreviewActive && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearPreview}
              className="h-7 px-2 text-warning hover:text-warning hover:bg-warning/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exit preview mode</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Preview Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isPreviewActive ? "outline" : "secondary"}
                size="sm"
                className={cn(
                  "gap-2 transition-all duration-300",
                  isPreviewActive && "border-warning/50 bg-warning/5 hover:bg-warning/10"
                )}
              >
                <Eye className={cn("w-4 h-4", isPreviewActive && "text-warning")} />
                <span className="hidden sm:inline">
                  {isPreviewActive ? "Previewing" : "Preview As"}
                </span>
                {effectiveRole && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-1 text-xs",
                      isPreviewActive ? "bg-warning/20 text-warning border-warning/30" : ""
                    )}
                  >
                    {roleLabels[effectiveRole]}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Preview dashboard as different role (Demo)</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium">Role Preview (Demo)</div>
              <div className="text-xs font-normal text-muted-foreground">
                Preview permissions only
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {roles.map((r) => {
            const Icon = roleIcons[r];
            const isActive = effectiveRole === r;
            const isActualRole = actualRole === r;
            
            return (
              <DropdownMenuItem
                key={r}
                onClick={() => {
                  setPreviewRole(r);
                  setIsOpen(false);
                }}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  isActive && "bg-primary/10"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive ? roleColors[r] : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4 transition-colors duration-300",
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{roleLabels[r]}</span>
                      {isActualRole && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          Your Role
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {roleDescriptions[r]}
                    </div>
                  </div>
                  {isActive && !isActualRole && (
                    <Badge variant="secondary" className="text-[10px] bg-warning/20 text-warning">
                      Preview
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}

          {isPreviewActive && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  clearPreview();
                  setIsOpen(false);
                }}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Exit Preview Mode
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
