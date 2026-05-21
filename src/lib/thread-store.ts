// Session-only thread store (no persistence — clears on refresh).
import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  createdAt: number;
  messages: UIMessage[];
};

type Listener = () => void;

const threads = new Map<string, Thread>();
const listeners = new Set<Listener>();

let cachedList: Thread[] = [];
const recomputeList = () => {
  cachedList = Array.from(threads.values()).sort((a, b) => b.createdAt - a.createdAt);
};

const emit = () => {
  recomputeList();
  listeners.forEach((l) => l());
};

export const threadStore = {
  list(): Thread[] {
    return cachedList;
  },
  get(id: string): Thread | undefined {
    return threads.get(id);
  },
  create(): Thread {
    const id = (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)) as string;
    const t: Thread = { id, title: "New conversation", createdAt: Date.now(), messages: [] };
    threads.set(id, t);
    emit();
    return t;
  },
  upsert(id: string, patch: Partial<Thread>) {
    const existing = threads.get(id);
    if (!existing) return;
    threads.set(id, { ...existing, ...patch });
    emit();
  },
  remove(id: string) {
    threads.delete(id);
    emit();
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
