export type UserRole = "patient" | "doctor" | "hospital";

export type User = {
  id: string;
  role: UserRole;
  preferredLanguage: string;
  email?: string;
  phone: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
};

export type PatientUser = User & {
  role: "patient";
  abhaId?: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
};

export type DoctorUser = User & {
  role: "doctor";
  medicalRegistrationNumber: string;
  specialization: string;
  qualification: string;
  hospitalId?: string;
  department: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedAt?: string;
};

export type HospitalUser = User & {
  role: "hospital";
  hospitalName: string;
  hospitalRegistrationNumber: string;
  address: string;
  departments: string[];
  adminRole: "admin" | "staff" | "receptionist";
};

export type AuthSession = {
  user: User;
  token: string;
  expiresAt: string;
};

export type LoginCredentials = {
  phone: string;
  otp: string;
  role: UserRole;
};

export type RegistrationData = {
  role: UserRole;
  language: string;
  // Patient specific
  patientData?: {
    name: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
    phone: string;
    abhaId?: string;
  };
  // Doctor specific
  doctorData?: {
    name: string;
    phone: string;
    email: string;
    medicalRegistrationNumber: string;
    specialization: string;
    qualification: string;
    hospital: string;
    department: string;
  };
  // Hospital specific
  hospitalData?: {
    name: string;
    phone: string;
    email: string;
    hospitalRegistrationNumber: string;
    address: string;
    adminRole: "admin" | "staff" | "receptionist";
  };
};