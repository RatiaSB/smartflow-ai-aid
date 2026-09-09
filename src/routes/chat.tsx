import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useSyncExternalStore } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Plus, MessagesSquare, Trash2 } from "lucide-react";
import { threadStore, hydrateThreads } from "@/lib/thread-store";

import { cn } from "@/lib/utils";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Workplace Chat — SmartOffice AI" },
      { name: "description", content: "Chat with your AI workplace assistant." },
    ],
  }),
  component: ChatLayout,
});

const EMPTY_THREADS: ReturnType<typeof threadStore.list> = [];
function useThreads() {
  return useSyncExternalStore(
    (cb) => threadStore.subscribe(cb),
    () => threadStore.list(),
    () => EMPTY_THREADS,
  );
}

function ChatLayout() {
  const threads = useThreads();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    hydrateThreads();
    if (path === "/chat") {
      const existing = threadStore.list();
      const target = existing[0] ?? threadStore.create();
      navigate({ to: "/chat/$threadId", params: { threadId: target.id }, replace: true });
    }
  }, [path, navigate]);


  const newThread = () => {
    const t = threadStore.create();
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  return (
    <div className="flex h-[100dvh] md:h-screen">
      {/* Thread list */}
      <aside className="hidden md:flex flex-col w-72 border-r border-border bg-sidebar/40">
        <div className="p-3 border-b border-border">
          <button
            onClick={newThread}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" /> New conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {threads.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No conversations yet
            </div>
          )}
          {threads.map((t) => {
            const active = path === `/chat/${t.id}`;
            return (
              <div
                key={t.id}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors",
                  active ? "bg-primary/10 text-foreground" : "hover:bg-muted",
                )}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="flex-1 flex items-center gap-2 min-w-0"
                >
                  <MessagesSquare className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                  <span className="truncate">{t.title}</span>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    threadStore.remove(t.id);
                    const remaining = threadStore.list();
                    if (active) {
                      const next = remaining[0] ?? threadStore.create();
                      navigate({ to: "/chat/$threadId", params: { threadId: next.id }, replace: true });
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 grid place-items-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-border">
          <AiDisclaimer />
        </div>
      </aside>

      {/* Mobile thread chip bar */}
      <div className="md:hidden absolute top-14 left-0 right-0 z-20 px-3 py-2 border-b border-border bg-background/80 backdrop-blur flex items-center gap-2 overflow-x-auto">
        <button
          onClick={newThread}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> New
        </button>
        {threads.map((t) => {
          const active = path === `/chat/${t.id}`;
          return (
            <Link
              key={t.id}
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs border transition-colors",
                active ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background hover:bg-muted",
              )}
            >
              {t.title.length > 20 ? t.title.slice(0, 20) + "…" : t.title}
            </Link>
          );
        })}
      </div>

      <div className="flex-1 min-w-0 pt-12 md:pt-0">
        <Outlet />
      </div>
    </div>
  );
}
