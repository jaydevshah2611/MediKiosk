import { Department } from "@/types/token";

export interface HospitalDoctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  department: Department;
  hospitalId: string;
  hospitalName: string;
  nmcRegistrationNumber: string;
  experience: string;
  qualification: string;
  opdRoom: string;
  status: "available" | "in_opd" | "on_break" | "off_duty";
  patientsSeenToday: number;
  rating: number;
  contact: string;
}

export interface HospitalDepartmentItem {
  id: Department;
  name: string;
  icon: string;
  headOfDepartment: string;
  opdRoomRange: string;
  activeDoctorsCount: number;
  waitingCount: number;
  inConsultationCount: number;
  completedTodayCount: number;
  status: "active" | "crowded" | "closed";
}

export class HospitalManager {
  private doctorsKey = "hospital_doctors_list";
  private departmentsKey = "hospital_departments_list";

  private defaultDoctors: HospitalDoctor[] = [
    {
      id: "DOC-CIVIL-001",
      name: "Dr. Rajesh Sharma",
      email: "dr.rajesh.sharma@gujarathealth.gov.in",
      specialization: "Senior Physician & Internal Medicine",
      department: "general_medicine",
      hospitalId: "hosp-civil-ahmedabad",
      hospitalName: "Civil Hospital & B.J. Medical College (Asarwa MediCity)",
      nmcRegistrationNumber: "G-48192-GUJ",
      experience: "16+ Years",
      qualification: "MBBS, MD (Medicine) - BJMC",
      opdRoom: "OPD Room 104, Block A",
      status: "in_opd",
      patientsSeenToday: 18,
      rating: 4.9,
      contact: "+91 98250 11223"
    },
    {
      id: "DOC-CIVIL-002",
      name: "Dr. Anandita Joshi",
      email: "dr.anandita.joshi@itra.gov.in",
      specialization: "Kayachikitsa & Panchakarma Specialist",
      department: "ayurveda",
      hospitalId: "hosp-itra-jamnagar",
      hospitalName: "Institute of Teaching and Research in Ayurveda (ITRA Jamnagar)",
      nmcRegistrationNumber: "AYUSH-GUJ-8819",
      experience: "12+ Years",
      qualification: "BAMS, MD (Ayurveda - ITRA Jamnagar)",
      opdRoom: "Room 12, AYUSH Wing",
      status: "available",
      patientsSeenToday: 14,
      rating: 4.95,
      contact: "+91 98790 33445"
    },
    {
      id: "DOC-CIVIL-003",
      name: "Dr. Bhavesh Patel",
      email: "dr.bhavesh.patel@unmehta.ac.in",
      specialization: "Chief Interventional Cardiologist",
      department: "cardiology",
      hospitalId: "hosp-un-mehta-ahmedabad",
      hospitalName: "U.N. Mehta Institute of Cardiology & Research Centre",
      nmcRegistrationNumber: "G-39104-GUJ",
      experience: "19+ Years",
      qualification: "MBBS, MD, DM (Cardiology)",
      opdRoom: "Cathlab Suite 3",
      status: "in_opd",
      patientsSeenToday: 22,
      rating: 4.88,
      contact: "+91 94260 55667"
    },
    {
      id: "DOC-CIVIL-004",
      name: "Dr. Priyanshi Mehta",
      email: "dr.priyanshi.mehta@aiimsrajkot.edu.in",
      specialization: "Senior Orthopedic & Joint Reconstruction Surgeon",
      department: "orthopedics",
      hospitalId: "hosp-aiims-rajkot",
      hospitalName: "AIIMS (All India Institute of Medical Sciences) Rajkot",
      nmcRegistrationNumber: "G-51203-GUJ",
      experience: "11+ Years",
      qualification: "MBBS, MS (Orthopedics) - AIIMS",
      opdRoom: "OPD 208, Ortho Wing",
      status: "available",
      patientsSeenToday: 11,
      rating: 4.85,
      contact: "+91 98980 77889"
    },
    {
      id: "DOC-CIVIL-005",
      name: "Dr. Mihir Desai",
      email: "dr.mihir.desai@ssgvadodara.gov.in",
      specialization: "Pediatric Critical Care Specialist",
      department: "pediatrics",
      hospitalId: "hosp-ssg-vadodara",
      hospitalName: "Sir Sayajirao General (SSG) Hospital & Baroda Medical College",
      nmcRegistrationNumber: "G-44192-GUJ",
      experience: "14+ Years",
      qualification: "MBBS, MD (Pediatrics)",
      opdRoom: "Pediatric Block Room 5",
      status: "in_opd",
      patientsSeenToday: 16,
      rating: 4.92,
      contact: "+91 97240 99881"
    },
    {
      id: "DOC-CIVIL-006",
      name: "Dr. Neha Trivedi",
      email: "dr.neha.trivedi@civilgandhinagar.gov.in",
      specialization: "Consultant Obstetrician & Gynecologist",
      department: "gynecology",
      hospitalId: "hosp-civil-gandhinagar",
      hospitalName: "GMERS Civil Hospital & Medical College Gandhinagar",
      nmcRegistrationNumber: "G-49821-GUJ",
      experience: "13+ Years",
      qualification: "MBBS, MS (OBGYN), DNB",
      opdRoom: "Maternal Wing Room 102",
      status: "available",
      patientsSeenToday: 19,
      rating: 4.91,
      contact: "+91 98240 44556"
    }
  ];

  getDoctors(): HospitalDoctor[] {
    if (typeof window === "undefined") return this.defaultDoctors;
    const data = localStorage.getItem(this.doctorsKey);
    if (!data) {
      localStorage.setItem(this.doctorsKey, JSON.stringify(this.defaultDoctors));
      return this.defaultDoctors;
    }
    try {
      return JSON.parse(data);
    } catch {
      return this.defaultDoctors;
    }
  }

  saveDoctors(doctors: HospitalDoctor[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.doctorsKey, JSON.stringify(doctors));
  }

  addDoctor(doctor: Omit<HospitalDoctor, "id" | "patientsSeenToday" | "rating">): HospitalDoctor {
    const doctors = this.getDoctors();
    const newDoc: HospitalDoctor = {
      ...doctor,
      id: `DOC-HOSP-${Date.now()}`,
      patientsSeenToday: 0,
      rating: 5.0
    };
    doctors.unshift(newDoc);
    this.saveDoctors(doctors);
    return newDoc;
  }

  updateDoctorStatus(doctorId: string, status: HospitalDoctor["status"]): void {
    const doctors = this.getDoctors();
    const idx = doctors.findIndex(d => d.id === doctorId);
    if (idx !== -1) {
      doctors[idx].status = status;
      this.saveDoctors(doctors);
    }
  }

  deleteDoctor(doctorId: string): void {
    const doctors = this.getDoctors().filter(d => d.id !== doctorId);
    this.saveDoctors(doctors);
  }
}

export const hospitalManager = new HospitalManager();
