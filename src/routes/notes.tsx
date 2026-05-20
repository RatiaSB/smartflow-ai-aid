import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Markdown } from "@/components/Markdown";
import { CopyButton } from "@/components/CopyButton";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — SmartOffice AI" },
      { name: "description", content: "Turn meeting notes into clear summaries and action items." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const { run, loading, error, output, clear } = useGenerate("notes");

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto space-y-6">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw notes — get a clean summary with decisions, action items and deadlines."
      />

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <form
          onSubmit={(e) => { e.preventDefault(); if (notes.trim()) run({ notes: notes.trim() }); }}
          className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="notes">Paste your meeting notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={14}
              placeholder="Paste anything — bullet points, transcript, scribbles. The AI will tidy it up."
              className="resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !notes.trim()} className="gap-2 gradient-brand text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Summarizing…" : "Summarize notes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setNotes(""); clear(); }} className="gap-2">
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
            <div className="text-sm font-medium">Summary</div>
            {output && <CopyButton text={output} />}
          </div>
          {loading && !output && <SkeletonBlocks />}
          {!loading && !output && (
            <div className="flex-1 grid place-items-center text-center text-sm text-muted-foreground py-10">
              Your structured summary will appear here.
            </div>
          )}
          {output && <Markdown>{output}</Markdown>}
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}

function SkeletonBlocks() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-1/4 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
