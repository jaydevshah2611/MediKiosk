import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Token } from "@/types/token";
import type { PatientVisitRecord } from "@/lib/visitManager";
import type { LivePatient, LiveStore } from "@/lib/liveTypes";

type GlobalLive = typeof globalThis & {
  __MEDIKIOSK_LIVE__?: LiveStore;
};

const FILE = join("/tmp", "medikiosk-live.json");

function emptyStore(): LiveStore {
  return { tokens: [], visits: [], patients: [], updatedAt: new Date().toISOString() };
}

function readFileStore(): LiveStore | null {
  try {
    const raw = readFileSync(FILE, "utf8");
    return JSON.parse(raw) as LiveStore;
  } catch {
    return null;
  }
}

function writeFileStore(store: LiveStore) {
  try {
    mkdirSync(join("/tmp"), { recursive: true });
    writeFileSync(FILE, JSON.stringify(store));
  } catch {
    // Vercel instances may not always allow writes; memory still works.
  }
}

export function getLiveStore(): LiveStore {
  const g = globalThis as GlobalLive;
  if (!g.__MEDIKIOSK_LIVE__) {
    g.__MEDIKIOSK_LIVE__ = readFileStore() || emptyStore();
  }
  return g.__MEDIKIOSK_LIVE__;
}

function upsertById<T extends { id: string }>(list: T[], incoming: T[]): T[] {
  const map = new Map(list.map((item) => [item.id, item]));
  for (const item of incoming) {
    const prev = map.get(item.id);
    map.set(item.id, prev ? { ...prev, ...item } : item);
  }
  return [...map.values()];
}

export function mergeLiveStore(partial: {
  tokens?: Token[];
  visits?: PatientVisitRecord[];
  patients?: LivePatient[];
}): LiveStore {
  const store = getLiveStore();
  if (partial.tokens?.length) store.tokens = upsertById(store.tokens, partial.tokens);
  if (partial.visits?.length) store.visits = upsertById(store.visits, partial.visits);
  if (partial.patients?.length) store.patients = upsertById(store.patients, partial.patients);
  store.updatedAt = new Date().toISOString();
  writeFileStore(store);
  return store;
}

export function patchLiveToken(tokenId: string, patch: Partial<Token>): LiveStore {
  const store = getLiveStore();
  store.tokens = store.tokens.map((t) => (t.id === tokenId ? { ...t, ...patch } : t));
  if (patch.status && store.visits.length) {
    store.visits = store.visits.map((v) =>
      v.tokenId === tokenId
        ? {
            ...v,
            status:
              patch.status === "completed"
                ? "completed"
                : patch.status === "in_consultation"
                  ? "in_progress"
                  : v.status,
          }
        : v
    );
  }
  store.updatedAt = new Date().toISOString();
  writeFileStore(store);
  return store;
}
