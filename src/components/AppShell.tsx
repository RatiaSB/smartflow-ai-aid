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
  Linkedin,
} from "lucide-react";
import { useState } from "react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
    </svg>
  );
}

function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.328.328 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .55-.012.82-.034a6.617 6.617 0 0 1-.241-1.79c0-3.711 3.604-6.715 8.05-6.715.272 0 .54.014.804.034C17.31 4.32 13.328 2.188 8.691 2.188zM5.785 5.991a1.077 1.077 0 1 1 0 2.154 1.077 1.077 0 0 1 0-2.154zm5.813 0a1.077 1.077 0 1 1 0 2.154 1.077 1.077 0 0 1 0-2.154zM17.5 9.776c-3.866 0-7 2.612-7 5.834 0 1.766.94 3.36 2.42 4.443a.502.502 0 0 1 .18.567l-.33 1.232c-.014.058-.04.116-.04.18a.246.246 0 0 0 .247.246.281.281 0 0 0 .142-.046l1.605-.927a.726.726 0 0 1 .604-.08c.728.21 1.51.327 2.32.327 3.866 0 7-2.612 7-5.834-.001-3.222-3.135-5.842-7.148-5.842zm-2.328 3.137a.86.86 0 1 1 0 1.72.86.86 0 0 1 0-1.72zm4.656 0a.86.86 0 1 1 0 1.72.86.86 0 0 1 0-1.72z"/>
    </svg>
  );
}
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
