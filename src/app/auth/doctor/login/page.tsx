"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Award,
  KeyRound,
  Mail,
  Lock,
  Building,
  Sparkles,
  UserCheck
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const PRESET_DOCTORS = [
  {
    name: "Dr. Rajesh Mehta",
    nmcNumber: "GMC-GUJ-48921/2014",
    email: "dr.rajesh.mehta@bjmc.edu.in",
    specialty: "General Medicine & Internal Care",
    hospital: "Civil Hospital & B.J. Medical College Ahmedabad",
    role: "Senior Consultant (MD)"
  },
  {
    name: "Dr. Ananya Iyer",
    nmcNumber: "GMC-GUJ-84210/2016",
    email: "dr.ananya.iyer@aiimsrajkot.edu.in",
    specialty: "Cardiology & Preventive Heart Care",
    hospital: "AIIMS Rajkot",
    role: "Associate Professor (DM, Cardiology)"
  },
  {
    name: "Dr. Vikramaditya Sharma",
    nmcNumber: "AYUSH-GUJ-55912/2018",
    email: "dr.vikram.sharma@itra.gov.in",
    specialty: "Ayurveda & Panchakarma Specialization",
    hospital: "ITRA Jamnagar (National AYUSH Apex)",
    role: "Chief Ayurvedic Consultant (BAMS, MD-Ayu)"
  },
  {
    name: "Dr. Sarah Verma",
    nmcNumber: "GMC-GUJ-91024/2019",
    email: "dr.sarah.verma@ssg.gov.in",
    specialty: "Pediatrics & Child Health",
    hospital: "SSG Hospital & Baroda Medical College Vadodara",
    role: "Attending Pediatrician (MD, DNB)"
  }
];

