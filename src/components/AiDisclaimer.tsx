import { AlertTriangle } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-foreground/80 " +
        className
      }
    >
      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-warning" />
      <p>
        <span className="font-medium">AI disclaimer.</span> AI-generated responses may contain
        inaccuracies. Please review carefully before sending emails or making workplace decisions.
      </p>
    </div>
  );
}
