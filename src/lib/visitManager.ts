import { SymptomResponse, BodySystem } from "@/types/symptoms";
import { AyushAssessment } from "@/types/ayush";

export type VisitStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface PatientVisitRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: "allopathic" | "ayush";
  bodySystem?: BodySystem;
  symptoms: Array<{
    id: string;
    name: string;
    severity?: number;
    notes?: string;
  }>;
  ayushAssessment?: AyushAssessment;
  priorityFlags: Array<{
    symptom: string;
    severity: string;
    message: string;
  }>;
  status: VisitStatus;
  department: string;
  tokenId?: string;
  tokenNumber?: string;
  assignedDoctor?: string;
  hospitalName?: string;
  diagnosisNotes?: string;
  prescriptions?: string[];
  vitalSigns?: {
    bp?: string;
    pulse?: number;
    spo2?: number;
    temperature?: string;
  };
}

export class VisitManager {
  private storageKey = "patientVisits";

  getVisits(patientId?: string): PatientVisitRecord[] {
    if (typeof window === "undefined") return this.getSeedVisits();

    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      const seed = this.getSeedVisits();
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
      return patientId ? seed.filter(v => v.patientId === patientId) : seed;
    }

    try {
      const visits: PatientVisitRecord[] = JSON.parse(data);
      if (patientId) {
        return visits.filter(v => v.patientId === patientId).sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
      return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch {
      return [];
    }
  }

  getVisitById(visitId: string): PatientVisitRecord | null {
    const visits = this.getVisits();
    return visits.find(v => v.id === visitId) || null;
  }

  saveVisit(visit: PatientVisitRecord): PatientVisitRecord {
    if (typeof window === "undefined") return visit;

    const visits = this.getVisits();
    const existingIndex = visits.findIndex(v => v.id === visit.id);

    if (existingIndex >= 0) {
      visits[existingIndex] = visit;
    } else {
      visits.unshift(visit);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(visits));
    return visit;
  }

  deleteVisit(visitId: string): boolean {
    if (typeof window === "undefined") return false;

    const visits = this.getVisits();
    const filtered = visits.filter(v => v.id !== visitId);
    if (filtered.length < visits.length) {
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  createVisitFromIntake(params: {
    patientId: string;
    patientName: string;
    type: "allopathic" | "ayush";
    bodySystem?: BodySystem;
    symptomResponses?: SymptomResponse[];
    ayushAssessment?: AyushAssessment;
    priorityFlags?: Array<{ symptom: string; severity: string; message: string }>;
    department?: string;
    tokenId?: string;
    tokenNumber?: string;
    hospitalName?: string;
  }): PatientVisitRecord {
    const symptoms = params.symptomResponses?.map(sr => ({
      id: sr.symptomId,
      name: sr.symptomName,
      severity: sr.severity,
      notes: Object.entries(sr.responses).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(", ")
    })) || (params.ayushAssessment ? [{
      id: params.ayushAssessment.system,
      name: `${params.ayushAssessment.system.toUpperCase()} Wellness Evaluation`,
      notes: `Prakriti/Constitution: ${params.ayushAssessment.dashavidhaPariksha?.prakriti || 'Balanced'}`
    }] : []);

    const newVisit: PatientVisitRecord = {
      id: `visit-${Date.now()}`,
      patientId: params.patientId,
      patientName: params.patientName,
      date: new Date().toISOString(),
      type: params.type,
      bodySystem: params.bodySystem,
      symptoms,
      ayushAssessment: params.ayushAssessment,
      priorityFlags: params.priorityFlags || [],
      status: "in_progress",
      department: params.department || (params.type === "ayush" ? "Ayurveda & AYUSH" : "General Medicine"),
      tokenId: params.tokenId,
      tokenNumber: params.tokenNumber,
      hospitalName: params.hospitalName || "AIIMS Community Health & Kiosk Center",
      assignedDoctor: params.type === "ayush" ? "Dr. Acharya Sharma (BAMS)" : "Dr. Rajesh Verma (MD)",
      vitalSigns: {
        bp: "120/80 mmHg",
        pulse: 74,
        spo2: 98,
        temperature: "98.6 °F"
      }
    };

    return this.saveVisit(newVisit);
  }

  private getSeedVisits(): PatientVisitRecord[] {
    return [
      {
        id: "visit-101",
        patientId: "patient-1",
        patientName: "Aarav Sharma",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: "allopathic",
        bodySystem: "respiratory",
        symptoms: [
          { id: "cough", name: "Persistent Dry Cough", severity: 6, notes: "Duration: 4 days, worse at night" },
          { id: "fever", name: "Mild Fever", severity: 5, notes: "Temperature: 100.2 F" }
        ],
        priorityFlags: [],
        status: "completed",
        department: "General Medicine",
        tokenNumber: "G-014",
        hospitalName: "Civil Hospital & B.J. Medical College Ahmedabad",
        assignedDoctor: "Dr. Rajesh Mehta (MD)",
        diagnosisNotes: "Acute viral bronchitis with mild bronchospasm. Advised steam inhalation, hydration, and rest.",
        prescriptions: ["Tab Paracetamol 650mg SOS", "Cough Syrup Dextromethorphan 10ml TID x 5 days"],
        vitalSigns: { bp: "118/78 mmHg", pulse: 76, spo2: 99, temperature: "99.8 °F" }
      },
      {
        id: "visit-102",
        patientId: "patient-1",
        patientName: "Priya Patel",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        type: "ayush",
        symptoms: [
          { id: "ayurveda", name: "Pitta-Vata Imbalance & Fatigue", notes: "Agni: Vishamagni, Koshtha: Krura" }
        ],
        priorityFlags: [],
        status: "completed",
        department: "Ayurveda & AYUSH",
        tokenNumber: "A-003",
        hospitalName: "ITRA Jamnagar (National AYUSH Institute)",
        assignedDoctor: "Dr. Vikramaditya Sharma (BAMS, MD-Ayu)",
        diagnosisNotes: "Pitta aggravation with digestive irregularity. Recommended Dinacharya alignment and cooling herbs.",
        prescriptions: ["Triphala Churna 1 tsp bedtime with warm water", "Ashwagandha 500mg OD with milk"],
        vitalSigns: { bp: "122/80 mmHg", pulse: 72, spo2: 98, temperature: "98.4 °F" }
      }
    ];
  }
}

export const visitManager = new VisitManager();
