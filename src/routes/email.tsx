import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Markdown } from "@/components/Markdown";
import { CopyButton } from "@/components/CopyButton";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — SmartOffice AI" },
      { name: "description", content: "Draft professional workplace emails with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Formal");
  const [audience, setAudience] = useState("Client");
  const { run, loading, error, output, setOutput, clear } = useGenerate("email");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    run({ purpose: purpose.trim(), tone, audience });
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you want to say — get a polished email you can edit and send."
      />

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">What's the email about?</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Confirm Friday 10am meeting with the client about the new pricing proposal, and ask them to send the signed contract."
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Team member">Team member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !purpose.trim()} className="gap-2 gradient-brand text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating…" : "Generate email"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setPurpose(""); clear(); }} className="gap-2">
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
            <div className="text-sm font-medium">Email draft</div>
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
            <div className="flex-1 grid place-items-center text-center text-sm text-muted-foreground py-10">
              Your generated email will appear here. You can edit it before copying.
            </div>
          )}

          {output && (
            <>
              <Markdown>{output}</Markdown>
              <Label className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Edit before sending</Label>
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={10}
                className="mt-2 font-mono text-xs"
              />
            </>
          )}
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
