import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Shield,
  Wrench,
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  Factory,
  Building2,
  Truck,
  Star,
  Zap,
  Clock,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Wrench,
    title: "Equipment Tracking",
    description: "Centralized asset management with complete lifecycle visibility. Track warranty, location, and maintenance history.",
  },
  {
    icon: Target,
    title: "Smart Maintenance Requests",
    description: "Intelligent request routing with auto-fill capabilities. Match equipment to the right team instantly.",
  },
  {
    icon: Calendar,
    title: "Preventive Scheduling",
    description: "Automated preventive maintenance calendar. Never miss a scheduled service again.",
  },
  {
    icon: Users,
    title: "Team-Based Workflows",
    description: "Organize technicians into specialized teams. Assign and track work efficiently.",
  },
  {
    icon: Zap,
    title: "Kanban Workflows",
    description: "Visual task management with drag-and-drop. See your maintenance pipeline at a glance.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive reports and insights. Make data-driven maintenance decisions.",
  },
];

const useCases = [
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Keep production lines running with proactive equipment maintenance.",
    color: "bg-primary-light text-primary",
  },
  {
    icon: Building2,
    title: "IT & Offices",
    description: "Manage IT infrastructure and office equipment efficiently.",
    color: "bg-secondary-light text-secondary",
  },
  {
    icon: Truck,
    title: "Logistics & Transport",
    description: "Maintain fleet vehicles and warehouse equipment with ease.",
    color: "bg-accent-light text-accent",
  },
];

const testimonials = [
  {
    quote: "GearGuard reduced our equipment downtime by 40%. The preventive maintenance scheduling is a game-changer.",
    author: "Sarah Chen",
    role: "Operations Manager",
    company: "TechManufacturing Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
  },
  {
    quote: "Finally, a maintenance system that our technicians actually want to use. The Kanban board is intuitive and powerful.",
    author: "Michael Torres",
    role: "Maintenance Director",
    company: "Global Logistics Corp",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
  },
  {
    quote: "The analytics dashboard gives us insights we never had before. We've cut maintenance costs by 25%.",
    author: "Emily Watson",
    role: "Facility Manager",
    company: "Enterprise Solutions",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "40%", label: "Less Downtime" },
  { value: "10K+", label: "Assets Managed" },
  { value: "500+", label: "Companies Trust Us" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GearGuard</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15)_0%,_transparent_60%)]" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4" />
              <span>Trusted by 500+ enterprises worldwide</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up">
              Smart Maintenance.{" "}
              <span className="gradient-text">Zero Downtime.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-100">
              The ultimate maintenance management platform. Track assets, automate workflows, and keep your operations running smoothly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-200">
              <Link to="/register">
                <Button size="xl" className="gap-2 shadow-lg hover:shadow-xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="xl" variant="outline" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 lg:mt-24 relative animate-fade-in-up animation-delay-300">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-4 p-8 w-full max-w-4xl">
                  {/* Mini KPI Cards */}
                  {[
                    { label: "Total Equipment", value: "248", color: "bg-primary" },
                    { label: "Open Requests", value: "12", color: "bg-warning" },
                    { label: "Completed Today", value: "8", color: "bg-success" },
                    { label: "Teams Active", value: "5", color: "bg-secondary" },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
                      <div className={`w-8 h-8 rounded-lg ${kpi.color} flex items-center justify-center mb-3`}>
                        <div className="w-4 h-4 bg-primary-foreground/30 rounded" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                      <div className="text-sm text-muted-foreground">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-sidebar">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-sidebar-foreground mb-2">{stat.value}</div>
                <div className="text-sidebar-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Maintenance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete suite of tools designed for modern maintenance teams
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Built for Every Industry
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From manufacturing floors to corporate offices, GearGuard adapts to your needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {useCases.map((useCase, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${useCase.color} flex items-center justify-center mb-6`}>
                  <useCase.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Loved by Maintenance Teams
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about GearGuard
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-sidebar">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-sidebar-foreground mb-4">
              Ready to Eliminate Downtime?
            </h2>
            <p className="text-lg text-sidebar-foreground/80 mb-8">
              Join thousands of companies using GearGuard to streamline their maintenance operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="xl" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="xl" variant="hero-outline" className="text-sidebar-foreground border-sidebar-foreground/30 hover:bg-sidebar-foreground/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-sidebar border-t border-sidebar-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-sidebar-foreground">GearGuard</span>
              </Link>
              <p className="text-sidebar-foreground/70 text-sm">
                The ultimate maintenance management platform for modern enterprises.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#features" className="hover:text-sidebar-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-sidebar-foreground/60">
            <div>© 2024 GearGuard. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-sidebar-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-sidebar-foreground transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-sidebar-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
