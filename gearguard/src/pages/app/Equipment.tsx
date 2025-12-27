import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Wrench,
  MapPin,
  Calendar,
  Lock,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { useEquipment, Equipment as EquipmentType } from "@/contexts/EquipmentContext";
import { CanAccess, ProtectedButton } from "@/components/auth/CanAccess";

const categories = ["All", "Machinery", "Electronics", "HVAC", "Vehicles", "IT Equipment", "Power"];
const departments = ["All", "Production", "Packaging", "Facilities", "Assembly", "Warehouse", "IT"];
const teams = ["Mechanics", "Electricians", "IT Support"];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "operational":
      return <Badge variant="success">Operational</Badge>;
    case "maintenance":
      return <Badge variant="warning">In Maintenance</Badge>;
    case "warning":
      return <Badge variant="accent">Needs Attention</Badge>;
    case "scrapped":
      return <Badge variant="outline" className="text-muted-foreground">Scrapped</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Equipment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentType | null>(null);
  
  // Form state for adding new equipment
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    serialNumber: "",
    category: "",
    department: "",
    location: "",
    team: "",
    notes: "",
  });

  const { isRole } = useAuth();
  const { getEffectiveRole, isPreviewActive } = useDemo();
  const { equipment, addEquipment, updateEquipment, deleteEquipment, markAsScrapped, createMaintenanceRequest, lastUpdate } = useEquipment();

  const effectiveRole = getEffectiveRole();
  const isAdmin = effectiveRole === "admin";
  const isManagerOrUser = effectiveRole === "manager" || effectiveRole === "user";
  const canEdit = isAdmin && !isPreviewActive;

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesDepartment = selectedDepartment === "All" || item.department === selectedDepartment;
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.serialNumber) return;
    
    addEquipment({
      name: newEquipment.name,
      serialNumber: newEquipment.serialNumber,
      category: newEquipment.category || "Machinery",
      department: newEquipment.department || "Production",
      location: newEquipment.location || "TBD",
      team: newEquipment.team || "Mechanics",
      status: "operational",
      openRequests: 0,
      lastMaintenance: new Date().toISOString().split("T")[0],
      notes: newEquipment.notes,
    });

    setNewEquipment({ name: "", serialNumber: "", category: "", department: "", location: "", team: "", notes: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditEquipment = () => {
    if (!editingEquipment) return;
    
    updateEquipment(editingEquipment.id, {
      name: editingEquipment.name,
      serialNumber: editingEquipment.serialNumber,
      category: editingEquipment.category,
      department: editingEquipment.department,
      location: editingEquipment.location,
      team: editingEquipment.team,
    });

    setEditingEquipment(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteEquipment = () => {
    if (!selectedEquipment) return;
    deleteEquipment(selectedEquipment.id);
    setSelectedEquipment(null);
    setIsDeleteDialogOpen(false);
  };

  const handleMarkAsScrapped = (eq: EquipmentType) => {
    markAsScrapped(eq.id);
  };

  const handleCreateRequest = (eq: EquipmentType) => {
    createMaintenanceRequest(eq.id);
  };

  const openEditDialog = (eq: EquipmentType) => {
    setEditingEquipment({ ...eq });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (eq: EquipmentType) => {
    setSelectedEquipment(eq);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6" key={lastUpdate}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Equipment</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Manage and track all your assets" : "View all equipment (read-only)"}
          </p>
        </div>
        
        <CanAccess roles={["admin"]}>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={isPreviewActive}>
                <Plus className="w-4 h-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Enter the details of the new equipment. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Equipment Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g., CNC Machine #46" 
                      value={newEquipment.name}
                      onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial Number *</Label>
                    <Input 
                      id="serial" 
                      placeholder="e.g., CNC-2024-046"
                      value={newEquipment.serialNumber}
                      onChange={(e) => setNewEquipment(prev => ({ ...prev, serialNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={newEquipment.category} 
                      onValueChange={(v) => setNewEquipment(prev => ({ ...prev, category: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== "All").map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                      value={newEquipment.department}
                      onValueChange={(v) => setNewEquipment(prev => ({ ...prev, department: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.filter(d => d !== "All").map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g., Building A, Floor 2"
                      value={newEquipment.location}
                      onChange={(e) => setNewEquipment(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance Team</Label>
                    <Select 
                      value={newEquipment.team}
                      onValueChange={(v) => setNewEquipment(prev => ({ ...prev, team: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team} value={team}>{team}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Additional information..."
                    value={newEquipment.notes}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEquipment} disabled={!newEquipment.name || !newEquipment.serialNumber}>
                  Save Equipment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CanAccess>

        <CanAccess roles={["manager"]} fallback={null}>
          <ProtectedButton roles={["admin"]} tooltip="Only administrators can add equipment">
            <Button className="gap-2" disabled>
              <Lock className="w-4 h-4" />
              Add Equipment
            </Button>
          </ProtectedButton>
        </CanAccess>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment by name or serial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Requests</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50 animate-fade-in"
                  onClick={() => setSelectedEquipment(item)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.serialNumber}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {item.department}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-center">
                    {item.openRequests > 0 ? (
                      <Badge variant="warning" className="gap-1">
                        <Wrench className="w-3 h-3" />
                        {item.openRequests}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedEquipment(item); }}>
                          View Details
                        </DropdownMenuItem>
                        <CanAccess roles={["admin"]}>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); openEditDialog(item); }}
                            disabled={isPreviewActive}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Equipment
                          </DropdownMenuItem>
                        </CanAccess>
                        <CanAccess roles={["manager", "user"]}>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); handleCreateRequest(item); }}
                            disabled={isPreviewActive}
                          >
                            Create Maintenance Request
                          </DropdownMenuItem>
                        </CanAccess>
                        <DropdownMenuSeparator />
                        <CanAccess roles={["admin"]}>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); handleMarkAsScrapped(item); }}
                            disabled={isPreviewActive || item.status === "scrapped"}
                            className="text-warning"
                          >
                            Mark as Scrapped
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); openDeleteDialog(item); }}
                            disabled={isPreviewActive}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Equipment
                          </DropdownMenuItem>
                        </CanAccess>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Equipment Detail Dialog */}
      {selectedEquipment && !isEditDialogOpen && !isDeleteDialogOpen && (
        <Dialog open={!!selectedEquipment} onOpenChange={() => setSelectedEquipment(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-primary" />
                </div>
                {selectedEquipment.name}
              </DialogTitle>
              <DialogDescription>
                Serial: {selectedEquipment.serialNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {getStatusBadge(selectedEquipment.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{selectedEquipment.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{selectedEquipment.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedEquipment.location}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Maintenance Team</span>
                <span className="font-medium">{selectedEquipment.team}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Maintenance</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {selectedEquipment.lastMaintenance}
                </span>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedEquipment(null)}>
                Close
              </Button>
              <CanAccess roles={["manager", "user"]}>
                <Button 
                  onClick={() => handleCreateRequest(selectedEquipment)}
                  disabled={isPreviewActive}
                >
                  Create Request
                </Button>
              </CanAccess>
              <CanAccess roles={["admin"]}>
                <Button 
                  onClick={() => openEditDialog(selectedEquipment)}
                  disabled={isPreviewActive}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CanAccess>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Equipment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>
              Update the equipment details below.
            </DialogDescription>
          </DialogHeader>
          {editingEquipment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Equipment Name</Label>
                  <Input 
                    value={editingEquipment.name}
                    onChange={(e) => setEditingEquipment(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Serial Number</Label>
                  <Input 
                    value={editingEquipment.serialNumber}
                    onChange={(e) => setEditingEquipment(prev => prev ? { ...prev, serialNumber: e.target.value } : null)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={editingEquipment.category}
                    onValueChange={(v) => setEditingEquipment(prev => prev ? { ...prev, category: v } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select 
                    value={editingEquipment.department}
                    onValueChange={(v) => setEditingEquipment(prev => prev ? { ...prev, department: v } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter(d => d !== "All").map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    value={editingEquipment.location}
                    onChange={(e) => setEditingEquipment(prev => prev ? { ...prev, location: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maintenance Team</Label>
                  <Select 
                    value={editingEquipment.team}
                    onValueChange={(v) => setEditingEquipment(prev => prev ? { ...prev, team: v } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditEquipment}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedEquipment?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEquipment} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
