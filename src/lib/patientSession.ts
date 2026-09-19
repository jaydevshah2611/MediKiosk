import type { PatientUser } from "@/types/auth";

const REGISTRY_KEY = "patientsByPhone";

function readRegistry(): Record<string, PatientUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PatientUser>) : {};
  } catch {
    return {};
  }
}

export function listRegisteredPatients(): PatientUser[] {
  return Object.values(readRegistry()).sort((a, b) =>
    (b.lastLogin || "").localeCompare(a.lastLogin || "")
  );
}

export function savePatientSession(partial: Partial<PatientUser> & { phone: string }): PatientUser {
  const registry = readRegistry();
  const existing = registry[partial.phone];
  const preferredLanguage =
    partial.preferredLanguage ||
    existing?.preferredLanguage ||
    localStorage.getItem("patient_preferred_language") ||
    "en";

  const user: PatientUser = {
    id: existing?.id || `P-${partial.phone}`,
    role: "patient",
    preferredLanguage,
    phone: partial.phone,
    name: partial.name || existing?.name || "Patient",
    dateOfBirth: partial.dateOfBirth || existing?.dateOfBirth || "1990-01-01",
    gender: partial.gender || existing?.gender || "prefer_not_to_say",
    abhaId: partial.abhaId || existing?.abhaId,
    createdAt: existing?.createdAt || new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    emergencyContact: partial.emergencyContact || existing?.emergencyContact,
  };

  registry[partial.phone] = user;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("authToken", `demo-patient-token-${Date.now()}`);
  localStorage.setItem("userRole", "patient");
  localStorage.setItem("userPhone", partial.phone);
  localStorage.setItem("patient_preferred_language", preferredLanguage);
  void import("./liveClient")
    .then((m) => m.upsertLive({ patients: [{ id: user.id, name: user.name, phone: user.phone }] }))
    .catch(() => {});
  return user;
}
