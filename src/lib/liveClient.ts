import type { Token } from "@/types/token";
import type { PatientVisitRecord } from "@/lib/visitManager";
import type { LivePatient, LiveStore } from "@/lib/liveTypes";
import { tokenManager } from "@/lib/tokenManager";
import { visitManager } from "@/lib/visitManager";

function isLiveToken(token: Token) {
  return token.id.startsWith("token-") && !token.id.includes("seed");
}

function isLiveVisit(visit: PatientVisitRecord) {
  return visit.id.startsWith("visit-") && visit.id !== "visit-101" && visit.id !== "visit-102";
}

export async function fetchLiveStore(): Promise<LiveStore | null> {
  try {
    const res = await fetch("/api/live", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as LiveStore;
  } catch {
    return null;
  }
}

export async function upsertLive(partial: {
  tokens?: Token[];
  visits?: PatientVisitRecord[];
  patients?: LivePatient[];
}): Promise<LiveStore | null> {
  try {
    const res = await fetch("/api/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    if (!res.ok) return null;
    return (await res.json()) as LiveStore;
  } catch {
    return null;
  }
}

export async function patchLiveTokenStatus(tokenId: string, status: Token["status"]) {
  try {
    await fetch("/api/live", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId, status, patch: { status } }),
    });
  } catch {
    // ignore network errors; local queue still updates
  }
}

export async function publishLocalLiveState() {
  if (typeof window === "undefined") return;
  const tokens = tokenManager.getAllTokens().filter(isLiveToken);
  const visits = visitManager.getVisits().filter(isLiveVisit);
  let patients: LivePatient[] = [];
  try {
    const registry = JSON.parse(localStorage.getItem("patientsByPhone") || "{}");
    patients = Object.values(registry).map((p: any) => ({
      id: p.id,
      name: p.name,
      phone: p.phone,
    }));
  } catch {
    patients = [];
  }
  if (!tokens.length && !visits.length && !patients.length) return;
  await upsertLive({ tokens, visits, patients });
}

export function applyLiveStore(store: LiveStore) {
  if (!store) return;
  if (store.tokens?.length) tokenManager.upsertTokens(store.tokens);
  if (store.visits?.length) visitManager.upsertVisits(store.visits);
}

export async function syncLiveFromServer() {
  const remote = await fetchLiveStore();
  if (remote) applyLiveStore(remote);
  await publishLocalLiveState();
  return remote;
}

export function maxVisitSeverity(visit: PatientVisitRecord): number {
  const fromSymptoms = Math.max(0, ...visit.symptoms.map((s) => s.severity || 0));
  if (visit.priorityFlags?.length) return Math.max(fromSymptoms, 8);
  return fromSymptoms;
}

export function sortVisitsBySeverity(visits: PatientVisitRecord[]): PatientVisitRecord[] {
  return [...visits].sort((a, b) => {
    const sa = maxVisitSeverity(a);
    const sb = maxVisitSeverity(b);
    const pa = a.priorityFlags?.length ? 1 : 0;
    const pb = b.priorityFlags?.length ? 1 : 0;
    if (pb !== pa) return pb - pa;
    if (sb !== sa) return sb - sa;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

export function sortTokensBySeverity(tokens: Token[]): Token[] {
  return [...tokens].sort((a, b) => {
    const pa = a.priority || a.status === "priority" ? 1 : 0;
    const pb = b.priority || b.status === "priority" ? 1 : 0;
    if (pb !== pa) return pb - pa;
    const sa = a.severityScore || 0;
    const sb = b.severityScore || 0;
    if (sb !== sa) return sb - sa;
    return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
  });
}
