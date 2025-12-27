import { ReactNode } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CanAccessProps {
  permission?: string;
  roles?: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  useEffectiveRole?: boolean;
}

export function CanAccess({ 
  permission, 
  roles, 
  children, 
  fallback = null,
  useEffectiveRole = true 
}: CanAccessProps) {
  const { hasPermission, isRole, role: actualRole } = useAuth();
  const { getEffectiveRole } = useDemo();
  
  const effectiveRole = useEffectiveRole ? getEffectiveRole() : actualRole;

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  }

  if (roles && hasAccess) {
    if (useEffectiveRole && effectiveRole) {
      hasAccess = roles.includes(effectiveRole);
    } else {
      hasAccess = isRole(...roles);
    }
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ProtectedButtonProps {
  permission?: string;
  roles?: UserRole[];
  children: ReactNode;
  tooltip?: string;
  hideWhenDisabled?: boolean;
  useEffectiveRole?: boolean;
}

export function ProtectedButton({
  permission,
  roles,
  children,
  tooltip = "You don't have permission to perform this action",
  hideWhenDisabled = false,
  useEffectiveRole = true,
}: ProtectedButtonProps) {
  const { hasPermission, isRole, role: actualRole } = useAuth();
  const { getEffectiveRole, isPreviewActive } = useDemo();
  
  const effectiveRole = useEffectiveRole ? getEffectiveRole() : actualRole;

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  }

  if (roles && hasAccess) {
    if (useEffectiveRole && effectiveRole) {
      hasAccess = roles.includes(effectiveRole);
    } else {
      hasAccess = isRole(...roles);
    }
  }

  if (!hasAccess && hideWhenDisabled) {
    return null;
  }

  if (!hasAccess) {
    const tooltipMessage = isPreviewActive 
      ? `${tooltip} (Preview mode - read-only)`
      : tooltip;
      
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <div className="pointer-events-none opacity-50">{children}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <>{children}</>;
}

interface RestrictedTooltipProps {
  message: string;
  children: ReactNode;
}

export function RestrictedTooltip({ message, children }: RestrictedTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="text-warning">{message}</p>
      </TooltipContent>
    </Tooltip>
  );
}
