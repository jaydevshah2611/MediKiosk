export type TokenStatus = "waiting" | "in_consultation" | "completed" | "skipped" | "priority";

export type Department = 
  | "general_medicine"
  | "orthopedics"
  | "ayurveda"
  | "ophthalmology"
  | "ent"
  | "neurology"
  | "dermatology"
  | "dental"
  | "cardiology"
  | "pediatrics"
  | "gynecology"
  | "other";

export type Token = {
  id: string;
  tokenNumber: string; // e.g., "A-104"
  patientId: string;
  patientName: string;
  department: Department;
  doctorId?: string;
  doctorName?: string;
  status: TokenStatus;
  priority: boolean;
  issuedAt: string;
  estimatedWaitTime?: number; // in minutes
  actualWaitTime?: number; // in minutes
  consultationStartTime?: string;
  consultationEndTime?: string;
  notes?: string;
  symptoms?: string[];
  severityScore?: number;
  hospitalName?: string;
  phone?: string;
  sharedInformation?: {
    medicalHistory: boolean;
    medications: boolean;
    allergies: boolean;
    reports: boolean;
    previousVisits: boolean;
  };
};

export type TokenQueue = {
  department: Department;
  tokens: Token[];
  currentToken?: string;
  averageWaitTime: number;
  doctorsAvailable: number;
};

export type TokenStatistics = {
  totalIssued: number;
  totalCompleted: number;
  averageWaitTime: number;
  averageConsultationTime: number;
  priorityCases: number;
  skippedCases: number;
  byDepartment: Record<Department, {
    issued: number;
    completed: number;
    averageWaitTime: number;
  }>;
};