export default function DoctorLogin() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [loginMode, setLoginMode] = useState<"preset" | "credentials">("preset");
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState<number>(0);

  // Custom credential inputs
  const [medicalRegNumber, setMedicalRegNumber] = useState(PRESET_DOCTORS[0].nmcNumber);
  const [institutionalEmail, setInstitutionalEmail] = useState(PRESET_DOCTORS[0].email);
  const [doctorPassword, setDoctorPassword] = useState("Doctor@NMC2026");
  const [doctorName, setDoctorName] = useState(PRESET_DOCTORS[0].name);
  const [specialization, setSpecialization] = useState(PRESET_DOCTORS[0].specialty);
  const [hospitalAffiliation, setHospitalAffiliation] = useState(PRESET_DOCTORS[0].hospital);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSelectPreset = (index: number) => {
    setSelectedDoctorIndex(index);
    const doc = PRESET_DOCTORS[index];
    setMedicalRegNumber(doc.nmcNumber);
    setInstitutionalEmail(doc.email);
    setDoctorName(doc.name);
    setSpecialization(doc.specialty);
    setHospitalAffiliation(doc.hospital);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!medicalRegNumber || !institutionalEmail || !doctorPassword) {
      setMessage({ type: "error", text: "Please enter your National Medical Registration No. & Institutional Email." });
      return;
    }

    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      const activeDoc = PRESET_DOCTORS[selectedDoctorIndex] || {
        name: doctorName || "Dr. Medical Officer",
        specialty: specialization || "General Medicine",
        hospital: hospitalAffiliation || "Connected Apex Hospital",
        nmcNumber: medicalRegNumber,
        email: institutionalEmail,
        role: "Medical Consultant"
      };

      const doctorUser = {
        id: `DOC-${Date.now()}`,
        role: "doctor",
        name: activeDoc.name.replace(/^Dr\.\s*/, ""),
        title: "Dr.",
        email: institutionalEmail,
        medicalRegistrationNumber: medicalRegNumber,
        specialization: activeDoc.specialty,
        hospitalAffiliation: activeDoc.hospital,
        hospitalName: activeDoc.hospital,
        verificationStatus: "verified",
        council: "National Medical Commission (NMC) / State Council",
        nmcVerified: true,
        abhaDoctorId: `91-DOC-${medicalRegNumber.replace(/[^0-9]/g, "").slice(0, 8) || "84920184"}`,
        preferredLanguage: language,
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem("currentUser", JSON.stringify(doctorUser));
      localStorage.setItem("userRole", "doctor");
      localStorage.setItem("authToken", `nmc-verified-doc-${Date.now()}`);

      setLoading(false);
      setMessage({ type: "success", text: "NMC Medical Council Verified. Launching Clinical Station..." });

      setTimeout(() => {
        router.push("/doctor/dashboard");
      }, 400);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col medical-bg">
      {/* Top Bar */}
      <div className="glass border-b border-primary/20 bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("back")} to Home</span>
          </button>
          <div className="font-bold text-base text-foreground flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <span>NMC / ABDM Doctor Clinical Portal</span>
          </div>
          <LanguageSwitcher compact />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full space-y-5">
          {message && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-destructive/10 border border-destructive/30 text-destructive"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {message.text}
            </div>
          )}

          <Card className="border-2 border-primary/20 bg-surface shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4 border-b border-border text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <Stethoscope className="w-7 h-7" />
              </div>
              <CardTitle className="text-2xl font-black text-foreground">
                Physician & Specialist Portal Login
              </CardTitle>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Access your OPD queue, AI triage consults, and e-prescription desk using your Verified National Medical License (NMC/State Council).
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {/* Method Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-background rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setLoginMode("preset")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    loginMode === "preset"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Select Verified Doctor Profile
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode("credentials")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    loginMode === "credentials"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Enter NMC Reg / Email
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginMode === "preset" ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-primary" /> Select Active Practitioner on Duty
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {PRESET_DOCTORS.map((doc, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectPreset(idx)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedDoctorIndex === idx
                              ? "border-primary bg-primary/10 shadow-xs"
                              : "border-border hover:border-primary/40 bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                <span>{doc.name}</span>
                                <span className="text-[10px] font-semibold px-2 py-0.2 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-500/30">
                                  NMC Verified
                                </span>
                              </div>
                              <div className="text-xs text-primary font-medium mt-0.5">{doc.specialty}</div>
                              <div className="text-[11px] text-muted flex flex-wrap gap-x-2 mt-1">
                                <span>🏥 {doc.hospital}</span>
                                <span>•</span>
                                <span className="font-mono text-[10px]">ID: {doc.nmcNumber}</span>
                              </div>
                            </div>
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 border-primary">
                              {selectedDoctorIndex === idx && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-primary" /> Medical License / NMC Registration No.
                      </label>
                      <input
                        type="text"
                        required
                        value={medicalRegNumber}
                        onChange={(e) => setMedicalRegNumber(e.target.value)}
                        placeholder="e.g. NMC-MCI-48921/2014 or State Council ID"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary" /> Institutional / Professional Email
                      </label>
                      <input
                        type="email"
                        required
                        value={institutionalEmail}
                        onChange={(e) => setInstitutionalEmail(e.target.value)}
                        placeholder="doctor@hospital.edu.in or doctor@aiims.gov.in"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Password field */}
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-primary" /> Medical Council Portal Password
                  </label>
                  <input
                    type="password"
                    required
                    value={doctorPassword}
                    onChange={(e) => setDoctorPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all mt-2"
                >
                  {loading ? "Authenticating with National Medical Council..." : "Log In as Verified Doctor →"}
                </Button>
              </form>

              {/* Demo Hint Helper */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Demo Doctor Credentials:
                </div>
                <div className="font-mono text-[10px] text-foreground font-semibold">
                  Email: <span className="text-primary">{institutionalEmail}</span> | License: <span className="text-primary">{medicalRegNumber}</span>
                </div>
                <div className="font-mono text-[10px] text-foreground font-semibold">
                  Password: <span className="text-primary">Doctor@NMC2026</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <button
              onClick={() => router.push("/auth/doctor/register")}
              className="text-xs text-muted hover:text-primary transition-colors underline font-medium"
            >
              New Doctor? Register National Medical License
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
