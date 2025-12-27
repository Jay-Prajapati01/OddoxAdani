import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Building,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Camera,
  Wrench,
  Moon,
  Sun,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const roleInfo: Record<string, { color: string; bgColor: string; icon: string; description: string; permissions: string[] }> = {
  admin: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    icon: "shield",
    description: "Full system access with user and equipment management capabilities",
    permissions: ["Manage Equipment", "Manage Teams", "Manage Users", "System Settings", "View All Data"],
  },
  manager: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: "briefcase",
    description: "Oversee maintenance operations and manage technician assignments",
    permissions: ["View Reports", "Schedule Maintenance", "Assign Tasks", "View Calendar", "Manage Requests"],
  },
  technician: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "wrench",
    description: "Execute maintenance tasks and update work progress",
    permissions: ["View Tasks", "Update Status", "Log Duration", "View Calendar", "Self-Assign"],
  },
  user: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    icon: "user",
    description: "Submit maintenance requests and track their status",
    permissions: ["Create Requests", "View My Requests", "Track Status"],
  },
};

// Theme Selector Component with animated toggle
function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300",
          theme === "light"
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
          theme === "light"
            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white scale-110"
            : "bg-muted text-muted-foreground"
        )}>
          <Sun className={cn(
            "w-6 h-6 transition-transform duration-500",
            theme === "light" && "animate-spin-slow"
          )} />
        </div>
        <div className="text-center">
          <div className="font-semibold text-foreground">Light</div>
          <div className="text-xs text-muted-foreground">Bright & clear</div>
        </div>
        {theme === "light" && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
        )}
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300",
          theme === "dark"
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
          theme === "dark"
            ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white scale-110"
            : "bg-muted text-muted-foreground"
        )}>
          <Moon className={cn(
            "w-6 h-6 transition-transform duration-500",
            theme === "dark" && "rotate-12"
          )} />
        </div>
        <div className="text-center">
          <div className="font-semibold text-foreground">Dark</div>
          <div className="text-xs text-muted-foreground">Easy on eyes</div>
        </div>
        {theme === "dark" && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
        )}
      </button>
    </div>
  );
}

