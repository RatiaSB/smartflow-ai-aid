import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

type Body = {
  kind?: "email" | "notes" | "planner" | "research";
  input?: Record<string, unknown>;
};

const PROMPTS: Record<NonNullable<Body["kind"]>, (input: any) => { system: string; prompt: string }> = {
  email: ({ purpose, tone, audience }) => ({
    system:
      "You write professional, concise workplace emails for non-technical staff. Always produce a clear Subject line then the body. Use the requested tone and tailor to the audience. Output Markdown.",
    prompt: `Write a workplace email.\n\nPurpose / key points:\n${purpose}\n\nTone: ${tone}\nAudience: ${audience}\n\nFormat:\n**Subject:** ...\n\nBody...\n\nKeep it polite, clear, and ready to send. Sign off with "Kind regards,".`,
  }),
  notes: ({ notes }) => ({
    system:
      "You summarize messy workplace meeting notes for non-technical staff. Be accurate and concise.",
    prompt: `Summarize these meeting notes. Return Markdown with EXACTLY these sections:\n\n## Summary\nA short paragraph.\n\n## Key Decisions\n- bullets\n\n## Action Items\n- [Owner] Action — Deadline\n\n## Deadlines\n- date — what is due\n\nNotes:\n${notes}`,
  }),
  planner: ({ tasks, horizon }) => ({
    system:
      "You are a productivity coach who builds realistic schedules for busy office staff.",
    prompt: `Build a ${horizon} task plan from these items. Prioritise by urgency + importance (Eisenhower-style).\n\nTasks:\n${tasks}\n\nReturn Markdown:\n\n## Priorities\n- 🔴 Do first (urgent + important)\n- 🟡 Schedule (important, not urgent)\n- 🔵 Delegate (urgent, not important)\n- ⚪ Drop / later\n\n## ${horizon === "weekly" ? "Weekly Plan" : "Today's Plan"}\nA realistic time-blocked list with suggested times.\n\n## Productivity Tips\nTwo or three specific tips for this workload.`,
  }),
  research: ({ topic }) => ({
    system:
      "You explain workplace topics simply for non-technical staff. Stay neutral and practical.",
    prompt: `Research and explain: "${topic}".\n\nReturn Markdown:\n\n## Overview\nPlain-language summary (max 5 sentences).\n\n## Key Insights\n- 4 to 6 bullets\n\n## Recommendations\n- 3 practical next steps for a small office\n\n## Things to Verify\n- 2 points the user should double-check before relying on this.`,
  }),
};

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as Body;
        const kind = body.kind;
        if (!kind || !PROMPTS[kind]) {
          return new Response("Invalid kind", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { system, prompt } = PROMPTS[kind](body.input ?? {});
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway(DEFAULT_MODEL);

        try {
          const { text } = await generateText({ model, system, prompt });
          return Response.json({ text });
        } catch (err) {
          console.error(err);
          return new Response("AI request failed", { status: 500 });
        }
      },
    },
  },
});
