import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

type ChatBody = { messages?: unknown };

const SYSTEM_PROMPT = `You are SmartOffice AI, a helpful workplace assistant for non-technical staff like receptionists, HR assistants, office admins, retail supervisors, school admin staff and municipal workers in South Africa.

Be warm, concise, and professional. Use clear English, avoid jargon. Format with short paragraphs, bullet lists, and bold where helpful (Markdown). For tasks like emails, summaries or schedules, structure your output clearly so users can copy it directly.

Always encourage the user to review AI output before sending or making important decisions.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as ChatBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway(DEFAULT_MODEL);

        try {
          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });
          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (err) {
          console.error(err);
          return new Response("AI request failed", { status: 500 });
        }
      },
    },
  },
});
