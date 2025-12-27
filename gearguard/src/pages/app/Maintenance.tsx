import { useState, useEffect } from "react";
import {
  Plus,
  LayoutGrid,
  List,
  Filter,
  Search,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  GripVertical,
  Timer,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/contexts/DemoContext";
import { useMaintenance, MaintenanceRequest } from "@/contexts/MaintenanceContext";
import { CanAccess } from "@/components/auth/CanAccess";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const columns = [
  { id: "new", title: "New", icon: AlertTriangle, color: "bg-info" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "bg-warning" },
  { id: "repaired", title: "Repaired", icon: CheckCircle2, color: "bg-success" },
  { id: "scrap", title: "Scrap", icon: Trash2, color: "bg-destructive" },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-l-destructive";
    case "medium":
      return "border-l-warning";
    case "low":
      return "border-l-success";
    default:
      return "border-l-muted";
  }
};

// Allowed transitions per role
const getAllowedTransitions = (role: string | null) => {
  if (role === "technician") {
    return {
      new: ["in_progress"],
      in_progress: ["repaired", "new"],
      repaired: [],
      scrap: [],
    };
  }
  if (role === "manager" || role === "admin") {
    return {
      new: ["in_progress", "scrap"],
      in_progress: ["repaired", "new", "scrap"],
      repaired: ["in_progress", "scrap"],
      scrap: ["new"],
    };
  }
  return {
    new: [],
    in_progress: [],
    repaired: [],
    scrap: [],
  };
};

