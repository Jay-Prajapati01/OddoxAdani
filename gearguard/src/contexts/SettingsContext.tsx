import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatar?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  overdue: boolean;
  completed: boolean;
}

export interface CompanySettings {
  companyName: string;
  industry: string;
  size: string;
  address: string;
}

interface SettingsContextType {
  profile: UserProfile;
  notifications: NotificationSettings;
  company: CompanySettings;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  updateCompany: (updates: Partial<CompanySettings>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  enable2FA: () => void;
  deleteAccount: () => void;
  lastUpdate: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    bio: "",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    overdue: true,
    completed: false,
  });

  const [company, setCompany] = useState<CompanySettings>({
    companyName: "Acme Manufacturing Inc.",
    industry: "manufacturing",
    size: "medium",
    address: "123 Industrial Way, Manufacturing City, MC 12345",
  });

  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setLastUpdate(Date.now());
    toast.success("Profile Updated", {
      description: "Your profile has been saved successfully",
    });
  }, []);

  const updateNotifications = useCallback((updates: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...updates }));
    setLastUpdate(Date.now());
    toast.success("Preferences Saved", {
      description: "Your notification preferences have been updated",
    });
  }, []);

  const updateCompany = useCallback((updates: Partial<CompanySettings>) => {
    setCompany(prev => ({ ...prev, ...updates }));
    setLastUpdate(Date.now());
    toast.success("Company Updated", {
      description: "Company information saved successfully",
    });
  }, []);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    // Simulate password validation
    if (currentPassword.length < 1) {
      toast.error("Invalid Password", {
        description: "Please enter your current password",
      });
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("Weak Password", {
        description: "New password must be at least 6 characters",
      });
      return false;
    }
    
    setLastUpdate(Date.now());
    toast.success("Password Updated", {
      description: "Your password has been changed successfully",
    });
    return true;
  }, []);

  const enable2FA = useCallback(() => {
    setLastUpdate(Date.now());
    toast.success("2FA Enabled", {
      description: "Two-factor authentication is now active",
    });
  }, []);

  const deleteAccount = useCallback(() => {
    toast.error("Account Deletion", {
      description: "Account deletion would be processed here in production",
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        profile,
        notifications,
        company,
        updateProfile,
        updateNotifications,
        updateCompany,
        updatePassword,
        enable2FA,
        deleteAccount,
        lastUpdate,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
