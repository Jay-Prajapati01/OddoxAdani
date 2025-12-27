import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface DemoContextType {
  isDemoMode: boolean;
  previewRole: UserRole | null;
  actualRole: UserRole | null;
  isPreviewActive: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  setPreviewRole: (role: UserRole) => void;
  clearPreview: () => void;
  getEffectiveRole: () => UserRole | null;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

interface DemoProviderProps {
  children: ReactNode;
  actualRole: UserRole | null;
}

export function DemoProvider({ children, actualRole }: DemoProviderProps) {
  const [isDemoMode, setIsDemoMode] = useState(true); // Demo mode enabled by default for evaluation
  const [previewRole, setPreviewRoleState] = useState<UserRole | null>(null);

  const isPreviewActive = isDemoMode && previewRole !== null && previewRole !== actualRole;

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
    toast.success("Demo Mode Enabled", {
      description: "You can now preview different role perspectives.",
    });
  }, []);

  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false);
    setPreviewRoleState(null);
    toast.info("Demo Mode Disabled", {
      description: "Returned to production mode.",
    });
  }, []);

  const setPreviewRole = useCallback((role: UserRole) => {
    setPreviewRoleState(role);
    toast.success(`Previewing as ${role.charAt(0).toUpperCase() + role.slice(1)}`, {
      description: "Permissions are simulated for preview only.",
      duration: 3000,
    });
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewRoleState(null);
    if (actualRole) {
      toast.info(`Returned to ${actualRole.charAt(0).toUpperCase() + actualRole.slice(1)} view`);
    }
  }, [actualRole]);

  const getEffectiveRole = useCallback((): UserRole | null => {
    if (isDemoMode && previewRole) {
      return previewRole;
    }
    return actualRole;
  }, [isDemoMode, previewRole, actualRole]);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        previewRole,
        actualRole,
        isPreviewActive,
        enableDemoMode,
        disableDemoMode,
        setPreviewRole,
        clearPreview,
        getEffectiveRole,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
