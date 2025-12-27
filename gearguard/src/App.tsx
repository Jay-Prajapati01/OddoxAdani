import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";
import { EquipmentProvider } from "@/contexts/EquipmentContext";
import { TeamsProvider } from "@/contexts/TeamsContext";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Equipment from "./pages/app/Equipment";
import Maintenance from "./pages/app/Maintenance";
import Teams from "./pages/app/Teams";
import MaintenanceCalendar from "./pages/app/MaintenanceCalendar";
import Reports from "./pages/app/Reports";
import Settings from "./pages/app/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component to provide all contexts
function AppProviders({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  return (
    <DemoProvider actualRole={role}>
      <MaintenanceProvider>
        <EquipmentProvider>
          <TeamsProvider>
            <CalendarProvider>
              <SettingsProvider>
                {children}
              </SettingsProvider>
            </CalendarProvider>
          </TeamsProvider>
        </EquipmentProvider>
      </MaintenanceProvider>
    </DemoProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
      <AuthProvider>
        <AppProviders>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* App Routes */}
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="equipment" element={<Equipment />} />
                  <Route path="maintenance" element={<Maintenance />} />
                  <Route path="teams" element={<Teams />} />
                  <Route path="calendar" element={<MaintenanceCalendar />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProviders>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
