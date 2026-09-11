export type HistoryRecord = {
  patientId: string;
  sessionId: string;
  chiefComplaint: string;
  hpi: string;
  pastHistory: string;
  drugAllergyHistory: string;
  familyHistory: string;
  personalHistory: string;
  reviewOfSystems: string;
  ayushParameters?: AyushAssessment;
  redFlags: RedFlag[];
};

export type AyushAssessment = {
  prakriti: string;
  vikriti: string;
  agni: string;
  koshtha: string;
  aharaVihara: string;
};

export type RedFlag = {
  symptom: string;
  triggeredAt: string;
  acknowledgedBy?: string;
};