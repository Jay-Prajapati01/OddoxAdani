import { useState } from "react";
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRealTimeUpdates } from "@/hooks/useRoleSync";
import { cn } from "@/lib/utils";

const myRequests = [
  {
    id: 1,
    subject: "Air conditioning not working",
    equipment: "HVAC Unit #12",
    status: "in_progress",
    createdAt: "Jan 18, 2024",
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    subject: "Printer paper jam issue",
    equipment: "Industrial Printer #7",
    status: "new",
    createdAt: "Jan 19, 2024",
    updatedAt: "Just now",
  },
  {
    id: 3,
    subject: "Monitor flickering",
    equipment: "Workstation #15",
    status: "completed",
    createdAt: "Jan 15, 2024",
    updatedAt: "Jan 17, 2024",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge variant="info">Submitted</Badge>;
    case "in_progress":
      return <Badge variant="warning">In Progress</Badge>;
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "new":
      return <Clock className="w-5 h-5 text-info" />;
    case "in_progress":
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    default:
      return <Clock className="w-5 h-5 text-muted-foreground" />;
  }
};

export function UserWidgets() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { updateKey, isPreviewActive } = useRealTimeUpdates();

  const openRequests = myRequests.filter(r => r.status !== "completed").length;
  const completedRequests = myRequests.filter(r => r.status === "completed").length;

  return (
    <div key={updateKey} className={cn("space-y-6 animate-widget-enter", isPreviewActive && "pointer-events-none")}>
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground">Track your maintenance requests</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Report an Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report a Maintenance Issue</DialogTitle>
              <DialogDescription>
                Describe the problem and we'll assign a technician to help.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of the issue" />
              </div>
              <div className="space-y-2">
                <Label>Equipment / Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hvac">HVAC Unit #12</SelectItem>
                    <SelectItem value="printer">Industrial Printer #7</SelectItem>
                    <SelectItem value="workstation">Workstation #15</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please describe the issue in detail..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gap-2" onClick={() => setIsDialogOpen(false)}>
                <Send className="w-4 h-4" />
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-warning-light border-warning/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{openRequests}</div>
              <div className="text-sm text-muted-foreground">Open Requests</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success-light border-success/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{completedRequests}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-muted-foreground" />
            My Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getStatusIcon(request.status)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-foreground">{request.subject}</div>
                      <div className="text-sm text-muted-foreground">{request.equipment}</div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Created: {request.createdAt}</span>
                    <span>•</span>
                    <span>Updated: {request.updatedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {myRequests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No requests yet</p>
              <p className="text-sm">Report an issue to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you're experiencing an issue with equipment, report it using the button above.
            Our maintenance team will be notified and assigned to help you.
          </p>
          <Button variant="outline" className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Report an Issue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
