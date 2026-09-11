export type BodySystem = 
  | "general"
  | "head_neurological"
  | "eyes"
  | "ent"
  | "respiratory"
  | "cardiovascular"
  | "gastrointestinal"
  | "musculoskeletal"
  | "skin"
  | "urinary"
  | "reproductive"
  | "mental_behavioral"
  | "endocrine_metabolic"
  | "dental_oral"
  | "other";

export type Symptom = {
  id: string;
  name: string;
  translations: Record<string, string>;
  bodySystem: BodySystem;
  bodyLocation?: string;
  relatedSymptoms: string[];
  followUpQuestions: FollowUpQuestion[];
  priorityRules?: PriorityRule[];
};

export type FollowUpQuestion = {
  id: string;
  question: string;
  translations: Record<string, string>;
  type: "duration" | "severity" | "location" | "character" | "frequency" | "associated" | "triggers" | "custom";
  options?: QuestionOption[];
  required: boolean;
};

export type QuestionOption = {
  value: string;
  label: string;
  translations: Record<string, string>;
};

export type PriorityRule = {
  condition: string;
  severity: "low" | "medium" | "high" | "urgent";
  message: string;
  translations: Record<string, string>;
};

export type SymptomResponse = {
  symptomId: string;
  symptomName: string;
  responses: Record<string, string | number>;
  severity?: number;
  timestamp: string;
};

export type BodySystemCategory = {
  id: BodySystem;
  name: string;
  translations: Record<string, string>;
  icon: string;
  symptoms: Symptom[];
};