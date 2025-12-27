import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Mail, Lock, User, Building, ArrowRight, CheckCircle, Home } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { roleLabels } from "@/config/navigation";

const benefits = [
  "Unlimited equipment tracking",
  "Smart maintenance workflows",
  "Team collaboration tools",
  "Advanced analytics & reports",
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    role: "" as UserRole | "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = formData.role || "user";
    register(formData.name, formData.email, formData.password, role as UserRole);
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GearGuard</span>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Create your account</h2>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Corporation"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with numbers and symbols
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2 mt-6">
              Create account
              <ArrowRight className="w-4 h-4" />
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By signing up, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-12 gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.3)_0%,_transparent_60%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-sidebar-foreground">GearGuard</span>
            </Link>
            <Link to="/">
              <Button variant="hero-outline" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-sidebar-foreground mb-6">
              Start managing your maintenance smarter
            </h1>
            <p className="text-lg text-sidebar-foreground/80 mb-8">
              Get started in minutes. No credit card required.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sidebar-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-sidebar-accent/50 backdrop-blur-sm border border-sidebar-border">
            <p className="text-sidebar-foreground mb-4">
              "GearGuard transformed how we manage maintenance. We went from chaos to complete visibility in just one week."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-sidebar-foreground">David Miller</div>
                <div className="text-sm text-sidebar-foreground/70">VP Operations, Nexus Industries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
