import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserRole = "manager" | "technician" | "admin" | "user";

// Extended user type with profile data
export interface User {
  id: string;
  name: string;
  email: string;
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

// Helper function to fetch user profile from Supabase
async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name || 'User',
      email: data.email || '',
      role: (data.role as UserRole) || 'user',
      avatar: data.avatar_url || undefined,
      company: data.company || undefined,
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state and set up listener
  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error("Login Failed", {
          description: error.message || "Invalid email or password",
        });
        return false;
      }

      if (data.user) {
        // Fetch user profile
        const profile = await fetchUserProfile(data.user.id);
        
        if (!profile) {
          toast.error("Profile Not Found", {
            description: "Unable to load user profile",
          });
          return false;
        }

        setUser(profile);
        
        toast.success("Welcome back!", {
          description: `Logged in as ${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}`,
        });
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("Login Error", {
        description: error.message || "An unexpected error occurred",
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
    try {
      // Validate inputs
      if (!name.trim() || !email.trim() || !password.trim()) {
        toast.error("Invalid Input", {
          description: "Please fill in all fields",
        });
        return false;
      }

      if (password.length < 6) {
        toast.error("Weak Password", {
          description: "Password must be at least 6 characters",
        });
        return false;
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            company,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('already registered')) {
          toast.error("Email Already Registered", {
            description: "This email is already in use. Please sign in instead.",
          });
        } else {
          toast.error("Registration Failed", {
            description: error.message,
          });
        }
        return false;
      }

      if (data.user) {
        // Wait a bit for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch the created profile
        const profile = await fetchUserProfile(data.user.id);
        
        if (profile) {
          setUser(profile);
          
          toast.success("Account Created!", {
            description: `Welcome to GearGuard, ${name}!`,
          });
          
          return true;
        }
      }

      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error("Registration Error", {
        description: error.message || "An unexpected error occurred",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      
      toast.info("Logged Out", {
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error("Logout Error", {
        description: error.message,
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
