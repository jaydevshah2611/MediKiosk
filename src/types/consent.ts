export type ConsentType = 
  | "medical_history"
  | "current_medications"
  | "allergies"
  | "previous_reports"
  | "previous_visits"
  | "demographics"
  | "insurance_info";

export type ConsentPermission = {
  type: ConsentType;
  granted: boolean;
  grantedAt?: string;
  expiresAt?: string;
  grantedTo?: string; // doctor or hospital ID
  visitId?: string; // specific visit ID
};

export type DataSharingRequest = {
  id: string;
  requestingEntity: {
    id: string;
    name: string;
    type: "doctor" | "hospital";
  };
  requestedPermissions: ConsentType[];
  purpose: string;
  visitId?: string;
  createdAt: string;
  expiresAt?: string;
  status: "pending" | "approved" | "rejected" | "expired";
  responseAt?: string;
};

export type PatientConsentRecord = {
  patientId: string;
  globalPermissions: ConsentPermission[];
  sharingRequests: DataSharingRequest[];
  activeGrants: ConsentPermission[];
};

export type ConsentAuditLog = {
  id: string;
  patientId: string;
  action: "granted" | "revoked" | "accessed" | "requested";
  entityType: "doctor" | "hospital";
  entityId: string;
  entityName: string;
  consentTypes: ConsentType[];
  timestamp: string;
  ipAddress?: string;
};