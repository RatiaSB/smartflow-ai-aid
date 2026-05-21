import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarCheck2,
  Sparkles,
  MessagesSquare,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { MobileQR } from "@/components/MobileQR";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SmartOffice AI" },
      { name: "description", content: "Your AI-powered workplace dashboard." },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  { to: "/email", title: "Smart Email", desc: "Draft professional emails in seconds.", icon: Mail, hue: "from-primary/90 to-primary" },
  { to: "/notes", title: "Notes Summarizer", desc: "Turn long meeting notes into action items.", icon: FileText, hue: "from-accent/90 to-accent" },
  { to: "/planner", title: "Task Planner", desc: "Build daily & weekly schedules.", icon: CalendarCheck2, hue: "from-primary/90 to-accent" },
  { to: "/research", title: "Research Assistant", desc: "Summarize topics & reports clearly.", icon: Sparkles, hue: "from-accent/90 to-primary" },
  { to: "/chat", title: "Workplace Chat", desc: "Ask anything, get help instantly.", icon: MessagesSquare, hue: "from-primary to-primary/70" },
] as const;

const STATS = [
  { label: "AI assistants", value: "5", sub: "ready to use", icon: Zap, accent: "text-primary" },
  { label: "Avg. time saved", value: "4.2h", sub: "per week", icon: CalendarCheck2, accent: "text-accent" },
  { label: "Roles supported", value: "7+", sub: "office staff", icon: Users, accent: "text-primary" },
  { label: "Responsible AI", value: "On", sub: "review prompts", icon: ShieldCheck, accent: "text-success" },
];

function Dashboard() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-10 shadow-card">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full gradient-brand opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-60 w-60 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">AI services online</span>
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">
            Hello, welcome to <span className="text-gradient-brand">SmartOffice AI</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
            A friendly AI assistant for receptionists, HR, retail supervisors, school admin and
            small business teams. Automate everyday office work — without writing a single line of code.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-95 transition"
            >
              Start chatting <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition"
            >
              Draft an email
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4 md:p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <Icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </div>
          );
        })}
      </section>

      {/* Tools grid */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">AI workspace</h2>
          <span className="text-xs text-muted-foreground">Pick a tool to get started</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-glow hover:-translate-y-0.5 transition-all"
              >
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${t.hue} opacity-15 blur-2xl`} />
                <div className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${t.hue} text-primary-foreground shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="relative mt-4 font-semibold tracking-tight">{t.title}</div>
                <div className="relative mt-1 text-sm text-muted-foreground">{t.desc}</div>
                <div className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                  Open <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <MobileQR />

      <AiDisclaimer />
    </div>
  );
}
