import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

export interface CalendarEvent {
  id: number;
  title: string;
  equipment: string;
  team: string;
  date: string;
  type: "preventive";
  color: string;
  description?: string;
}

const initialEvents: CalendarEvent[] = [
  { id: 1, title: "Oil Change", equipment: "Forklift #3", team: "Mechanics", date: "2024-01-22", type: "preventive", color: "bg-primary" },
  { id: 2, title: "Filter Replacement", equipment: "HVAC Unit #12", team: "Electricians", date: "2024-01-22", type: "preventive", color: "bg-warning" },
  { id: 3, title: "Calibration Check", equipment: "Industrial Printer #7", team: "IT Support", date: "2024-01-24", type: "preventive", color: "bg-info" },
  { id: 4, title: "Belt Inspection", equipment: "Conveyor Belt #8", team: "Mechanics", date: "2024-01-25", type: "preventive", color: "bg-primary" },
  { id: 5, title: "Cooling System Check", equipment: "Server Rack A4", team: "IT Support", date: "2024-01-26", type: "preventive", color: "bg-info" },
  { id: 6, title: "Motor Lubrication", equipment: "CNC Machine #45", team: "Mechanics", date: "2024-01-29", type: "preventive", color: "bg-primary" },
  { id: 7, title: "Safety Inspection", equipment: "Generator #1", team: "Electricians", date: "2024-01-30", type: "preventive", color: "bg-warning" },
  { id: 8, title: "Quarterly Maintenance", equipment: "Assembly Line Robot #12", team: "Mechanics", date: "2024-01-31", type: "preventive", color: "bg-primary" },
];

const teamColors: Record<string, string> = {
  "Mechanics": "bg-primary",
  "Electricians": "bg-warning",
  "IT Support": "bg-info",
};

interface CalendarContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id" | "color">) => void;
  updateEvent: (id: number, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: number) => void;
  getEventsForDate: (date: string) => CalendarEvent[];
  getEventsForTeam: (team: string) => CalendarEvent[];
  lastUpdate: number;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const addEvent = useCallback((event: Omit<CalendarEvent, "id" | "color">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now(),
      color: teamColors[event.team] || "bg-primary",
    };
    setEvents(prev => [...prev, newEvent]);
    setLastUpdate(Date.now());
    toast.success("Maintenance Scheduled", {
      description: `"${event.title}" scheduled for ${new Date(event.date).toLocaleDateString()}`,
    });
  }, []);

  const updateEvent = useCallback((id: number, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ));
    setLastUpdate(Date.now());
    toast.success("Event Updated", {
      description: "Schedule updated successfully",
    });
  }, []);

  const deleteEvent = useCallback((id: number) => {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    setLastUpdate(Date.now());
    toast.success("Event Deleted", {
      description: `"${event?.title}" has been removed from the schedule`,
    });
  }, [events]);

  const getEventsForDate = useCallback((date: string) => {
    return events.filter(e => e.date === date);
  }, [events]);

  const getEventsForTeam = useCallback((team: string) => {
    return events.filter(e => e.team === team);
  }, [events]);

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsForDate,
        getEventsForTeam,
        lastUpdate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
