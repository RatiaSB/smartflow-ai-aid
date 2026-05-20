import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck2, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Markdown } from "@/components/Markdown";
import { CopyButton } from "@/components/CopyButton";
import { useGenerate } from "@/lib/use-generate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — SmartOffice AI" },
      { name: "description", content: "Prioritize tasks and build a daily or weekly plan." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<"daily" | "weekly">("daily");
  const { run, loading, error, output, clear } = useGenerate("planner");

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto space-y-6">
      <PageHeader
        icon={CalendarCheck2}
        title="AI Task Planner"
        description="List your tasks — the AI will prioritise and time-block them for you."
      />

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <form
          onSubmit={(e) => { e.preventDefault(); if (tasks.trim()) run({ tasks: tasks.trim(), horizon }); }}
          className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks (one per line)</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={10}
              placeholder={"Reply to supplier email\nPrep agenda for Wed meeting\nFile last month's invoices\nFollow up overdue payment\nUpdate staff roster"}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Plan horizon</Label>
            <div className="inline-flex rounded-xl border border-border p-1 bg-background">
              {(["daily", "weekly"] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={cn(
                    "px-4 py-1.5 text-sm rounded-lg transition-all capitalize",
                    horizon === h ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !tasks.trim()} className="gap-2 gradient-brand text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Planning…" : "Build my plan"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setTasks(""); clear(); }} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Clear
            </Button>
          </div>
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
        </form>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium capitalize">{horizon} plan</div>
            {output && <CopyButton text={output} />}
          </div>
          {loading && !output && (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 rounded-xl bg-muted" />)}
            </div>
          )}
          {!loading && !output && (
            <div className="flex-1 grid place-items-center text-center text-sm text-muted-foreground py-10">
              Your prioritised, time-blocked plan will appear here.
            </div>
          )}
          {output && <Markdown>{output}</Markdown>}
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
