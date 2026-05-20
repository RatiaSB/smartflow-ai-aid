import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Markdown } from "@/components/Markdown";
import { CopyButton } from "@/components/CopyButton";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — SmartOffice AI" },
      { name: "description", content: "Summarize workplace topics in simple language." },
    ],
  }),
  component: ResearchPage,
});

const SUGGESTIONS = [
  "POPIA basics for a small office",
  "How to onboard a new receptionist",
  "Tips for handling difficult customers",
  "Setting up a simple petty cash system",
];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const { run, loading, error, output, clear } = useGenerate("research");

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto space-y-6">
      <PageHeader
        icon={Sparkles}
        title="AI Research Assistant"
        description="Get a clear overview, insights and recommendations on any workplace topic."
      />

      <form
        onSubmit={(e) => { e.preventDefault(); if (topic.trim()) run({ topic: topic.trim() }); }}
        className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="topic">Topic, article or question</Label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. What is POPIA and how does it affect a small HR team?"
              className="pl-9 h-11"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setTopic(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !topic.trim()} className="gap-2 gradient-brand text-primary-foreground">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Researching…" : "Research topic"}
          </Button>
          <Button type="button" variant="outline" onClick={() => { setTopic(""); clear(); }} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Clear
          </Button>
        </div>
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </form>

      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">Briefing</div>
          {output && <CopyButton text={output} />}
        </div>
        {loading && !output && (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 w-1/3 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-5/6 rounded bg-muted" />
            <div className="h-3 w-4/6 rounded bg-muted" />
          </div>
        )}
        {!loading && !output && (
          <div className="grid place-items-center text-center text-sm text-muted-foreground py-10">
            Your research briefing will appear here.
          </div>
        )}
        {output && <Markdown>{output}</Markdown>}
      </div>

      <AiDisclaimer />
    </div>
  );
}
