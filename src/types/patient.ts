export type Patient = {
  id: string;
  abhaId?: string;
  name: string;
  age: number;
  languagePreference: string;
  consent: ConsentRecord[];
};

export type ConsentRecord = {
  type: "voice" | "documents" | "hisShare";
  granted: boolean;
  timestamp: string;
};