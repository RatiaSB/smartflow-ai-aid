import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarCheck2,
  Sparkles,
  MessagesSquare,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import logo from "@/assets/logo.png";
import { SidebarQR } from "@/components/SidebarQR";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck2 },
  { to: "/research", label: "Research", icon: Sparkles },
  { to: "/chat", label: "Workplace Chat", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? path === "/" : path === to || path.startsWith(to + "/");

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4 h-14">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SmartOffice AI" className="h-7 w-7" />
          <span className="font-semibold tracking-tight">SmartOffice<span className="text-accent">.</span>AI</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed md:sticky top-0 z-40 md:z-10 h-screen w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:translate-x-0 flex flex-col",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="hidden md:flex items-center gap-2 px-5 h-16 border-b border-sidebar-border shrink-0">
            <img src={logo} alt="" className="h-8 w-8" />
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">SmartOffice<span className="text-accent">.</span>AI</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">SME Assistant</div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <nav className="p-3 space-y-1">
              <div className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Workspace
              </div>
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "" : "text-muted-foreground")} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <SidebarQR />
          </div>

          <div className="shrink-0 p-3 border-t border-sidebar-border">
            <button
              onClick={toggle}
              className="hidden md:flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sidebar-accent"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>
            <div className="px-3 pt-3 pb-1 text-[11px] text-muted-foreground leading-relaxed">
              Built by <span className="text-foreground font-medium">Swatsi Ratia</span> · CAPACITI
            </div>
          </div>
        </aside>

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm"
          />
        )}

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
