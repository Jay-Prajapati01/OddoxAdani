import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export interface MaintenanceRequest {
  id: number;
  subject: string;
  type: "corrective" | "preventive";
  equipment: string;
  category: string;
  team: string;
  technician: string;
  technicianAvatar: string;
  status: "new" | "in_progress" | "repaired" | "scrap";
  priority: "high" | "medium" | "low";
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  description: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

const initialRequests: MaintenanceRequest[] = [
  {
    id: 1,
    subject: "Motor overheating issue",
    type: "corrective",
    equipment: "CNC Machine #45",
    category: "Machinery",
    team: "Mechanics",
    technician: "Mike Johnson",
    technicianAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    status: "new",
    priority: "high",
    dueDate: "2024-01-20",
    estimatedHours: 4,
    description: "Motor making unusual noise and overheating after 2 hours of operation.",
  },
  {
    id: 2,
    subject: "Scheduled oil change",
    type: "preventive",
    equipment: "Forklift #3",
    category: "Vehicles",
    team: "Mechanics",
    technician: "Tom Wilson",
    technicianAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    status: "in_progress",
    priority: "medium",
    dueDate: "2024-01-22",
    estimatedHours: 2,
    actualHours: 1,
    description: "Regular maintenance - oil change and filter replacement.",
  },
  {
    id: 3,
    subject: "Print head alignment",
    type: "corrective",
    equipment: "Industrial Printer #7",
    category: "Electronics",
    team: "IT Support",
    technician: "Sarah Chen",
    technicianAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face",
    status: "in_progress",
    priority: "medium",
    dueDate: "2024-01-21",
    estimatedHours: 3,
    actualHours: 2,
    description: "Print quality degrading, needs calibration and cleaning.",
  },
  {
    id: 4,
    subject: "Belt replacement",
    type: "corrective",
    equipment: "Conveyor Belt #8",
    category: "Machinery",
    team: "Mechanics",
    technician: "Mike Johnson",
    technicianAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    status: "new",
    priority: "high",
    dueDate: "2024-01-19",
    estimatedHours: 6,
    description: "Conveyor belt showing signs of wear, needs replacement before failure.",
  },
  {
    id: 5,
    subject: "Cooling system maintenance",
    type: "preventive",
    equipment: "Server Rack A4",
    category: "IT Equipment",
    team: "IT Support",
    technician: "Lisa Brown",
    technicianAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    status: "repaired",
    priority: "low",
    dueDate: "2024-01-18",
    estimatedHours: 2,
    actualHours: 1.5,
    description: "Monthly cooling system check and dust cleaning completed.",
  },
  {
    id: 6,
    subject: "Generator failure",
    type: "corrective",
    equipment: "Generator #2",
    category: "Power",
    team: "Electricians",
    technician: "David Miller",
    technicianAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
    status: "scrap",
    priority: "high",
    dueDate: "2024-01-15",
    estimatedHours: 8,
    actualHours: 6,
    description: "Major electrical failure. Equipment deemed beyond repair.",
  },
];

interface MaintenanceContextType {
  requests: MaintenanceRequest[];
  updateRequestStatus: (id: number, newStatus: MaintenanceRequest["status"], updatedBy: string) => void;
  logDuration: (id: number, hours: number, updatedBy: string) => void;
  addRequest: (request: Omit<MaintenanceRequest, "id" | "lastUpdatedAt" | "lastUpdatedBy">) => void;
  getRequestsByStatus: (status: MaintenanceRequest["status"]) => MaintenanceRequest[];
  lastUpdate: number; // Timestamp for triggering re-renders
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const updateRequestStatus = useCallback((
    id: number, 
    newStatus: MaintenanceRequest["status"],
    updatedBy: string
  ) => {
    setRequests(prev => {
      const updated = prev.map(req => 
        req.id === id 
          ? { 
              ...req, 
              status: newStatus, 
              lastUpdatedBy: updatedBy,
              lastUpdatedAt: new Date().toISOString()
            } 
          : req
      );
      return updated;
    });
    setLastUpdate(Date.now());
    
    const request = requests.find(r => r.id === id);
    toast.success(`Task Updated`, {
      description: `"${request?.subject}" moved to ${newStatus.replace("_", " ")}`,
      duration: 2000,
    });
  }, [requests]);

  const logDuration = useCallback((id: number, hours: number, updatedBy: string) => {
    setRequests(prev => prev.map(req =>
      req.id === id 
        ? { 
            ...req, 
            actualHours: hours,
            lastUpdatedBy: updatedBy,
            lastUpdatedAt: new Date().toISOString()
          }
        : req
    ));
    setLastUpdate(Date.now());
    
    toast.success(`Duration Logged`, {
      description: `${hours} hours logged successfully`,
      duration: 2000,
    });
  }, []);

  const addRequest = useCallback((request: Omit<MaintenanceRequest, "id" | "lastUpdatedAt" | "lastUpdatedBy">) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: Date.now(),
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: "Manager",
    };
    setRequests(prev => [...prev, newRequest]);
    setLastUpdate(Date.now());
    
    toast.success(`Request Created`, {
      description: `"${request.subject}" has been added`,
      duration: 2000,
    });
  }, []);

  const getRequestsByStatus = useCallback((status: MaintenanceRequest["status"]) => {
    return requests.filter(r => r.status === status);
  }, [requests]);

  return (
    <MaintenanceContext.Provider
      value={{
        requests,
        updateRequestStatus,
        logDuration,
        addRequest,
        getRequestsByStatus,
        lastUpdate,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
}