export default function Settings() {
  const { user, isRole } = useAuth();
  const { getEffectiveRole, isPreviewActive } = useDemo();
  const { profile, notifications, company, updateProfile, updateNotifications, updateCompany, updatePassword, enable2FA, deleteAccount } = useSettings();
  const { requests } = useMaintenance();
  
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [profileForm, setProfileForm] = useState({
    firstName: user?.name?.split(" ")[0] || profile.firstName,
    lastName: user?.name?.split(" ")[1] || profile.lastName,
    email: user?.email || profile.email,
    bio: profile.bio,
  });

  const effectiveRole = getEffectiveRole() || user?.role || "user";
  const roleData = roleInfo[effectiveRole];
  
  // Calculate stats based on role
  const completedTasks = requests.filter(r => r.status === "repaired").length;
  const totalTasks = requests.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const showCompanyTab = isRole("admin", "manager");
  const showSecurityTab = isRole("admin");

  const handleSaveProfile = () => {
    updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      bio: profileForm.bio,
    });
  };

  const handleSaveNotifications = () => {
    updateNotifications(localNotifications);
  };

  const handleUpdatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    const success = await updatePassword(passwords.current, passwords.new);
    if (success) {
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className={`grid w-full max-w-md ${showCompanyTab && showSecurityTab ? "grid-cols-4" : showCompanyTab || showSecurityTab ? "grid-cols-3" : "grid-cols-2"}`}>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4 hidden sm:block" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4 hidden sm:block" />
            Alerts
          </TabsTrigger>
          {showCompanyTab && (
            <TabsTrigger value="company" className="gap-2">
              <Building className="w-4 h-4 hidden sm:block" />
              Company
            </TabsTrigger>
          )}
          {showSecurityTab && (
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4 hidden sm:block" />
              Security
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          {/* Premium Profile Header Card */}
          <Card className="overflow-hidden">
            <div className="relative">
              {/* Gradient Background */}
              <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-primary/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
              </div>
              
              {/* Profile Content */}
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-6 -mt-16 relative">
                  {/* Avatar with Status */}
                  <div className="relative group">
                    <Avatar className="w-28 h-28 border-4 border-card shadow-xl ring-4 ring-primary/20">
                      <AvatarImage src={user?.avatar} className="object-cover" />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                        {user?.name?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute bottom-1 right-1 w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toast.success("Photo upload feature coming soon!")}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-success border-2 border-card" title="Online" />
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 pt-4 sm:pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{user?.name || "User"}</h2>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{user?.email}</span>
                        </div>
                      </div>
                      
                      {/* Role Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${roleData.bgColor} ${roleData.color} font-semibold`}>
                        {effectiveRole === "admin" && <Shield className="w-4 h-4" />}
                        {effectiveRole === "manager" && <Briefcase className="w-4 h-4" />}
                        {effectiveRole === "technician" && <Wrench className="w-4 h-4" />}
                        {effectiveRole === "user" && <User className="w-4 h-4" />}
                        <span className="capitalize">{effectiveRole}</span>
                        {isPreviewActive && (
                          <Badge variant="outline" className="ml-1 text-xs">Preview</Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="mt-3 text-sm text-muted-foreground max-w-lg">{roleData.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{completedTasks}</div>
                    <div className="text-xs text-muted-foreground">Tasks Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{completionRate}%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">4.2h</div>
                    <div className="text-xs text-muted-foreground">Avg. Response</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-info/5 to-info/10 border-info/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-info/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">Gold</div>
                    <div className="text-xs text-muted-foreground">Performance Tier</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role Permissions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-muted-foreground" />
                Role Permissions
              </CardTitle>
              <CardDescription>Capabilities available to your current role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {roleData.permissions.map((permission, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 py-1.5 px-3">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    {permission}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="flex items-center gap-3">
                  <Input 
                    id="role" 
                    value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""} 
                    disabled 
                    className="flex-1"
                  />
                  <Badge variant="outline" className={roleData.color}>
                    {effectiveRole === "admin" ? "Full Access" : "Limited Access"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Contact an administrator to change your role</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself..." 
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>

              <Button className="gap-2" onClick={handleSaveProfile}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Member Since</div>
                    <div className="font-medium">January 2024</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Location</div>
                    <div className="font-medium">Manufacturing City, MC</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="font-medium">+1 555-0123</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Department</div>
                    <div className="font-medium">Maintenance Operations</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Theme Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how GearGuard looks on your device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">Theme</Label>
                <ThemeSelector />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={localNotifications.email}
                    onCheckedChange={(checked) => setLocalNotifications({...localNotifications, email: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch 
                    checked={localNotifications.push}
                    onCheckedChange={(checked) => setLocalNotifications({...localNotifications, push: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Overdue Task Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when tasks become overdue</p>
                  </div>
                  <Switch 
                    checked={localNotifications.overdue}
                    onCheckedChange={(checked) => setLocalNotifications({...localNotifications, overdue: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Task Completion Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when tasks are completed</p>
                  </div>
                  <Switch 
                    checked={localNotifications.completed}
                    onCheckedChange={(checked) => setLocalNotifications({...localNotifications, completed: checked})}
                  />
                </div>
              </div>

              <Button className="gap-2" onClick={handleSaveNotifications}>
                <Save className="w-4 h-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your organization's details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue={company.companyName} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue={company.industry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Select defaultValue={company.size}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">1-50 employees</SelectItem>
                      <SelectItem value="medium">51-200 employees</SelectItem>
                      <SelectItem value="large">201-1000 employees</SelectItem>
                      <SelectItem value="enterprise">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue={company.address} />
              </div>

              <Button className="gap-2" onClick={() => updateCompany({})}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={passwords.current}
                    onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  />
                </div>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status: <span className="text-muted-foreground">Not Enabled</span></p>
                    <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                  </div>
                  <Button variant="outline" onClick={enable2FA}>Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" onClick={deleteAccount}>Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
