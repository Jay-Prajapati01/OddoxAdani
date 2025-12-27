import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { Wrench, Zap, Monitor, LucideIcon } from "lucide-react";

// LocalStorage key
const STORAGE_KEY = "gearguard_teams";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  status: "available" | "busy" | "offline";
  userRole?: "admin" | "manager" | "technician" | "user";
}

export interface Team {
  id: number;
  name: string;
  description: string;
  iconName: "wrench" | "zap" | "monitor";
  color: string;
  activeRequests: number;
  completedToday: number;
  members: TeamMember[];
}

// Helper functions for localStorage
const getStoredTeams = (): Team[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading teams from localStorage:", error);
  }
  return initialTeams;
};

const saveTeams = (teams: Team[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch (error) {
    console.error("Error saving teams to localStorage:", error);
  }
};

const initialTeams: Team[] = [
  {
    id: 1,
    name: "Mechanics",
    description: "Heavy machinery and vehicle maintenance",
    iconName: "wrench",
    color: "bg-primary",
    activeRequests: 8,
    completedToday: 3,
    members: [
      {
        id: 1,
        name: "Mike Johnson",
        role: "Senior Technician",
        email: "mike.j@company.com",
        phone: "+1 555-0101",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        status: "available",
        userRole: "technician",
      },
      {
        id: 2,
        name: "Tom Wilson",
        role: "Technician",
        email: "tom.w@company.com",
        phone: "+1 555-0102",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        status: "busy",
        userRole: "technician",
      },
      {
        id: 3,
        name: "Jake Roberts",
        role: "Junior Technician",
        email: "jake.r@company.com",
        phone: "+1 555-0103",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
        status: "available",
        userRole: "technician",
      },
    ],
  },
  {
    id: 2,
    name: "Electricians",
    description: "Electrical systems and power equipment",
    iconName: "zap",
    color: "bg-warning",
    activeRequests: 4,
    completedToday: 2,
    members: [
      {
        id: 4,
        name: "David Miller",
        role: "Lead Electrician",
        email: "david.m@company.com",
        phone: "+1 555-0201",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face",
        status: "available",
        userRole: "technician",
      },
      {
        id: 5,
        name: "Chris Anderson",
        role: "Electrician",
        email: "chris.a@company.com",
        phone: "+1 555-0202",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop&crop=face",
        status: "offline",
        userRole: "technician",
      },
    ],
  },
  {
    id: 3,
    name: "IT Support",
    description: "IT equipment and systems maintenance",
    iconName: "monitor",
    color: "bg-info",
    activeRequests: 5,
    completedToday: 4,
    members: [
      {
        id: 6,
        name: "Sarah Chen",
        role: "IT Lead",
        email: "sarah.c@company.com",
        phone: "+1 555-0301",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
        status: "busy",
        userRole: "technician",
      },
      {
        id: 7,
        name: "Lisa Brown",
        role: "IT Technician",
        email: "lisa.b@company.com",
        phone: "+1 555-0302",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
        status: "available",
        userRole: "technician",
      },
      {
        id: 8,
        name: "Alex Kim",
        role: "IT Technician",
        email: "alex.k@company.com",
        phone: "+1 555-0303",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=64&h=64&fit=crop&crop=face",
        status: "available",
        userRole: "technician",
      },
    ],
  },
];

export const iconMap: Record<string, LucideIcon> = {
  wrench: Wrench,
  zap: Zap,
  monitor: Monitor,
};

interface TeamsContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, "id" | "members" | "activeRequests" | "completedToday">) => void;
  updateTeam: (id: number, updates: Partial<Team>) => void;
  deleteTeam: (id: number) => void;
  addMember: (teamId: number, member: Omit<TeamMember, "id">) => void;
  updateMember: (teamId: number, memberId: number, updates: Partial<TeamMember>) => void;
  removeMember: (teamId: number, memberId: number) => void;
  updateMemberRole: (memberId: number, newRole: TeamMember["userRole"]) => void;
  getAllMembers: () => TeamMember[];
  assignWork: (teamId: number, taskDescription: string) => void;
  lastUpdate: number;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export function TeamsProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(() => getStoredTeams());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Save to localStorage whenever teams change
  useEffect(() => {
    saveTeams(teams);
  }, [teams]);

  const addTeam = useCallback((team: Omit<Team, "id" | "members" | "activeRequests" | "completedToday">) => {
    const newTeam: Team = {
      ...team,
      id: Date.now(),
      members: [],
      activeRequests: 0,
      completedToday: 0,
    };
    setTeams(prev => [...prev, newTeam]);
    setLastUpdate(Date.now());
    toast.success("Team Created", {
      description: `"${team.name}" team has been created`,
    });
  }, []);

  const updateTeam = useCallback((id: number, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    setLastUpdate(Date.now());
    toast.success("Team Updated", {
      description: "Team details saved successfully",
    });
  }, []);

  const deleteTeam = useCallback((id: number) => {
    const team = teams.find(t => t.id === id);
    setTeams(prev => prev.filter(t => t.id !== id));
    setLastUpdate(Date.now());
    toast.success("Team Deleted", {
      description: `"${team?.name}" has been removed`,
    });
  }, [teams]);

  const addMember = useCallback((teamId: number, member: Omit<TeamMember, "id">) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now(),
    };
    setTeams(prev => prev.map(t => 
      t.id === teamId 
        ? { ...t, members: [...t.members, newMember] }
        : t
    ));
    setLastUpdate(Date.now());
    toast.success("Member Added", {
      description: `${member.name} has been added to the team`,
    });
  }, []);

  const updateMember = useCallback((teamId: number, memberId: number, updates: Partial<TeamMember>) => {
    setTeams(prev => prev.map(t => 
      t.id === teamId 
        ? { 
            ...t, 
            members: t.members.map(m => m.id === memberId ? { ...m, ...updates } : m)
          }
        : t
    ));
    setLastUpdate(Date.now());
  }, []);

  const removeMember = useCallback((teamId: number, memberId: number) => {
    setTeams(prev => prev.map(t => 
      t.id === teamId 
        ? { ...t, members: t.members.filter(m => m.id !== memberId) }
        : t
    ));
    setLastUpdate(Date.now());
    toast.success("Member Removed", {
      description: "Team member has been removed",
    });
  }, []);

  const updateMemberRole = useCallback((memberId: number, newRole: TeamMember["userRole"]) => {
    setTeams(prev => prev.map(t => ({
      ...t,
      members: t.members.map(m => 
        m.id === memberId ? { ...m, userRole: newRole } : m
      )
    })));
    setLastUpdate(Date.now());
    toast.success("Role Updated", {
      description: `User role changed to ${newRole}`,
    });
  }, []);

  const getAllMembers = useCallback(() => {
    return teams.flatMap(t => t.members);
  }, [teams]);

  const assignWork = useCallback((teamId: number, taskDescription: string) => {
    setTeams(prev => prev.map(t => 
      t.id === teamId 
        ? { ...t, activeRequests: t.activeRequests + 1 }
        : t
    ));
    setLastUpdate(Date.now());
    const team = teams.find(t => t.id === teamId);
    toast.success("Work Assigned", {
      description: `Task assigned to ${team?.name}`,
    });
  }, [teams]);

  return (
    <TeamsContext.Provider
      value={{
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        addMember,
        updateMember,
        removeMember,
        updateMemberRole,
        getAllMembers,
        assignWork,
        lastUpdate,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error("useTeams must be used within a TeamsProvider");
  }
  return context;
}
