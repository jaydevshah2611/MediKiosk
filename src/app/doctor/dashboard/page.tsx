"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Stethoscope,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Search,
  Filter,
  FileText,
  Activity,
  HeartPulse,
  Pill,
  Award,
  Building,
  ChevronRight,
  ShieldCheck,
  Send,
  Plus,
  Calendar,
  Sparkles,
  Phone,
  User,
  X,
  RefreshCw,
  BadgeCheck,
  Check,
  LayoutDashboard,
  CalendarDays,
  Settings as SettingsIcon,
  UserCheck,
  Sliders,
  Bell,
  Volume2,
  Globe,
  Moon,
  Sun,
  Lock,
  Mail,
  MapPin,
  ExternalLink,
  Info
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { VisitManager, type PatientVisitRecord } from "@/lib/visitManager";
import { TokenManager } from "@/lib/tokenManager";
import { type Department } from "@/types/token";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { SignLanguageAvatar } from "@/components/patient/SignLanguageAvatar";
import { syncLiveFromServer, sortVisitsBySeverity, maxVisitSeverity } from "@/lib/liveClient";

const visitManager = new VisitManager();
const tokenManager = new TokenManager();

export default function DoctorDashboard() {
  const router = useRouter();
  const { t, setLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);

  // Exact 5 Tabs as requested
  const [activeTab, setActiveTab] = useState<"dashboard" | "patients" | "schedule" | "profile" | "settings">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // Dynamic Live Queue data from visitManager & tokenManager
  const [visits, setVisits] = useState<PatientVisitRecord[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<PatientVisitRecord | null>(null);

  // Clinical Consultation Editor state
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [prescriptionList, setPrescriptionList] = useState<string[]>([]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("1 Tab BD after food x 5 days");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [isSubmittingConsult, setIsSubmittingConsult] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Doctor Settings State
  const [consultDuration, setConsultDuration] = useState("10");
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [autoNextPatient, setAutoNextPatient] = useState(false);
  const [aiAssistance, setAiAssistance] = useState(true);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Doctor Schedule state
  const [selectedScheduleDay, setSelectedScheduleDay] = useState("Today");

  // Load and hydrate doctor data
  const langReady = useRef(false);

  const loadData = () => {
    if (typeof window === "undefined") return;
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "doctor") {
        router.push("/auth/doctor/login");
        return;
      }
      setUser(parsedUser);
      if (!langReady.current && parsedUser.preferredLanguage) {
        setLanguage(parsedUser.preferredLanguage);
        langReady.current = true;
      }

      const allVisits = visitManager.getVisits().map((v) => ({
        ...v,
        symptoms: v.symptoms || [],
        priorityFlags: v.priorityFlags || [],
        patientName: v.patientName === "Jaydev" ? (v.id === "visit-101" ? "Aarav Sharma" : "Priya Patel") : v.patientName
      }));
      setVisits(allVisits);
    } else {
      router.push("/auth/doctor/login");
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      syncLiveFromServer().then(() => loadData()).catch(() => {});
    }, 4000);
    return () => clearInterval(timer);
  }, [router]);

  // When a visit is selected for review or consultation, initialize the form
  const handleOpenConsultation = (visit: PatientVisitRecord) => {
    setSelectedVisit(visit);
    setDiagnosisInput(visit.diagnosisNotes || "");
    setPrescriptionList(visit.prescriptions || ["Tab. Paracetamol 650mg - 1 Tab TDS (PRN)", "Tab. Pantoprazole 40mg - 1 Tab OD before food x 5 days"]);
    setClinicalNotes(visit.diagnosisNotes ? `Previous assessment: ${visit.diagnosisNotes}` : "");
    setActionSuccessMessage(null);
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    setPrescriptionList(prev => [...prev, `${newMedName.trim()} — ${newMedDosage.trim()}`]);
    setNewMedName("");
  };

  const handleRemoveMedication = (index: number) => {
    setPrescriptionList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCompleteConsultation = (status: "completed" | "in_progress") => {
    if (!selectedVisit) return;
    setIsSubmittingConsult(true);

    setTimeout(() => {
      const updatedVisit: PatientVisitRecord = {
        ...selectedVisit,
        status: status,
        diagnosisNotes: diagnosisInput || "Clinical evaluation completed. Vitals stable.",
        prescriptions: prescriptionList,
        assignedDoctor: user ? `Dr. ${user.name} (${user.specialization || "Physician"})` : selectedVisit.assignedDoctor,
        hospitalName: user?.hospitalName || user?.hospitalAffiliation || selectedVisit.hospitalName,
      };

      visitManager.saveVisit(updatedVisit);

      // Update Token Manager queue state if token exists
      if (selectedVisit.tokenId) {
        tokenManager.updateTokenStatus(selectedVisit.tokenId, status === "completed" ? "completed" : "in_consultation");
      }

      // Refresh list
      setVisits(visitManager.getVisits());
      setSelectedVisit(updatedVisit);
      setIsSubmittingConsult(false);
      setActionSuccessMessage(status === "completed" ? "Consultation marked as Completed & e-Prescription Issued!" : "Patient consultation set to In-Progress.");
    }, 400);
  };

  const handleSaveSettings = () => {
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
    }
    router.push("/auth/doctor/login");
  };

  // Filtered visits
  const filteredVisits = useMemo(() => {
    const list = visits.filter(v => {
      const matchesDept = selectedDepartmentFilter === "all" || v.department.toLowerCase().includes(selectedDepartmentFilter.toLowerCase());
      const matchesStatus = selectedStatusFilter === "all" || v.status === selectedStatusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        v.patientName.toLowerCase().includes(q) ||
        (v.tokenNumber && v.tokenNumber.toLowerCase().includes(q)) ||
        (v.symptoms || []).some(s => s.name.toLowerCase().includes(q)) ||
        (v.diagnosisNotes && v.diagnosisNotes.toLowerCase().includes(q));
      return matchesDept && matchesStatus && matchesQuery;
    });
    return sortVisitsBySeverity(list);
  }, [visits, selectedDepartmentFilter, selectedStatusFilter, searchQuery]);

  // Real-time metrics
  const waitingCount = visits.filter(v => v.status === "in_progress" || v.status === "scheduled").length;
  const completedCount = visits.filter(v => v.status === "completed").length;
  const priorityCount = visits.filter(v => (v.priorityFlags && v.priorityFlags.length > 0) || (v.symptoms || []).some(s => (s.severity || 0) >= 8)).length;

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-foreground">Loading Clinical Station...</div>;
  }

  const TABS = [
    { id: "dashboard", label: t("tab_dashboard"), icon: LayoutDashboard, badge: waitingCount },
    { id: "patients", label: t("tab_patients"), icon: Users, badge: visits.length },
    { id: "schedule", label: t("tab_schedule"), icon: CalendarDays },
    { id: "profile", label: t("nav_profile"), icon: Award },
    { id: "settings", label: t("nav_settings"), icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col medical-bg">
      {/* Top Bar */}
      <div className="glass border-b border-primary/20 bg-surface/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-xs">
                <Stethoscope className="w-5 h-5 animate-heartbeat-pulse" />
              </div>
              <div>
                <div className="font-extrabold text-foreground text-base flex items-center gap-1.5">
                  <span>Dr. {user.name}</span>
                  <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div className="hidden lg:flex items-center w-16 h-4 overflow-hidden relative">
                    <svg
                      className="w-full h-full text-primary"
                      viewBox="0 0 120 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 0 15 L 20 15 L 25 15 L 30 5 L 35 25 L 40 10 L 45 20 L 50 15 L 70 15 L 75 15 L 80 5 L 85 25 L 90 10 L 95 20 L 100 15 L 120 15"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-ecg-line"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-primary font-medium flex items-center gap-1.5">
                  <span>{user.specialization || "Senior Medical Consultant"}</span>
                  <span className="text-muted">•</span>
                  <span className="text-muted text-[11px] font-mono">{user.medicalRegistrationNumber || "NMC-VERIFIED"}</span>
                </div>
              </div>
            </div>

            <div className="sm:hidden flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Building className="w-3.5 h-3.5" />
              <span>{user.hospitalAffiliation || user.hospitalName || "AIIMS Apex Center"}</span>
            </div>

            <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> NMC Active Station
            </div>

            <LanguageSwitcher compact />

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-background border border-border text-muted hover:text-foreground hover:border-primary transition-all text-xs flex items-center gap-1.5"
              title={t("refresh_queue")}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t("refresh_queue")}</span>
            </button>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted hover:text-destructive hover:border-destructive/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* 5 Main Tabs Navigation Switcher */}
        <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedVisit(null);
                }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-surface text-muted hover:text-foreground hover:bg-muted border border-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {typeof tab.badge === "number" && (
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Stats Summary Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="portal-glow-card rounded-2xl p-[1.5px]">
            <div className="portal-glow-inner p-4 flex items-center justify-between relative overflow-hidden group">
              <div className="glow-blob bg-teal-500" />
              <div className="z-10">
                <div className="text-2xl sm:text-3xl font-black text-primary">{waitingCount}</div>
                <div className="text-xs font-semibold text-muted mt-0.5">Patients in Active Queue</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform z-10">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="portal-glow-card rounded-2xl p-[1.5px]">
            <div className="portal-glow-inner p-4 flex items-center justify-between relative overflow-hidden group">
              <div className="glow-blob bg-emerald-500" />
              <div className="z-10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">{completedCount}</div>
                <div className="text-xs font-semibold text-muted mt-0.5">Completed Today</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform z-10">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="portal-glow-card rounded-2xl p-[1.5px]">
            <div className="portal-glow-inner p-4 flex items-center justify-between relative overflow-hidden group">
              <div className="glow-blob bg-rose-500" />
              <div className="z-10">
                <div className="text-2xl sm:text-3xl font-black text-rose-600">{priorityCount}</div>
                <div className="text-xs font-semibold text-muted mt-0.5">Priority / Red Flags</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform z-10">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="portal-glow-card rounded-2xl p-[1.5px]">
            <div className="portal-glow-inner p-4 flex items-center justify-between relative overflow-hidden group">
              <div className="glow-blob bg-sky-500" />
              <div className="z-10">
                <div className="text-2xl sm:text-3xl font-black text-foreground">{consultDuration}m</div>
                <div className="text-xs font-semibold text-muted mt-0.5">Avg. Target Consultation</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform z-10">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- TAB 1: DASHBOARD (LIVE OPD QUEUE & CONSULTS) ----------------- */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Queue List */}
            <div className={`space-y-4 ${selectedVisit ? "lg:col-span-5" : "lg:col-span-12"}`}>
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-surface p-3.5 rounded-2xl border border-border">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by token, patient name, or symptom..."
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Statuses</option>
                    <option value="in_progress">Waiting / In-Progress</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                  </select>

                  <select
                    value={selectedDepartmentFilter}
                    onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Specialties</option>
                    <option value="general">General Medicine</option>
                    <option value="cardio">Cardiology</option>
                    <option value="pediatric">Pediatrics</option>
                    <option value="ayush">AYUSH</option>
                  </select>
                </div>
              </div>

              {/* Patient Queue Cards List */}
              <div className="space-y-3">
                {filteredVisits.length === 0 ? (
                  <Card className="border border-border bg-surface p-8 text-center">
                    <Users className="w-12 h-12 text-muted mx-auto mb-2" />
                    <div className="font-bold text-foreground">No patients match the search filter</div>
                    <div className="text-xs text-muted mt-1">Try clearing your filters or refreshing the live OPD queue.</div>
                  </Card>
                ) : (
                  filteredVisits.map((visit) => {
                    const isSelected = selectedVisit?.id === visit.id;
                    const isPriority = (visit.priorityFlags && visit.priorityFlags.length > 0) || (visit.symptoms || []).some(s => (s.severity || 0) >= 8);
                    const isCompleted = visit.status === "completed";

                    return (
                      <div
                        key={visit.id}
                        onClick={() => handleOpenConsultation(visit)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-md"
                            : isPriority
                            ? "border-rose-500/40 bg-rose-500/5 hover:border-rose-500"
                            : isCompleted
                            ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs ${
                              isPriority
                                ? "bg-rose-500/15 text-rose-600 border border-rose-500/30"
                                : isCompleted
                                ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                                : "bg-primary/15 text-primary border border-primary/30"
                            }`}>
                              <span className="text-[9px] uppercase font-mono">Token</span>
                              <span className="text-sm font-extrabold">{visit.tokenNumber || "N/A"}</span>
                            </div>

                            <div>
                              <div className="font-bold text-foreground text-sm flex items-center gap-2 flex-wrap">
                                <span>{visit.patientName}</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                  {t("patient_arriving")}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30">
                                  {t("severity")} {maxVisitSeverity(visit)}/10
                                </span>
                                {isPriority && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white animate-pulse">
                                    {t("high_priority")}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                                <span>{visit.department}</span>
                                <span>•</span>
                                <span>{new Date(visit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                : "bg-primary/10 text-primary border border-primary/30"
                            }`}>
                              {isCompleted ? "✓ Concluded" : "Waiting Consult"}
                            </span>
                          </div>
                        </div>

                        {/* Symptoms pills */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(visit.symptoms || []).map((s, idx) => (
                            <span
                              key={idx}
                              className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                                (s.severity || 0) >= 8
                                  ? "bg-rose-500/15 text-rose-600 border border-rose-500/30 font-bold"
                                  : "bg-muted/60 text-foreground border border-border"
                              }`}
                            >
                              {s.name} {(s.severity || 0) >= 8 ? `(${s.severity}/10)` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Active Patient Consultation Workstation */}
            {selectedVisit && (
              <div className="lg:col-span-7 space-y-4">
                <Card className="border-2 border-primary/30 bg-surface shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4 border-b border-border flex flex-row items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-primary uppercase tracking-wider">Active Clinical Workstation</div>
                      <CardTitle className="text-xl font-black text-foreground flex items-center gap-2">
                        <span>{selectedVisit.patientName}</span>
                        <span className="text-xs font-mono font-normal text-muted">({selectedVisit.tokenNumber})</span>
                      </CardTitle>
                    </div>

                    <button
                      onClick={() => setSelectedVisit(null)}
                      className="p-1.5 rounded-xl hover:bg-muted text-muted hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </CardHeader>

                  <CardContent className="p-6 space-y-5">
                    {actionSuccessMessage && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        {actionSuccessMessage}
                      </div>
                    )}

                    <SignLanguageAvatar
                      currentText={
                        (selectedVisit.symptoms || []).length
                          ? `Doctor consult. ${selectedVisit.patientName}. ${(selectedVisit.symptoms || []).map((s) => s.name).join(", ")}. ${(selectedVisit.priorityFlags || []).length ? "Urgent emergency." : "Wait. Confirm medicine."}`
                          : "Doctor consult. Confirm medicine. Wait."
                      }
                      stepName="follow_up"
                    />

                    {/* Vitals & Triage Summary */}
                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5 text-primary" /> Kiosk Triage Recorded Vitals
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 rounded-lg bg-muted/40 border border-border">
                          <span className="text-[10px] text-muted block">Blood Pressure</span>
                          <span className="font-bold text-foreground">{selectedVisit.vitalSigns?.bp || "120/80 mmHg"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/40 border border-border">
                          <span className="text-[10px] text-muted block">Pulse</span>
                          <span className="font-bold text-foreground">{selectedVisit.vitalSigns?.pulse || 74} bpm</span>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/40 border border-border">
                          <span className="text-[10px] text-muted block">SpO2</span>
                          <span className="font-bold text-foreground">{selectedVisit.vitalSigns?.spo2 || 98}%</span>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/40 border border-border">
                          <span className="text-[10px] text-muted block">Temp</span>
                          <span className="font-bold text-foreground">{selectedVisit.vitalSigns?.temperature || "98.6 °F"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reported Symptoms */}
                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-primary" /> Logged Chief Complaints & Answers
                      </label>
                      <div className="space-y-2">
                        {(selectedVisit.symptoms || []).map((s, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-background border border-border text-xs">
                            <div className="font-bold text-foreground flex items-center justify-between">
                              <span>• {s.name}</span>
                              {s.severity && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  s.severity >= 8 ? "bg-rose-500/15 text-rose-600" : "bg-primary/10 text-primary"
                                }`}>
                                  Severity: {s.severity}/10
                                </span>
                              )}
                            </div>
                            {s.notes && (
                              <div className="text-muted text-[11px] mt-1 pl-2 border-l-2 border-primary/30">
                                {s.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Doctor Clinical Diagnosis Input */}
                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-primary" /> Physician Impression & Diagnosis
                      </label>
                      <textarea
                        rows={2}
                        value={diagnosisInput}
                        onChange={(e) => setDiagnosisInput(e.target.value)}
                        placeholder="e.g. Acute upper respiratory infection with mild allergic bronchospasm. No acute distress."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    {/* e-Prescription Medications Builder */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-primary" /> Prescribed Medications (e-Rx)
                      </label>

                      {/* Prescription list */}
                      <div className="space-y-1.5">
                        {prescriptionList.map((med, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-background border border-border flex items-center justify-between text-xs">
                            <span className="font-semibold text-foreground">{med}</span>
                            <button
                              onClick={() => handleRemoveMedication(idx)}
                              className="text-destructive hover:bg-destructive/10 p-1 rounded-lg text-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new medication inputs */}
                      <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                        <div className="text-[11px] font-bold text-foreground flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5 text-primary" /> Add Medication to e-Rx:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newMedName}
                            onChange={(e) => setNewMedName(e.target.value)}
                            placeholder="e.g. Tab. Paracetamol 650mg"
                            className="px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={newMedDosage}
                            onChange={(e) => setNewMedDosage(e.target.value)}
                            placeholder="Dosage: 1 Tab TID x 5 days"
                            className="px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddMedication}
                          className="w-full bg-primary/90 text-xs font-bold"
                        >
                          + Add Medication Item
                        </Button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-border flex flex-col sm:flex-row gap-2.5">
                      <Button
                        onClick={() => handleCompleteConsultation("completed")}
                        disabled={isSubmittingConsult}
                        className="flex-1 py-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        Complete & Sign e-Prescription
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCompleteConsultation("in_progress")}
                        disabled={isSubmittingConsult}
                        className="py-5 text-xs font-bold rounded-xl"
                      >
                        Keep In-Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 2: PATIENTS DIRECTORY ----------------- */}
        {activeTab === "patients" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Clinical Patient Records & Consultation History
                </h2>
                <p className="text-xs text-muted">Complete ledger of examined and scheduled OPD patients across departments.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Total Records: {visits.length}
                </span>
              </div>
            </div>

            {/* Patients List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visits.map((v) => (
                <Card key={v.id} className="border border-border bg-surface hover:border-primary/40 transition-all shadow-xs">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-foreground text-base flex items-center gap-2">
                          <span>{v.patientName}</span>
                          <span className="text-xs text-muted font-mono">({v.tokenNumber || "N/A"})</span>
                        </div>
                        <div className="text-xs text-muted mt-0.5">
                          Visited: {new Date(v.date).toLocaleDateString()} at {new Date(v.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Dept: {v.department}
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        v.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      }`}>
                        {v.status === "completed" ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {v.status === "completed" ? "Consulted" : "Queued"}
                      </span>
                    </div>

                    <div className="text-xs text-foreground bg-background p-3 rounded-xl border border-border space-y-1">
                      <div className="font-bold text-primary flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Clinical Diagnosis / Assessment:
                      </div>
                      <div className="text-foreground/90">{v.diagnosisNotes || "Routine triage examination recorded."}</div>
                    </div>

                    {v.prescriptions && v.prescriptions.length > 0 && (
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-muted text-[11px] flex items-center gap-1">
                          <Pill className="w-3 h-3 text-primary" /> Issued e-Prescriptions:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {v.prescriptions.map((p, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-muted/50 text-foreground border border-border text-[11px]">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: SCHEDULE (OPD DUTY ROSTER & CLINIC SLOTS) ----------------- */}
        {activeTab === "schedule" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary" /> OPD Duty Roster & Clinical Schedule
                </h2>
                <p className="text-xs text-muted">Weekly shift timings, designated consultation rooms, and ward rounds.</p>
              </div>

              {/* Day filter selector */}
              <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border text-xs">
                {["Today", "Tomorrow", "Weekly Roster"].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedScheduleDay(day)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      selectedScheduleDay === day
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border bg-surface">
                <CardHeader className="bg-primary/5 pb-3 border-b border-border">
                  <div className="text-[11px] font-bold text-primary uppercase">Morning Shift</div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
                    <span>General OPD Session</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">09:00 - 13:00</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-muted">
                    <span>Designated Room:</span>
                    <span className="font-bold text-foreground">OPD Block B, Room 204</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Expected Patient Cap:</span>
                    <span className="font-bold text-foreground">35 Patients</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Clinical Assistant:</span>
                    <span className="font-bold text-foreground">Sister Rashmi (RN)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Shift Active • Token Calling Enabled
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-surface">
                <CardHeader className="bg-amber-500/5 pb-3 border-b border-border">
                  <div className="text-[11px] font-bold text-amber-600 uppercase">Afternoon Session</div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
                    <span>Specialty / Referral Review</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">14:00 - 16:30</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-muted">
                    <span>Designated Room:</span>
                    <span className="font-bold text-foreground">Specialty Clinic Room 12</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Expected Patient Cap:</span>
                    <span className="font-bold text-foreground">15 Patients</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Focus Area:</span>
                    <span className="font-bold text-foreground">{user.specialization || "Clinical Reviews"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-muted font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Upcoming Afternoon Slot
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-surface">
                <CardHeader className="bg-purple-500/5 pb-3 border-b border-border">
                  <div className="text-[11px] font-bold text-purple-600 uppercase">Evening Rounds</div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
                    <span>In-Patient Ward Inspection</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300">17:00 - 18:30</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-muted">
                    <span>Assigned Ward:</span>
                    <span className="font-bold text-foreground">Medical Ward 3 (Male & Female)</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Total In-Patients:</span>
                    <span className="font-bold text-foreground">18 Beds</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Emergency On-Call:</span>
                    <span className="font-bold text-foreground">Dr. Resident Officer</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-muted font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Scheduled for Late Afternoon
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: PROFILE (VERIFIED NMC CREDENTIALS) ----------------- */}
        {activeTab === "profile" && (
          <div className="max-w-3xl mx-auto space-y-5">
            <Card className="border border-border bg-surface shadow-md">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" /> Verified National Medical Council Credentials
                </CardTitle>
                <p className="text-xs text-muted">Digital identity verified by National Medical Commission (NMC) & Ayushman Bharat Digital Mission (ABDM).</p>
              </CardHeader>
              <CardContent className="p-6 space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <span className="text-muted block text-[10px] font-bold uppercase">Practitioner Full Name</span>
                    <span className="font-bold text-foreground text-sm">Dr. {user.name}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <span className="text-muted block text-[10px] font-bold uppercase">NMC License Registration No.</span>
                    <span className="font-mono font-bold text-primary text-sm">{user.medicalRegistrationNumber || "NMC-MCI-48921/2014"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <span className="text-muted block text-[10px] font-bold uppercase">Specialty / Clinical Wing</span>
                    <span className="font-bold text-foreground text-sm">{user.specialization || "General Medicine"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <span className="text-muted block text-[10px] font-bold uppercase">Hospital Affiliation</span>
                    <span className="font-bold text-foreground text-sm">{user.hospitalAffiliation || user.hospitalName || "AIIMS Apex Center"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <span className="text-muted block text-[10px] font-bold uppercase">Institutional Email</span>
                    <span className="font-mono text-foreground text-xs">{user.email || "doctor@aiims.edu.in"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <span className="text-muted block text-[10px] font-bold uppercase">ABDM Doctor ID</span>
                    <span className="font-mono text-foreground text-xs">{user.abhaDoctorId || "91-DOC-84920184"}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> NMC Council Verification Status: Active & In-Good-Standing
                  </span>
                  <span className="text-[10px] font-mono text-muted">Verified 2026</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ----------------- TAB 5: SETTINGS (CLINICAL WORKSTATION PREFERENCES) ----------------- */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto space-y-5">
            <Card className="border border-border bg-surface shadow-md">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-primary" /> Clinical Station Preferences & Workflow Settings
                </CardTitle>
                <p className="text-xs text-muted">Configure your OPD consultation flow, alert tones, and diagnostic assistants.</p>
              </CardHeader>
              <CardContent className="p-6 space-y-5 text-xs">
                {savedSettingsSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Doctor workstation settings updated successfully!
                  </div>
                )}

                <div className="space-y-4">
                  {/* Default Consult Duration */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                    <div>
                      <div className="font-bold text-foreground text-sm">Target Consultation Duration</div>
                      <div className="text-muted text-[11px]">Controls average wait time estimations in the patient queue.</div>
                    </div>
                    <select
                      value={consultDuration}
                      onChange={(e) => setConsultDuration(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground font-bold text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="5">5 minutes</option>
                      <option value="8">8 minutes</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="20">20 minutes</option>
                    </select>
                  </div>

                  {/* Audio Alerts */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                    <div>
                      <div className="font-bold text-foreground text-sm">Audio Chimes on Patient Arrival</div>
                      <div className="text-muted text-[11px]">Play chime when high-priority emergency or next patient checks in.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={audioAlerts}
                      onChange={(e) => setAudioAlerts(e.target.checked)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* AI Triage Assistance */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                    <div>
                      <div className="font-bold text-foreground text-sm">AI Triage Diagnostic Suggestions</div>
                      <div className="text-muted text-[11px]">Show pre-populated differential diagnosis suggestions based on patient symptoms.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiAssistance}
                      onChange={(e) => setAiAssistance(e.target.checked)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Auto-Call Next Patient */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                    <div>
                      <div className="font-bold text-foreground text-sm">Auto-Call Next Token on Prescription Sign</div>
                      <div className="text-muted text-[11px]">Automatically load the next waiting patient when you sign an e-prescription.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoNextPatient}
                      onChange={(e) => setAutoNextPatient(e.target.checked)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-xs"
                  >
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
