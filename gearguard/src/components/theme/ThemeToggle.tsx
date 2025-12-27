import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Sun Icon */}
      <Sun
        className={cn(
          "h-5 w-5 absolute transition-all duration-500 ease-in-out",
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      />
      {/* Moon Icon */}
      <Moon
        className={cn(
          "h-5 w-5 absolute transition-all duration-500 ease-in-out",
          theme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function ThemeToggleExpanded() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-1 rounded-full bg-muted/50 border border-border">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
          theme === "light"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="w-4 h-4" />
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
          theme === "dark"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="w-4 h-4" />
        Dark
      </button>
    </div>
  );
}
