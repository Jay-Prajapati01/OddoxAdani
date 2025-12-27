import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export type UserRole = "manager" | "technician" | "admin" | "user";

// User interface for stored user data
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Stored for hackathon demo purposes
  role: UserRole;
  avatar?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole, company?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canAccess: (route: string) => boolean;
  isRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'gearguard_users',
  CURRENT_USER: 'gearguard_user',
  ROLE_PREVIEW: 'gearguard_role_preview',
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

// Helper: Get all registered users from localStorage
function getAllUsers(): User[] {
  try {
    const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
}

// Helper: Save users to localStorage
function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}

// Helper: Get current logged-in user
function getCurrentUser(): User | null {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading current user from localStorage:', error);
    return null;
  }
}

// Helper: Save current user
function saveCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Error saving current user to localStorage:', error);
  }
}

// Helper: Generate unique ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate async operation for realistic UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Validate inputs
      if (!email.trim() || !password.trim()) {
        setIsLoading(false);
        toast.error("Invalid Input", {
          description: "Please enter both email and password",
        });
        return false;
      }

      // Get all registered users
      const users = getAllUsers();
      
      // Find user by email and password
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        setIsLoading(false);
        toast.error("Login Failed", {
          description: "Invalid email or password. Please try again or sign up.",
        });
        return false;
      }

      // Login successful
      setUser(foundUser);
      saveCurrentUser(foundUser);
      setIsLoading(false);
      
      toast.success("Welcome back!", {
        description: `Logged in as ${foundUser.role.charAt(0).toUpperCase() + foundUser.role.slice(1)}`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      toast.error("Login Error", {
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    company?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate async operation for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validate inputs
      if (!name.trim() || !email.trim() || !password.trim()) {
        setIsLoading(false);
        toast.error("Invalid Input", {
          description: "Please fill in all required fields",
        });
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setIsLoading(false);
        toast.error("Invalid Email", {
          description: "Please enter a valid email address (e.g., user@example.com)",
        });
        return false;
      }

      if (password.length < 6) {
        setIsLoading(false);
        toast.error("Weak Password", {
          description: "Password must be at least 6 characters",
        });
        return false;
      }

      // Get existing users
      const users = getAllUsers();
      
      // Check if email already exists
      const emailExists = users.some(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        setIsLoading(false);
        toast.error("Email Already Registered", {
          description: "This email is already in use. Please sign in instead.",
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: generateId(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password, // Stored as-is for hackathon demo
        role,
        company: company?.trim(),
      };

      // Save to users list
      users.push(newUser);
      saveUsers(users);

      // Auto-login the new user
      setUser(newUser);
      saveCurrentUser(newUser);
      setIsLoading(false);
      
      toast.success("🎉 Account Created!", {
        description: `Welcome to GearGuard, ${name}!`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      
      toast.error("Registration Error", {
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear current user
      setUser(null);
      saveCurrentUser(null);
      
      // Clear demo role preview if exists
      localStorage.removeItem(STORAGE_KEYS.ROLE_PREVIEW);
      
      toast.info("Logged Out", {
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error("Logout Error", {
        description: "An error occurred while logging out",
      });
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
        isLoading,
        login,
        register,
        logout,
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