export default function Maintenance() {
  const { requests, updateRequestStatus, logDuration, addRequest, lastUpdate } = useMaintenance();
  const { getEffectiveRole, isPreviewActive } = useDemo();
  const effectiveRole = getEffectiveRole();
  
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [draggedCard, setDraggedCard] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [logHours, setLogHours] = useState("");
  
  // New request form state
  const [newRequest, setNewRequest] = useState({
    subject: "",
    type: "corrective" as "corrective" | "preventive",
    priority: "medium" as "high" | "medium" | "low",
    equipment: "",
    scheduledDate: "",
    estimatedHours: "",
    description: "",
  });
  const [animatingCards, setAnimatingCards] = useState<Set<number>>(new Set());

  const isTechnician = effectiveRole === "technician";
  const isManager = effectiveRole === "manager";
  const isAdmin = effectiveRole === "admin";
  const canDrag = isTechnician || isManager || isAdmin;
  const allowedTransitions = getAllowedTransitions(effectiveRole);

  // Trigger animation when cards update
  useEffect(() => {
    const timer = setTimeout(() => setAnimatingCards(new Set()), 500);
    return () => clearTimeout(timer);
  }, [lastUpdate]);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    if (!canDrag) return;
    setDraggedCard(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id.toString());
    
    // Add drag image
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: MaintenanceRequest["status"]) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedCard !== null && canDrag) {
      const currentRequest = requests.find(r => r.id === draggedCard);
      if (currentRequest) {
        const allowed = allowedTransitions[currentRequest.status] || [];
        
        if (allowed.includes(newStatus)) {
          setAnimatingCards(prev => new Set(prev).add(draggedCard));
          updateRequestStatus(
            draggedCard, 
            newStatus, 
            effectiveRole || "Unknown"
          );
        }
      }
      setDraggedCard(null);
    }
  };

  const handleLogDuration = () => {
    if (selectedRequest && logHours) {
      logDuration(
        selectedRequest.id, 
        parseFloat(logHours), 
        effectiveRole || "Unknown"
      );
      setSelectedRequest(null);
      setLogHours("");
    }
  };

  const handleCreateRequest = () => {
    // Validate required fields
    if (!newRequest.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!newRequest.equipment) {
      toast.error("Please select equipment");
      return;
    }
    if (!newRequest.scheduledDate) {
      toast.error("Please select a scheduled date");
      return;
    }
    if (!newRequest.estimatedHours || parseFloat(newRequest.estimatedHours) <= 0) {
      toast.error("Please enter valid estimated hours");
      return;
    }

    // Map equipment to category and technician
    const equipmentMap: Record<string, { category: string; team: string; technician: string; avatar: string }> = {
      "cnc-45": { 
        category: "Machinery", 
        team: "Mechanics", 
        technician: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
      },
      "printer-7": { 
        category: "Electronics", 
        team: "IT Support", 
        technician: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face"
      },
      "hvac-12": { 
        category: "HVAC", 
        team: "HVAC Technicians", 
        technician: "Tom Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
      },
      "conveyor-8": { 
        category: "Machinery", 
        team: "Mechanics", 
        technician: "David Miller",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face"
      },
    };

    const equipmentInfo = equipmentMap[newRequest.equipment];
    
    // Create the maintenance request
    addRequest({
      subject: newRequest.subject,
      type: newRequest.type,
      equipment: newRequest.equipment === "cnc-45" ? "CNC Machine #45" :
                 newRequest.equipment === "printer-7" ? "Industrial Printer #7" :
                 newRequest.equipment === "hvac-12" ? "HVAC Unit #12" :
                 "Conveyor Belt #8",
      category: equipmentInfo.category,
      team: equipmentInfo.team,
      technician: equipmentInfo.technician,
      technicianAvatar: equipmentInfo.avatar,
      status: "new",
      priority: newRequest.priority,
      dueDate: newRequest.scheduledDate,
      estimatedHours: parseFloat(newRequest.estimatedHours),
      description: newRequest.description || "No description provided",
    });

    // Reset form and close dialog
    setNewRequest({
      subject: "",
      type: "corrective",
      priority: "medium",
      equipment: "",
      scheduledDate: "",
      estimatedHours: "",
      description: "",
    });
    setIsAddDialogOpen(false);
  };

  const getColumnRequests = (status: string) => {
    return requests.filter(req => 
      req.status === status && 
      (req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
       req.equipment.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const canDropInColumn = (columnId: string): boolean => {
    if (!draggedCard || !canDrag) return false;
    const currentRequest = requests.find(r => r.id === draggedCard);
    if (!currentRequest) return false;
    const allowed = allowedTransitions[currentRequest.status] || [];
    return allowed.includes(columnId as MaintenanceRequest["status"]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {isTechnician ? "Kanban Board" : "Maintenance Requests"}
            </h1>
            {isPreviewActive && (
              <Badge variant="outline" className="animate-pulse">
                Preview Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {isTechnician 
              ? "Drag cards to update task status and log your work hours"
              : isManager || isAdmin
              ? "Manage and track all maintenance activities. Drag to reassign status."
              : "View maintenance request status"
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={view === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("kanban")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <CanAccess roles={["manager", "admin"]}>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Maintenance Request</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new maintenance request.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Brief description of the issue" 
                      value={newRequest.subject}
                      onChange={(e) => setNewRequest({...newRequest, subject: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Request Type</Label>
                      <Select 
                        value={newRequest.type}
                        onValueChange={(value: "corrective" | "preventive") => 
                          setNewRequest({...newRequest, type: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corrective">Corrective (Breakdown)</SelectItem>
                          <SelectItem value="preventive">Preventive (Routine)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select 
                        value={newRequest.priority}
                        onValueChange={(value: "high" | "medium" | "low") => 
                          setNewRequest({...newRequest, priority: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Equipment</Label>
                    <Select 
                      value={newRequest.equipment}
                      onValueChange={(value) => setNewRequest({...newRequest, equipment: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cnc-45">CNC Machine #45</SelectItem>
                        <SelectItem value="printer-7">Industrial Printer #7</SelectItem>
                        <SelectItem value="hvac-12">HVAC Unit #12</SelectItem>
                        <SelectItem value="conveyor-8">Conveyor Belt #8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduled">Scheduled Date</Label>
                      <Input 
                        id="scheduled" 
                        type="date" 
                        value={newRequest.scheduledDate}
                        onChange={(e) => setNewRequest({...newRequest, scheduledDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated">Estimated Hours</Label>
                      <Input 
                        id="estimated" 
                        type="number" 
                        placeholder="e.g., 4" 
                        value={newRequest.estimatedHours}
                        onChange={(e) => setNewRequest({...newRequest, estimatedHours: e.target.value})}
                        step="0.5"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Detailed description of the maintenance needed..." 
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRequest}>Create Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CanAccess>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role-based instructions */}
      {canDrag && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <RefreshCw className="w-4 h-4" />
          <span>
            {isTechnician && "Drag tasks: New → In Progress → Repaired"}
            {isManager && "Full access: Drag tasks to any status column"}
            {isAdmin && "Full access: Drag tasks to any status column"}
          </span>
          {isPreviewActive && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Changes are simulated in preview mode
            </Badge>
          )}
        </div>
      )}

      {/* Kanban Board */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const isDropTarget = dragOverColumn === column.id && canDropInColumn(column.id);
            const isInvalidDrop = dragOverColumn === column.id && !canDropInColumn(column.id);
            
            return (
              <div
                key={column.id}
                className={cn(
                  "kanban-column flex-shrink-0 w-80 transition-all duration-200 rounded-xl p-3",
                  isDropTarget && "ring-2 ring-primary ring-offset-2 bg-primary/5",
                  isInvalidDrop && "ring-2 ring-destructive/50 ring-offset-2 opacity-50"
                )}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id as MaintenanceRequest["status"])}
              >
                {/* Column Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${column.color} flex items-center justify-center`}>
                    <column.icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="outline" className="ml-auto">
                    {getColumnRequests(column.id).length}
                  </Badge>
                </div>

                {/* Cards */}
                <div className="space-y-3 min-h-[200px]">
                  {getColumnRequests(column.id).map((request) => (
                    <div
                      key={request.id}
                      draggable={canDrag}
                      onDragStart={(e) => handleDragStart(e, request.id)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "kanban-card border-l-4 bg-card rounded-lg p-4 shadow-sm border border-border",
                        getPriorityColor(request.priority),
                        draggedCard === request.id && "opacity-50 scale-95",
                        animatingCards.has(request.id) && "animate-scale-in",
                        canDrag && "cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200"
                      )}
                      onClick={() => (isTechnician || isManager) && setSelectedRequest(request)}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        {canDrag && (
                          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {request.subject}
                          </h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Wrench className="w-3 h-3" />
                            {request.equipment}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={request.type === "corrective" ? "destructive" : "info"} className="text-xs">
                          {request.type === "corrective" ? "Corrective" : "Preventive"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {request.team}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={request.technicianAvatar} />
                            <AvatarFallback>{request.technician.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{request.technician}</span>
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${
                          isOverdue(request.dueDate) && request.status !== "repaired" && request.status !== "scrap"
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        }`}>
                          <Clock className="w-3 h-3" />
                          {request.dueDate}
                        </div>
                      </div>

                      {/* Duration Display */}
                      {request.actualHours !== undefined && (
                        <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-xs text-success">
                          <Timer className="w-3 h-3" />
                          {request.actualHours}h logged
                        </div>
                      )}

                      {/* Last update indicator */}
                      {request.lastUpdatedBy && (
                        <div className="mt-1 text-xs text-muted-foreground/70">
                          Updated by {request.lastUpdatedBy}
                        </div>
                      )}
                    </div>
                  ))}

                  {getColumnRequests(column.id).length === 0 && (
                    <div className={cn(
                      "text-center py-8 text-muted-foreground text-sm rounded-lg border-2 border-dashed border-border",
                      isDropTarget && "border-primary bg-primary/5"
                    )}>
                      {isDropTarget ? "Drop here" : "No requests"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {requests
                .filter(req => 
                  req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  req.equipment.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((request) => (
                <div
                  key={request.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer border-l-4",
                    getPriorityColor(request.priority),
                    animatingCards.has(request.id) && "animate-fade-in"
                  )}
                  onClick={() => (isTechnician || isManager) && setSelectedRequest(request)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{request.subject}</h4>
                        <p className="text-sm text-muted-foreground">{request.equipment}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={request.technicianAvatar} />
                        <AvatarFallback>{request.technician.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Badge variant={
                        request.status === "new" ? "info" :
                        request.status === "in_progress" ? "warning" :
                        request.status === "repaired" ? "success" : "destructive"
                      }>
                        {request.status.replace("_", " ")}
                      </Badge>
                      {request.actualHours !== undefined && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {request.actualHours}h
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Duration Dialog */}
      <CanAccess roles={["technician", "manager"]}>
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Work Duration</DialogTitle>
              <DialogDescription>
                {selectedRequest?.subject} - {selectedRequest?.equipment}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Badge variant={
                  selectedRequest?.status === "new" ? "info" :
                  selectedRequest?.status === "in_progress" ? "warning" :
                  selectedRequest?.status === "repaired" ? "success" : "destructive"
                }>
                  {selectedRequest?.status?.replace("_", " ")}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours Spent</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 2.5"
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Estimated: {selectedRequest?.estimatedHours}h | 
                  Already logged: {selectedRequest?.actualHours || 0}h
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Cancel
              </Button>
              <Button onClick={handleLogDuration}>Log Duration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CanAccess>
    </div>
  );
}
