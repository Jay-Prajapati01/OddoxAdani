import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDemo } from "@/contexts/DemoContext";
import { useCalendar } from "@/contexts/CalendarContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { CanAccess } from "@/components/auth/CanAccess";

const teamColors: Record<string, string> = { "Mechanics": "bg-primary", "Electricians": "bg-warning", "IT Support": "bg-info" };
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MaintenanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", equipment: "", team: "Mechanics", date: "" });

  const { getEffectiveRole, isPreviewActive } = useDemo();
  const { events, addEvent, lastUpdate } = useCalendar();
  const { equipment } = useEquipment();

  const effectiveRole = getEffectiveRole();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(event => event.date === dateStr && (selectedTeam === "all" || event.team === selectedTeam));
  };

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const handleSchedule = () => {
    if (!newEvent.title || !newEvent.date) return;
    addEvent({ title: newEvent.title, equipment: newEvent.equipment, team: newEvent.team, date: newEvent.date, type: "preventive" });
    setNewEvent({ title: "", equipment: "", team: "Mechanics", date: "" });
    setIsScheduleOpen(false);
  };

  return (
    <div className="space-y-6" key={lastUpdate}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Preventive Maintenance Calendar</h1>
          <p className="text-muted-foreground">{effectiveRole === "technician" ? "View your scheduled maintenance tasks" : "Schedule and track routine maintenance tasks"}</p>
        </div>
        <CanAccess roles={["manager"]}>
          <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={isPreviewActive}><Plus className="w-4 h-4" />Schedule Maintenance</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Preventive Maintenance</DialogTitle>
                <DialogDescription>Add a new maintenance task to the calendar.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Task Title *</Label><Input value={newEvent.title} onChange={(e) => setNewEvent(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Oil Change" /></div>
                <div className="space-y-2">
                  <Label>Equipment</Label>
                  <Select value={newEvent.equipment} onValueChange={(v) => setNewEvent(p => ({ ...p, equipment: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select equipment" /></SelectTrigger>
                    <SelectContent>{equipment.filter(e => e.status !== "scrapped").map((eq) => <SelectItem key={eq.id} value={eq.name}>{eq.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assign Team</Label>
                  <Select value={newEvent.team} onValueChange={(v) => setNewEvent(p => ({ ...p, team: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mechanics">Mechanics</SelectItem>
                      <SelectItem value="Electricians">Electricians</SelectItem>
                      <SelectItem value="IT Support">IT Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Date *</Label><Input type="date" value={newEvent.date} onChange={(e) => setNewEvent(p => ({ ...p, date: e.target.value }))} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
                <Button onClick={handleSchedule} disabled={!newEvent.title || !newEvent.date}>Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CanAccess>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-lg font-semibold min-w-[160px] text-center">{monthName} {year}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><ChevronRight className="w-4 h-4" /></Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
            </div>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by team" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="Mechanics">Mechanics</SelectItem>
                <SelectItem value="Electricians">Electricians</SelectItem>
                <SelectItem value="IT Support">IT Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(teamColors).map(([team, color]) => (
          <div key={team} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${color}`} /><span className="text-sm text-muted-foreground">{team}</span></div>
        ))}
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-px bg-border rounded-t-lg overflow-hidden">
            {daysOfWeek.map((day) => <div key={day} className="bg-muted px-2 py-3 text-center text-sm font-medium text-muted-foreground">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-px bg-border">
            {calendarDays.map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div key={index} className={`bg-card min-h-[120px] p-2 ${day ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}>
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-2 ${isToday ? "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center" : "text-foreground"}`}>{day}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <Tooltip key={event.id}>
                            <TooltipTrigger asChild>
                              <div className={`${event.color} text-primary-foreground text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-90 transition-opacity`}>{event.title}</div>
                            </TooltipTrigger>
                            <TooltipContent><div className="text-sm"><div className="font-medium">{event.title}</div><div className="text-muted-foreground">{event.equipment}</div><div className="text-muted-foreground">{event.team}</div></div></TooltipContent>
                          </Tooltip>
                        ))}
                        {dayEvents.length > 3 && <div className="text-xs text-muted-foreground pl-2">+{dayEvents.length - 3} more</div>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming This Week */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Upcoming This Week</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${event.color} flex items-center justify-center`}><Wrench className="w-5 h-5 text-primary-foreground" /></div>
                  <div><div className="font-medium text-foreground">{event.title}</div><div className="text-sm text-muted-foreground">{event.equipment}</div></div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{event.team}</Badge>
                  <div className="text-sm text-muted-foreground mt-1">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
