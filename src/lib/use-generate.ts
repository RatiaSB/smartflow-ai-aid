import { useState } from "react";

type Kind = "email" | "notes" | "planner" | "research";

export function useGenerate(kind: Kind) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState("");

  async function run(input: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, input }),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit hit — please try again in a moment.");
        if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
        throw new Error("AI request failed. Please try again.");
      }
      const data = (await res.json()) as { text: string };
      setOutput(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, output, setOutput, run, clear: () => { setOutput(""); setError(null); } };
}
