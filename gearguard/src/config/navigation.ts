import {
  LayoutDashboard,
  Wrench,
  Users,
  ClipboardList,
  Calendar,
  BarChart3,
  Settings,
  Kanban,
  ListTodo,
  UserCog,
} from "lucide-react";
import { UserRole } from "@/contexts/AuthContext";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  badge?: string;
}

export const navigationItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
    roles: ["manager", "technician", "admin", "user"],
  },
  {
    name: "Equipment",
    href: "/app/equipment",
    icon: Wrench,
    roles: ["manager", "admin"],
  },
  {
    name: "Maintenance",
    href: "/app/maintenance",
    icon: ClipboardList,
    roles: ["manager"],
  },
  {
    name: "Kanban Board",
    href: "/app/maintenance",
    icon: Kanban,
    roles: ["technician"],
  },
  {
    name: "My Tasks",
    href: "/app/maintenance",
    icon: ListTodo,
    roles: ["technician"],
  },
  {
    name: "Teams",
    href: "/app/teams",
    icon: Users,
    roles: ["manager", "admin"],
  },
  {
    name: "User Management",
    href: "/app/teams",
    icon: UserCog,
    roles: ["admin"],
  },
  {
    name: "Calendar",
    href: "/app/calendar",
    icon: Calendar,
    roles: ["manager", "technician"],
  },
  {
    name: "Reports",
    href: "/app/reports",
    icon: BarChart3,
    roles: ["manager"],
  },
  {
    name: "Settings",
    href: "/app/settings",
    icon: Settings,
    roles: ["admin", "manager"],
  },
];

export function getNavigationForRole(role: UserRole | null): NavItem[] {
  if (!role) return [];
  
  // Filter unique items by href to avoid duplicates
  const uniqueItems = navigationItems
    .filter(item => item.roles.includes(role))
    .reduce((acc, item) => {
      const existing = acc.find(i => i.href === item.href);
      if (!existing) {
        acc.push(item);
      }
      return acc;
    }, [] as NavItem[]);
  
  return uniqueItems;
}

export const roleLabels: Record<UserRole, string> = {
  manager: "Manager",
  technician: "Technician",
  admin: "Administrator",
  user: "General User",
};

export const roleColors: Record<UserRole, string> = {
  manager: "bg-primary",
  technician: "bg-success",
  admin: "bg-warning",
  user: "bg-info",
};
