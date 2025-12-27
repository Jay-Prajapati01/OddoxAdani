import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "manager" | "technician" | "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  canAccess: (route: string) => boolean;
  isRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for each role
const demoUsers: Record<UserRole, User> = {
  manager: {
    id: "1",
    name: "Sarah Manager",
    email: "manager@gearguard.com",
    role: "manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
  },
  technician: {
    id: "2",
    name: "Mike Technician",
    email: "technician@gearguard.com",
    role: "technician",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
  },
  admin: {
    id: "3",
    name: "Alex Admin",
    email: "admin@gearguard.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
  },
  user: {
    id: "4",
    name: "John User",
    email: "user@gearguard.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
  },
};

// Permissions matrix
const rolePermissions: Record<UserRole, string[]> = {
  manager: [
    "view_dashboard",
    "view_equipment",
    "create_request",
    "view_requests",
    "assign_technicians",
    "view_calendar",
    "create_preventive",
    "view_reports",
    "view_teams",
    "view_kanban",
  ],
  technician: [
    "view_dashboard",
    "view_kanban",
    "update_task_status",
    "log_duration",
    "view_my_tasks",
    "view_calendar",
    "self_assign",
  ],
  admin: [
    "view_dashboard",
    "view_equipment",
    "create_equipment",
    "edit_equipment",
    "delete_equipment",
    "scrap_equipment",
    "view_teams",
    "manage_teams",
    "manage_users",
    "view_requests",
    "view_settings",
  ],
  user: [
    "view_dashboard",
    "create_request",
    "view_my_requests",
  ],
};

// Route access per role
const routeAccess: Record<string, UserRole[]> = {
  "/app": ["manager", "technician", "admin", "user"],
  "/app/equipment": ["manager", "admin"],
  "/app/maintenance": ["manager", "technician"],
  "/app/teams": ["manager", "admin"],
  "/app/calendar": ["manager", "technician"],
  "/app/reports": ["manager"],
  "/app/settings": ["admin", "manager"],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount (demo purposes)
  useEffect(() => {
    const storedUser = localStorage.getItem("gearguard_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("gearguard_user");
      }
    }
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    // Demo login - use provided role or default to manager
    const selectedRole = role || "manager";
    const demoUser = { ...demoUsers[selectedRole], email };
    setUser(demoUser);
    localStorage.setItem("gearguard_user", JSON.stringify(demoUser));
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: demoUsers[role].avatar,
    };
    setUser(newUser);
    localStorage.setItem("gearguard_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gearguard_user");
  };

  const setRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...demoUsers[role], id: user.id, email: user.email };
      setUser(updatedUser);
      localStorage.setItem("gearguard_user", JSON.stringify(updatedUser));
    } else {
      const demoUser = demoUsers[role];
      setUser(demoUser);
      localStorage.setItem("gearguard_user", JSON.stringify(demoUser));
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const canAccess = (route: string): boolean => {
    if (!user) return false;
    const allowedRoles = routeAccess[route];
    if (!allowedRoles) return true; // If route not defined, allow access
    return allowedRoles.includes(user.role);
  };

  const isRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setRole,
        hasPermission,
        canAccess,
        isRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
