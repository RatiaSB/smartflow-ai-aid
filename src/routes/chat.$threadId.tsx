import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef } from "react";
import { threadStore } from "@/lib/thread-store";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { MessagesSquare } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThreadPage,
});

const SUGGESTIONS = [
  "Help me reply to a late-paying client",
  "Draft a polite reminder for the team meeting",
  "Summarise what HR onboarding should cover",
  "Plan my Monday around 6 admin tasks",
];

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();

  // Ensure thread exists (e.g. if user hits the URL fresh, or after refresh).
  useEffect(() => {
    if (!threadStore.get(threadId)) {
      const t = threadStore.create();
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
    }
  }, [threadId, navigate]);

  const initialMessages = useMemo<UIMessage[]>(
    () => threadStore.get(threadId)?.messages ?? [],
    [threadId],
  );

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
  });

  // Persist to in-memory thread store + auto title.
  useEffect(() => {
    if (!threadStore.get(threadId)) return;
    const firstUser = messages.find((m) => m.role === "user");
    let title = "New conversation";
    if (firstUser) {
      const t = firstUser.parts
        .map((p) => (p.type === "text" ? p.text : ""))
        .join(" ")
        .trim();
      if (t) title = t.length > 40 ? t.slice(0, 40) + "…" : t;
    }
    threadStore.upsert(threadId, { messages, title });
  }, [messages, threadId]);

  // Keep textarea focused.
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    taRef.current?.focus();
  }, [threadId, status]);

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-full">
      <Conversation className="flex-1">
        <ConversationContent className="max-w-3xl mx-auto w-full px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
              <img src={logo} alt="" className="h-14 w-14" />
              <div>
                <h3 className="text-xl font-semibold tracking-tight">How can I help you today?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask anything about workplace tasks — drafting emails, planning your day, summarising info.
                </p>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="text-left text-sm rounded-xl border border-border bg-card px-3 py-2.5 hover:bg-muted hover:border-primary/40 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role === "user" ? "user" : "assistant"}>
                <MessageContent
                  className={
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent p-0 text-foreground"
                  }
                >
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      return m.role === "assistant" ? (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      ) : (
                        <p key={i} className="whitespace-pre-wrap">{part.text}</p>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent className="bg-transparent p-0">
                <Shimmer>Thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <div className="mx-auto max-w-md rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Something went wrong. Please try again.
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background/80 backdrop-blur">
        <div className="max-w-3xl mx-auto w-full p-3 md:p-4">
          <PromptInput
            onSubmit={(msg) => {
              const text = msg.text?.trim();
              if (!text) return;
              sendMessage({ text });
            }}
          >
            <PromptInputTextarea
              ref={taRef}
              placeholder="Message SmartOffice AI…"
            />
            <PromptInputFooter className="justify-between">
              <p className="text-[11px] text-muted-foreground">
                <MessagesSquare className="inline h-3 w-3 mr-1 -mt-0.5" />
                AI may make mistakes — always review.
              </p>
              <PromptInputSubmit status={status} disabled={isLoading} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
