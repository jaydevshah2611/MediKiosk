import { 
  ConsentPermission, 
  DataSharingRequest, 
  PatientConsentRecord,
  ConsentAuditLog,
  ConsentType 
} from "@/types/consent";

export const consentTypes: { type: ConsentType; label: string; description: string }[] = [
  {
    type: "medical_history",
    label: "Medical History",
    description: "Past diagnoses, surgeries, hospitalizations"
  },
  {
    type: "current_medications",
    label: "Current Medications",
    description: "Medications you are currently taking"
  },
  {
    type: "allergies",
    label: "Allergies",
    description: "Drug allergies and other allergic reactions"
  },
  {
    type: "previous_reports",
    label: "Previous Reports",
    description: "Lab reports, imaging, diagnostic results"
  },
  {
    type: "previous_visits",
    label: "Previous Visits",
    description: "Past consultation records and notes"
  },
  {
    type: "demographics",
    label: "Demographics",
    description: "Age, gender, contact information"
  },
  {
    type: "insurance_info",
    label: "Insurance Information",
    description: "Insurance details and coverage"
  },
];

export class ConsentManager {
  private storageKey = "patientConsent";

  getPatientConsent(patientId: string): PatientConsentRecord | null {
    if (typeof window === "undefined") return null;
    
    const data = localStorage.getItem(this.storageKey);
    if (!data) return null;
    
    const allRecords = JSON.parse(data);
    return allRecords[patientId] || null;
  }

  savePatientConsent(patientId: string, record: PatientConsentRecord): void {
    if (typeof window === "undefined") return;
    
    const data = localStorage.getItem(this.storageKey) || "{}";
    const allRecords = JSON.parse(data);
    allRecords[patientId] = record;
    localStorage.setItem(this.storageKey, JSON.stringify(allRecords));
  }

  createDataSharingRequest(
    patientId: string,
    requestingEntity: { id: string; name: string; type: "doctor" | "hospital" },
    requestedPermissions: ConsentType[],
    purpose: string,
    visitId?: string
  ): DataSharingRequest {
    const request: DataSharingRequest = {
      id: `request-${Date.now()}`,
      requestingEntity,
      requestedPermissions,
      purpose,
      visitId,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    const consentRecord = this.getPatientConsent(patientId);
    if (!consentRecord) {
      // Create new consent record
      const newRecord: PatientConsentRecord = {
        patientId,
        globalPermissions: [],
        sharingRequests: [request],
        activeGrants: [],
      };
      this.savePatientConsent(patientId, newRecord);
    } else {
      consentRecord.sharingRequests.push(request);
      this.savePatientConsent(patientId, consentRecord);
    }

    return request;
  }

  respondToSharingRequest(
    patientId: string,
    requestId: string,
    approved: boolean,
    selectedPermissions?: ConsentType[]
  ): void {
    const consentRecord = this.getPatientConsent(patientId);
    if (!consentRecord) return;

    const requestIndex = consentRecord.sharingRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return;

    const request = consentRecord.sharingRequests[requestIndex];
    request.status = approved ? "approved" : "rejected";
    request.responseAt = new Date().toISOString();

    if (approved && selectedPermissions) {
      // Create active grants
      selectedPermissions.forEach(permissionType => {
        const grant: ConsentPermission = {
          type: permissionType,
          granted: true,
          grantedAt: new Date().toISOString(),
          grantedTo: request.requestingEntity.id,
          visitId: request.visitId,
        };
        consentRecord.activeGrants.push(grant);
      });

      // Add to audit log
      this.logConsentAction(patientId, "granted", request.requestingEntity.type, request.requestingEntity.id, request.requestingEntity.name, selectedPermissions);
    } else {
      this.logConsentAction(patientId, "revoked", request.requestingEntity.type, request.requestingEntity.id, request.requestingEntity.name, request.requestedPermissions);
    }

    this.savePatientConsent(patientId, consentRecord);
  }

  revokePermission(patientId: string, grantId: string): void {
    const consentRecord = this.getPatientConsent(patientId);
    if (!consentRecord) return;

    const grantIndex = consentRecord.activeGrants.findIndex(g => 
      `${g.type}-${g.grantedTo}-${g.visitId}` === grantId
    );
    
    if (grantIndex === -1) return;

    const grant = consentRecord.activeGrants[grantIndex];
    consentRecord.activeGrants.splice(grantIndex, 1);

    // Log the revocation
    this.logConsentAction(patientId, "revoked", "doctor", grant.grantedTo || "", "Entity", [grant.type]);

    this.savePatientConsent(patientId, consentRecord);
  }

  checkPermission(
    patientId: string,
    entityId: string,
    consentType: ConsentType
  ): boolean {
    const consentRecord = this.getPatientConsent(patientId);
    if (!consentRecord) return false;

    return consentRecord.activeGrants.some(grant =>
      grant.type === consentType &&
      grant.grantedTo === entityId &&
      grant.granted &&
      (!grant.expiresAt || new Date(grant.expiresAt) > new Date())
    );
  }

  getActiveGrantsForEntity(patientId: string, entityId: string): ConsentPermission[] {
    const consentRecord = this.getPatientConsent(patientId);
    if (!consentRecord) return [];

    return consentRecord.activeGrants.filter(grant =>
      grant.grantedTo === entityId &&
      grant.granted &&
      (!grant.expiresAt || new Date(grant.expiresAt) > new Date())
    );
  }

  private logConsentAction(
    patientId: string,
    action: "granted" | "revoked" | "accessed" | "requested",
    entityType: "doctor" | "hospital",
    entityId: string,
    entityName: string,
    consentTypes: ConsentType[]
  ): void {
    const log: ConsentAuditLog = {
      id: `log-${Date.now()}`,
      patientId,
      action,
      entityType,
      entityId,
      entityName,
      consentTypes,
      timestamp: new Date().toISOString(),
    };

    // In a real implementation, this would be sent to a backend audit log
    console.log("Consent Audit Log:", log);
  }

  getAuditLog(patientId: string): ConsentAuditLog[] {
    // In a real implementation, this would fetch from backend
    return [];
  }
}

export const consentManager = new ConsentManager();