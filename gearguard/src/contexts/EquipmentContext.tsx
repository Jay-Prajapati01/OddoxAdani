import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { toast } from "sonner";

// LocalStorage key
const STORAGE_KEY = "gearguard_equipment";

export interface Equipment {
  id: number;
  name: string;
  serialNumber: string;
  category: string;
  department: string;
  location: string;
  status: "operational" | "maintenance" | "warning" | "scrapped";
  openRequests: number;
  lastMaintenance: string;
  team: string;
  notes?: string;
}

// Helper functions for localStorage
const getStoredEquipment = (): Equipment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading equipment from localStorage:", error);
  }
  return initialEquipment;
};

const saveEquipment = (equipment: Equipment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment));
  } catch (error) {
    console.error("Error saving equipment to localStorage:", error);
  }
};

const initialEquipment: Equipment[] = [
  {
    id: 1,
    name: "CNC Machine #45",
    serialNumber: "CNC-2024-045",
    category: "Machinery",
    department: "Production",
    location: "Building A, Floor 2",
    status: "operational",
    openRequests: 0,
    lastMaintenance: "2024-01-15",
    team: "Mechanics",
  },
  {
    id: 2,
    name: "Industrial Printer #7",
    serialNumber: "PRT-2023-007",
    category: "Electronics",
    department: "Packaging",
    location: "Building B, Floor 1",
    status: "maintenance",
    openRequests: 2,
    lastMaintenance: "2024-01-10",
    team: "IT Support",
  },
  {
    id: 3,
    name: "HVAC Unit #12",
    serialNumber: "HVAC-2022-012",
    category: "HVAC",
    department: "Facilities",
    location: "Rooftop A",
    status: "operational",
    openRequests: 1,
    lastMaintenance: "2024-01-08",
    team: "Electricians",
  },
  {
    id: 4,
    name: "Conveyor Belt #8",
    serialNumber: "CNV-2023-008",
    category: "Machinery",
    department: "Assembly",
    location: "Building A, Floor 1",
    status: "warning",
    openRequests: 3,
    lastMaintenance: "2023-12-20",
    team: "Mechanics",
  },
  {
    id: 5,
    name: "Forklift #3",
    serialNumber: "FLT-2021-003",
    category: "Vehicles",
    department: "Warehouse",
    location: "Warehouse C",
    status: "operational",
    openRequests: 0,
    lastMaintenance: "2024-01-12",
    team: "Mechanics",
  },
  {
    id: 6,
    name: "Server Rack A4",
    serialNumber: "SRV-2024-A4",
    category: "IT Equipment",
    department: "IT",
    location: "Data Center",
    status: "operational",
    openRequests: 0,
    lastMaintenance: "2024-01-18",
    team: "IT Support",
  },
  {
    id: 7,
    name: "Generator #2",
    serialNumber: "GEN-2020-002",
    category: "Power",
    department: "Facilities",
    location: "Power Room B",
    status: "scrapped",
    openRequests: 0,
    lastMaintenance: "2023-11-15",
    team: "Electricians",
  },
];

interface EquipmentContextType {
  equipment: Equipment[];
  addEquipment: (equipment: Omit<Equipment, "id">) => void;
  updateEquipment: (id: number, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: number) => void;
  markAsScrapped: (id: number) => void;
  createMaintenanceRequest: (equipmentId: number) => void;
  lastUpdate: number;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(() => getStoredEquipment());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Save to localStorage whenever equipment changes
  useEffect(() => {
    saveEquipment(equipment);
  }, [equipment]);

  const addEquipment = useCallback((newEquipment: Omit<Equipment, "id">) => {
    const equipmentWithId: Equipment = {
      ...newEquipment,
      id: Date.now(),
    };
    setEquipment(prev => [...prev, equipmentWithId]);
    setLastUpdate(Date.now());
    toast.success("Equipment Added", {
      description: `"${newEquipment.name}" has been added successfully`,
    });
  }, []);

  const updateEquipment = useCallback((id: number, updates: Partial<Equipment>) => {
    setEquipment(prev => prev.map(eq => 
      eq.id === id ? { ...eq, ...updates } : eq
    ));
    setLastUpdate(Date.now());
    toast.success("Equipment Updated", {
      description: "Changes saved successfully",
    });
  }, []);

  const deleteEquipment = useCallback((id: number) => {
    const eq = equipment.find(e => e.id === id);
    setEquipment(prev => prev.filter(e => e.id !== id));
    setLastUpdate(Date.now());
    toast.success("Equipment Deleted", {
      description: `"${eq?.name}" has been removed`,
    });
  }, [equipment]);

  const markAsScrapped = useCallback((id: number) => {
    const eq = equipment.find(e => e.id === id);
    setEquipment(prev => prev.map(e => 
      e.id === id ? { ...e, status: "scrapped" as const } : e
    ));
    setLastUpdate(Date.now());
    toast.warning("Equipment Scrapped", {
      description: `"${eq?.name}" marked as scrapped`,
    });
  }, [equipment]);

  const createMaintenanceRequest = useCallback((equipmentId: number) => {
    const eq = equipment.find(e => e.id === equipmentId);
    setEquipment(prev => prev.map(e => 
      e.id === equipmentId ? { ...e, openRequests: e.openRequests + 1 } : e
    ));
    setLastUpdate(Date.now());
    toast.success("Request Created", {
      description: `Maintenance request created for "${eq?.name}"`,
    });
  }, [equipment]);

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        markAsScrapped,
        createMaintenanceRequest,
        lastUpdate,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error("useEquipment must be used within an EquipmentProvider");
  }
  return context;
}
