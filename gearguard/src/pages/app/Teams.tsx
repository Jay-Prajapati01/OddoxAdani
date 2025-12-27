import { useState } from "react";
import {
  Plus,
  Search,
  Users,
  MoreHorizontal,
  Mail,
  Phone,
  Wrench,
  Zap,
  Monitor,
  UserPlus,
  Shield,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemo } from "@/contexts/DemoContext";
import { useTeams, iconMap } from "@/contexts/TeamsContext";
import { CanAccess } from "@/components/auth/CanAccess";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const getStatusColor = (status: string) => {
  switch (status) {
    case "available": return "bg-success";
    case "busy": return "bg-warning";
    case "offline": return "bg-muted";
    default: return "bg-muted";
  }
};

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });
  const [newMember, setNewMember] = useState({ name: "", email: "", phone: "", role: "" });

  const { getEffectiveRole, isPreviewActive } = useDemo();
  const { teams, addTeam, deleteTeam, addMember, updateMemberRole, assignWork, getAllMembers, lastUpdate } = useTeams();

  const effectiveRole = getEffectiveRole();
  const isAdmin = effectiveRole === "admin";

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTeamData = teams.find(t => t.id === selectedTeam);

  const handleAddTeam = () => {
    if (!newTeam.name) return;
    addTeam({ name: newTeam.name, description: newTeam.description, iconName: "wrench", color: "bg-primary" });
    setNewTeam({ name: "", description: "" });
    setIsAddDialogOpen(false);
  };

  const handleAddMember = () => {
    if (!newMember.name || !selectedTeam) return;
    addMember(selectedTeam, {
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      role: newMember.role || "Technician",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      status: "available",
      userRole: "technician",
    });
    setNewMember({ name: "", email: "", phone: "", role: "" });
    setIsAddMemberOpen(false);
  };

  const handleAssignWork = () => {
    if (!selectedTeam) return;
    assignWork(selectedTeam, "New task assigned");
    setSelectedTeam(null);
  };

  return (
    <div className="space-y-6" key={lastUpdate}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {isAdmin ? "Team & User Management" : "Maintenance Teams"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Manage technician teams, users, and role assignments" : "Manage your technician teams and assignments"}
          </p>
        </div>
        <div className="flex gap-3">
          <CanAccess roles={["admin"]}>
            <Dialog open={isUserManagementOpen} onOpenChange={setIsUserManagementOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isPreviewActive}>
                  <Shield className="w-4 h-4" />
                  User Roles
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Role Management</DialogTitle>
                  <DialogDescription>Assign and manage user roles across the system.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {getAllMembers().slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                      <Select 
                        defaultValue={member.userRole || "technician"}
                        onValueChange={(v) => updateMemberRole(member.id, v as any)}
                        disabled={isPreviewActive}
                      >
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="technician">Technician</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button onClick={() => { setIsUserManagementOpen(false); toast.success("Roles saved"); }}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CanAccess>

          <CanAccess roles={["admin", "manager"]}>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" disabled={isPreviewActive}><Plus className="w-4 h-4" />Add Team</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>Set up a new maintenance team.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Team Name *</Label>
                    <Input value={newTeam.name} onChange={(e) => setNewTeam(p => ({ ...p, name: e.target.value }))} placeholder="e.g., HVAC Specialists" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input value={newTeam.description} onChange={(e) => setNewTeam(p => ({ ...p, description: e.target.value }))} placeholder="What does this team handle?" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddTeam} disabled={!newTeam.name}>Create Team</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CanAccess>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search teams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const Icon = iconMap[team.iconName] || Wrench;
          return (
            <Card key={team.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in" onClick={() => setSelectedTeam(team.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${team.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{team.description}</p>
                    </div>
                  </div>
                  <CanAccess roles={["admin"]}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled={isPreviewActive}>Edit Team</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedTeam(team.id); setIsAddMemberOpen(true); }} disabled={isPreviewActive}>Add Member</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); deleteTeam(team.id); }} disabled={isPreviewActive} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CanAccess>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-foreground">{team.activeRequests}</div>
                    <div className="text-xs text-muted-foreground">Active Requests</div>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10">
                    <div className="text-2xl font-bold text-success">{team.completedToday}</div>
                    <div className="text-xs text-muted-foreground">Completed Today</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 4).map((member) => (
                      <Avatar key={member.id} className="w-8 h-8 border-2 border-card">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members.length > 4 && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-card">+{team.members.length - 4}</div>}
                  </div>
                  <Badge variant="outline" className="gap-1"><Users className="w-3 h-3" />{team.members.length} members</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Team Detail Dialog */}
      {selectedTeamData && !isAddMemberOpen && (
        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${selectedTeamData.color} flex items-center justify-center`}>
                  {(() => { const Icon = iconMap[selectedTeamData.iconName] || Wrench; return <Icon className="w-6 h-6 text-primary-foreground" />; })()}
                </div>
                <div>
                  <DialogTitle>{selectedTeamData.name}</DialogTitle>
                  <DialogDescription>{selectedTeamData.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground">Team Members</h4>
                <CanAccess roles={["admin"]}>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => setIsAddMemberOpen(true)} disabled={isPreviewActive}>
                    <UserPlus className="w-4 h-4" />Add Member
                  </Button>
                </CanAccess>
              </div>
              <div className="space-y-3">
                {selectedTeamData.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10"><AvatarImage src={member.avatar} /><AvatarFallback>{member.name.charAt(0)}</AvatarFallback></Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${getStatusColor(member.status)} border-2 border-card`} />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success(`Email sent to ${member.name}`)}><Mail className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success(`Calling ${member.name}...`)}><Phone className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTeam(null)}>Close</Button>
              <CanAccess roles={["manager"]}>
                <Button onClick={handleAssignWork} disabled={isPreviewActive}>Assign Work</Button>
              </CanAccess>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Add a new member to {selectedTeamData?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={newMember.name} onChange={(e) => setNewMember(p => ({ ...p, name: e.target.value }))} placeholder="Full name" /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={newMember.email} onChange={(e) => setNewMember(p => ({ ...p, email: e.target.value }))} placeholder="email@company.com" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={newMember.phone} onChange={(e) => setNewMember(p => ({ ...p, phone: e.target.value }))} placeholder="+1 555-0000" /></div>
            <div className="space-y-2"><Label>Role</Label><Input value={newMember.role} onChange={(e) => setNewMember(p => ({ ...p, role: e.target.value }))} placeholder="e.g., Technician" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember} disabled={!newMember.name}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
