export type DocumentType =
  | "prescription"
  | "lab_report"
  | "imaging_report"
  | "discharge_summary"
  | "insurance"
  | "id_proof"
  | "other";

export type DocumentStatus = "uploading" | "processing" | "completed" | "failed";

export type BiomarkerEvaluation = {
  parameter: string;
  observedValue: string;
  referenceRange: string;
  status: "normal" | "low" | "high" | "critical" | "optimal";
  clinicalInterpretation: string;
  sentiment: "good" | "deficient" | "elevated" | "attention_needed";
};

export type DocumentHealthAnalysis = {
  overallHealthScore: number; // 0-100
  clinicalSummary: string;
  goodFindings: string[];       // Positive / Normal / Well-controlled findings
  deficientFindings: string[];  // Deficiencies (low Hb, low vitamins, low platelets, etc.)
  elevatedFindings: string[];   // High biomarkers (high sugar, high cholesterol, high creatinine, etc.)
  actionableDietAdvice: string[];
  followUpRecommendations: string[];
  biomarkerEvaluations?: BiomarkerEvaluation[];
};

export type ScannedDocument = {
  id: string;
  patientId: string;
  type: "prescription" | "labReport" | "dischargeSummary" | string;
  extractedText: string;
  extractedEntities: {
    diagnoses: string[];
    medications: Array<{ name: string; dosage: string }>;
    investigations: Array<{ name: string; value: string; range?: string; abnormal?: boolean }>;
    dates?: string[];
    doctors?: string[];
    hospitals?: string[];
  };
  analysis?: DocumentHealthAnalysis;
  timelinePosition: string;
  name?: string;
  size?: string;
  summary?: string;
  thumbnail?: string;
  url?: string;
};

export type UploadedDocument = {
  id: string;
  patientId: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  status: DocumentStatus;
  ocrText?: string;
  extractedEntities?: {
    diagnoses?: string[];
    medications?: Array<{ name: string; dosage: string }>;
    investigations?: Array<{ name: string; value: string; range?: string; abnormal?: boolean }>;
    dates?: string[];
    doctors?: string[];
    hospitals?: string[];
  };
  analysis?: DocumentHealthAnalysis;
  processingError?: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
};

export type DocumentProcessingResult = {
  success: boolean;
  text?: string;
  entities?: UploadedDocument["extractedEntities"];
  analysis?: DocumentHealthAnalysis;
  error?: string;
};
