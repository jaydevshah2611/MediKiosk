import type { Token } from "@/types/token";
import type { PatientVisitRecord } from "@/lib/visitManager";

export type LivePatient = {
  id: string;
  name: string;
  phone: string;
};

export type LiveStore = {
  tokens: Token[];
  visits: PatientVisitRecord[];
  patients: LivePatient[];
  updatedAt: string;
};
