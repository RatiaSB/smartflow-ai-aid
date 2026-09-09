// Thread store with localStorage persistence (history survives refresh).
import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  createdAt: number;
  messages: UIMessage[];
};

type Listener = () => void;

const STORAGE_KEY = "smartoffice.threads.v1";

const threads = new Map<string, Thread>();
const listeners = new Set<Listener>();

let cachedList: Thread[] = [];
const recomputeList = () => {
  cachedList = Array.from(threads.values()).sort((a, b) => b.createdAt - a.createdAt);
};

const persist = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedList));
  } catch {
    // ignore quota / privacy-mode errors
  }
};

let hydrated = false;
export const hydrateThreads = () => {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Thread[];
    if (!Array.isArray(parsed)) return;
    for (const t of parsed) {
      if (t && typeof t.id === "string") {
        threads.set(t.id, {
          id: t.id,
          title: typeof t.title === "string" ? t.title : "New conversation",
          createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
          messages: Array.isArray(t.messages) ? t.messages : [],
        });
      }
    }
    recomputeList();
    listeners.forEach((l) => l());
  } catch {
    // corrupt storage — start fresh
  }
};

const emit = () => {
  recomputeList();
  persist();
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
  clear() {
    threads.clear();
    emit();
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
