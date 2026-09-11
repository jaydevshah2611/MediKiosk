"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  LogOut,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Activity,
  HeartPulse,
  Pill,
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
  ShieldCheck,
  Mail,
  MapPin,
  ExternalLink,
  Trash2,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  BedDouble,
  Sliders,
  Send
} from "lucide-react";
import { useTranslation, type LanguageCode } from "@/lib/languages";
import { VisitManager, type PatientVisitRecord } from "@/lib/visitManager";
import { TokenManager, departments } from "@/lib/tokenManager";
import { hospitalManager, type HospitalDoctor } from "@/lib/hospitalManager";
import { type Department, type Token } from "@/types/token";

const visitManager = new VisitManager();
const tokenManager = new TokenManager();

export default function HospitalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const { t } = useTranslation(selectedLanguage);

  // Active navigation tab & filter
  const [activeTab, setActiveTab] = useState<"dashboard" | "tokens" | "doctors" | "departments" | "patients" | "analytics">("dashboard");
  const [tokenStatusFilter, setTokenStatusFilter] = useState<"all" | "waiting" | "in_consultation" | "completed">("all");

  // Live state
  const [visits, setVisits] = useState<PatientVisitRecord[]>([]);
  const [doctors, setDoctors] = useState<HospitalDoctor[]>([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showIssueTokenModal, setShowIssueTokenModal] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState<Token | null>(null);
  const [selectedVisitDetails, setSelectedVisitDetails] = useState<PatientVisitRecord | null>(null);

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState("");
  const [newDocEmail, setNewDocEmail] = useState("");
  const [newDocDept, setNewDocDept] = useState<Department>("general_medicine");
  const [newDocSpec, setNewDocSpec] = useState("");
  const [newDocNmc, setNewDocNmc] = useState("");
  const [newDocRoom, setNewDocRoom] = useState("");
  const [newDocExp, setNewDocExp] = useState("");

  // Quick Issue Token Form State
  const [tokenPatientName, setTokenPatientName] = useState("");
  const [tokenPatientId, setTokenPatientId] = useState("");
  const [tokenDept, setTokenDept] = useState<Department>("general_medicine");
  const [tokenPriority, setTokenPriority] = useState(false);
  const [tokenSymptoms, setTokenSymptoms] = useState("");

  // Success message banner
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const loadDashboardData = () => {
    if (typeof window === "undefined") return;
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "hospital") {
        router.push("/auth/hospital/login");
        return;
      }
      setUser(parsedUser);
      setSelectedLanguage(parsedUser.preferredLanguage || "en");
    } else {
      router.push("/auth/hospital/login");
      return;
    }

    // Load live visits and doctors
    const allVisits = visitManager.getVisits();
    setVisits(allVisits);
    const docs = hospitalManager.getDoctors();
    setDoctors(docs);
  };

  useEffect(() => {
    loadDashboardData();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
    }
    router.push("/");
  };

  // Collect all tokens across departments
  const [refreshTokenKey, setRefreshTokenKey] = useState(0);

  const allTokens = useMemo(() => {
    const list: Token[] = [];
    departments.forEach(dept => {
      const q = tokenManager.getDepartmentQueue(dept.id);
      list.push(...q.tokens);
    });
    return list.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  }, [visits, refreshTokenKey]);

  // Dynamic Metrics - Exact live counts based on queue status
  const stats = useMemo(() => {
    const waiting = allTokens.filter(t => t.status === "waiting" || t.status === "priority").length;
    const inConsult = allTokens.filter(t => t.status === "in_consultation").length;
    const completed = allTokens.filter(t => t.status === "completed").length;
    const totalPatients = allTokens.length + visits.length;
    const priorityCount = allTokens.filter(t => t.priority || t.status === "priority").length;

    return {
      totalPatients,
      waiting,
      inConsult,
      completed,
      priorityCount
    };
  }, [visits, allTokens]);

  // Token Status Actions
  const handleUpdateTokenStatus = (tokenId: string, status: "in_consultation" | "completed" | "skipped") => {
    tokenManager.updateTokenStatus(tokenId, status);
    setRefreshTokenKey(prev => prev + 1);
    setBannerMessage(`Token status updated to: ${status.toUpperCase().replace(/_/g, " ")}`);
    setTimeout(() => setBannerMessage(null), 3000);
    loadDashboardData();
  };

  const handleDeleteToken = (tokenId: string, tokenNumber?: string) => {
    if (confirm(`Are you sure you want to remove token ${tokenNumber || tokenId} from the queue?`)) {
      const success = tokenManager.deleteToken(tokenId);
      if (success) {
        setRefreshTokenKey(prev => prev + 1);
        setBannerMessage(`Token ${tokenNumber || ""} removed from queue successfully.`);
        setTimeout(() => setBannerMessage(null), 3000);
        loadDashboardData();
      }
    }
  };

  const handleDeletePatientRecord = (visitId: string, patientName: string) => {
    if (confirm(`Are you sure you want to delete patient record for "${patientName}" from the directory?`)) {
      const success = visitManager.deleteVisit(visitId);
      if (success) {
        setRefreshTokenKey(prev => prev + 1);
        setBannerMessage(`Patient record for "${patientName}" deleted successfully.`);
        setTimeout(() => setBannerMessage(null), 3000);
        loadDashboardData();
      }
    }
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newDocEmail) {
      alert("Please enter doctor name and email.");
      return;
    }

    hospitalManager.addDoctor({
      name: newDocName.startsWith("Dr.") ? newDocName : `Dr. ${newDocName}`,
      email: newDocEmail,
      department: newDocDept,
      specialization: newDocSpec || "Senior Consultant",
      hospitalId: user?.id || "hosp-civil-ahmedabad",
      hospitalName: user?.hospitalName || "Civil Hospital MediCity",
      nmcRegistrationNumber: newDocNmc || `G-${Math.floor(10000 + Math.random() * 90000)}-GUJ`,
      experience: newDocExp || "8+ Years",
      qualification: "MBBS, MD",
      opdRoom: newDocRoom || "OPD Room 108",
      status: "available",
      contact: "+91 98250 " + Math.floor(10000 + Math.random() * 90000)
    });

    setDoctors(hospitalManager.getDoctors());
    setShowAddDoctorModal(false);
    setNewDocName("");
    setNewDocEmail("");
    setNewDocSpec("");
    setBannerMessage("New Doctor registered successfully to hospital registry.");
    setTimeout(() => setBannerMessage(null), 3000);
  };

  const handleIssueTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenPatientName) {
      alert("Please provide patient name.");
      return;
    }

    const patientId = tokenPatientId || `PAT-${Date.now()}`;
    const symptoms = tokenSymptoms ? tokenSymptoms.split(",").map(s => s.trim()) : ["Routine Consultation Intake"];

    const issuedToken = tokenManager.issueToken(
      patientId,
      tokenPatientName,
      tokenDept,
      tokenPriority,
      symptoms
    );

    // Persist visit record
    visitManager.createVisitFromIntake({
      patientId,
      patientName: tokenPatientName,
      type: tokenDept === "ayurveda" ? "ayush" : "allopathic",
      department: tokenDept.replace(/_/g, " ").toUpperCase(),
      tokenId: issuedToken.id,
      tokenNumber: issuedToken.tokenNumber,
      hospitalName: user?.hospitalName || "Civil Hospital MediCity",
      priorityFlags: tokenPriority ? [{ symptom: "Urgent Triage Request", severity: "high", message: "Flagged by Desk" }] : []
    });

    setShowIssueTokenModal(false);
    setTokenPatientName("");
    setTokenPatientId("");
    setTokenSymptoms("");
    setTokenPriority(false);
    setRefreshTokenKey(prev => prev + 1);
    setBannerMessage(`OPD Token ${issuedToken.tokenNumber} issued successfully.`);
    setTimeout(() => setBannerMessage(null), 3500);
    loadDashboardData();
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading Hospital Admin Session...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Hospital Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold shadow-xs">
              <Building2 className="w-6 h-6 animate-heartbeat-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-base sm:text-lg">{user.hospitalName}</span>
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
                {user.abhaCertified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> ABDM Node
                  </span>
                )}
              </div>
              <div className="text-xs text-muted flex items-center gap-2">
                <span>{user.hospitalRegistrationNumber || "REG-GUJ-HOSP-2026"}</span>
                <span>•</span>
                <span className="capitalize font-medium text-foreground">{user.adminRole || "Super Admin"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowIssueTokenModal(true)}
              className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Issue OPD Token
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-muted hover:text-foreground flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto border-t border-border/60 pt-1">
          {[
            { id: "dashboard", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: "tokens", label: "Live OPD Queue", icon: <Clock className="w-4 h-4" /> },
            { id: "doctors", label: "Doctor Registry", icon: <Users className="w-4 h-4" /> },
            { id: "departments", label: "Clinical Wings", icon: <Building2 className="w-4 h-4" /> },
            { id: "patients", label: "Patient Directory", icon: <Activity className="w-4 h-4" /> },
            { id: "analytics", label: "OPD Analytics", icon: <TrendingUp className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Banner Feedback Alert */}
      {bannerMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs sm:text-sm font-medium animate-fade-in-up flex items-center justify-center gap-2 shadow-md">
          <CheckCircle className="w-4 h-4" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* ===================== 1. TAB: DASHBOARD OVERVIEW ===================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Real-time KPI Stats Cards with Click-to-View details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => {
                  setActiveTab("patients");
                }}
                title="Click to view all Registered Patients Directory"
              >
                <div className="portal-glow-inner p-4 flex items-center justify-between relative overflow-hidden group">
                  <div className="glow-blob bg-teal-500" />
                  <div className="z-10">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{stats.totalPatients}</div>
                    <div className="text-xs text-muted font-medium mt-0.5 flex items-center gap-1">
                      <span>Total Registered</span>
                      <span className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all z-10">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => {
                  setSelectedDeptFilter("all");
                  setTokenStatusFilter("waiting");
                  setActiveTab("tokens");
                }}
                title="Click to view Waiting OPD Queue list"
              >
                <div className="portal-glow-inner p-4 flex items-center justify-between relative overflow-hidden group">
                  <div className="glow-blob bg-amber-500" />
                  <div className="z-10">
                    <div className="text-2xl sm:text-3xl font-bold text-amber-500 group-hover:scale-105 transition-transform">{stats.waiting}</div>
                    <div className="text-xs text-muted font-medium mt-0.5 flex items-center gap-1">
                      <span>Waiting in OPD</span>
                      <span className="text-[10px] text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all z-10">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => {
                  setSelectedDeptFilter("all");
                  setTokenStatusFilter("in_consultation");
                  setActiveTab("tokens");
                }}
                title="Click to view Patients in Doctor Consultation"
              >
                <div className="portal-glow-inner p-4 flex items-center justify-between relative overflow-hidden group">
                  <div className="glow-blob bg-sky-500" />
                  <div className="z-10">
                    <div className="text-2xl sm:text-3xl font-bold text-sky-500 group-hover:scale-105 transition-transform">{stats.inConsult}</div>
                    <div className="text-xs text-muted font-medium mt-0.5 flex items-center gap-1">
                      <span>In Consultation</span>
                      <span className="text-[10px] text-sky-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all z-10">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => {
                  setSelectedDeptFilter("all");
                  setTokenStatusFilter("completed");
                  setActiveTab("tokens");
                }}
                title="Click to view Completed Consultations"
              >
                <div className="portal-glow-inner p-4 flex items-center justify-between relative overflow-hidden group">
                  <div className="glow-blob bg-emerald-500" />
                  <div className="z-10">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-500 group-hover:scale-105 transition-transform">{stats.completed}</div>
                    <div className="text-xs text-muted font-medium mt-0.5 flex items-center gap-1">
                      <span>Completed</span>
                      <span className="text-[10px] text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all z-10">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hospital Facility Status Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border bg-surface p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted uppercase font-bold">Bed Availability</div>
                    <div className="text-lg font-bold text-foreground">
                      {user.availableBeds || 450} / {user.totalBeds || 2800} Available
                    </div>
                  </div>
                </div>
                <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: "82%" }} />
                </div>
                <div className="flex justify-between text-[11px] text-muted mt-1.5">
                  <span>Occupancy: 82%</span>
                  <span className="text-indigo-400 font-semibold">ICU Free: {user.icuAvailable || 48} Beds</span>
                </div>
              </Card>

              <Card className="border border-border bg-surface p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted uppercase font-bold">Attending Specialists</div>
                    <div className="text-lg font-bold text-foreground">
                      {doctors.filter(d => d.status === "in_opd" || d.status === "available").length} Doctors On Duty
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted flex items-center justify-between">
                  <span>Total Roster: {doctors.length} Doctors</span>
                  <button onClick={() => setActiveTab("doctors")} className="text-primary font-bold hover:underline">
                    Manage Roster →
                  </button>
                </div>
              </Card>

              <Card className="border border-border bg-surface p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-muted uppercase font-bold mb-1">ABDM Health Cloud Sync</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                    <CheckCircle className="w-4 h-4" /> Live Connected to NDHM / MoA
                  </div>
                  <div className="text-xs text-muted mt-1">Real-time token and electronic health record streaming.</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setActiveTab("tokens")} className="mt-2 text-xs">
                  View Live Tokens Queue →
                </Button>
              </Card>
            </div>

            {/* Quick Live Token Activity Stream */}
            <Card className="border border-border bg-surface">
              <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Active Queue Live Stream
                </CardTitle>
                <Button size="sm" onClick={() => setShowIssueTokenModal(true)} className="text-xs bg-primary text-primary-foreground">
                  <Plus className="w-3.5 h-3.5 mr-1" /> New Token
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {allTokens.length === 0 ? (
                  <div className="p-8 text-center text-muted text-xs">No active tokens in queue today.</div>
                ) : (
                  <div className="divide-y divide-border max-h-[380px] overflow-y-auto">
                    {allTokens.slice(0, 8).map(token => (
                      <div key={token.id} className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="text-base sm:text-lg font-mono font-extrabold px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                            {token.tokenNumber}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-foreground flex items-center gap-2">
                              <span>{token.patientName}</span>
                              {token.priority && (
                                <span className="px-1.5 py-0.2 bg-rose-500/10 text-rose-600 text-[10px] font-bold rounded-full border border-rose-500/30">
                                  PRIORITY
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                              <span className="capitalize">{token.department.replace(/_/g, " ")}</span>
                              <span>•</span>
                              <span>Issued {new Date(token.issuedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {token.status === "waiting" && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTokenStatus(token.id, "in_consultation")}
                              className="bg-sky-600 hover:bg-sky-700 text-white text-xs cursor-pointer"
                            >
                              Call to OPD
                            </Button>
                          )}
                          {token.status === "in_consultation" && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTokenStatus(token.id, "completed")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                            >
                              Complete
                            </Button>
                          )}
                          {token.status === "completed" && (
                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Done
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteToken(token.id, token.tokenNumber)}
                            className="text-destructive hover:bg-destructive/10 p-1.5 h-8 w-8 cursor-pointer"
                            title="Remove token from queue"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================== 2. TAB: LIVE OPD QUEUE TOKENS ===================== */}
        {activeTab === "tokens" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">OPD Token Queue & Triage Desk</h2>
                <p className="text-xs text-muted">Issue, route, prioritize, and manage live patient tokens across all departments</p>
              </div>
              <Button onClick={() => setShowIssueTokenModal(true)} className="bg-primary text-primary-foreground font-semibold text-xs">
                <Plus className="w-4 h-4 mr-1.5" /> Issue New Patient Token
              </Button>
            </div>

            {/* Status & Department Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-border">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-bold text-muted uppercase mr-1">Status:</span>
                {[
                  { id: "all", label: "All Statuses", count: allTokens.length },
                  { id: "waiting", label: "Waiting", count: stats.waiting },
                  { id: "in_consultation", label: "In OPD", count: stats.inConsult },
                  { id: "completed", label: "Completed", count: stats.completed },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setTokenStatusFilter(st.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      tokenStatusFilter === st.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-background border border-border text-muted hover:text-foreground"
                    }`}
                  >
                    {st.label} ({st.count})
                  </button>
                ))}
              </div>

              {/* Reset Filters */}
              {(tokenStatusFilter !== "all" || selectedDeptFilter !== "all") && (
                <button
                  onClick={() => {
                    setTokenStatusFilter("all");
                    setSelectedDeptFilter("all");
                  }}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 self-end sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>

            {/* Department Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedDeptFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedDeptFilter === "all" ? "bg-primary text-primary-foreground" : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                All Departments ({allTokens.length})
              </button>
              {departments.map(dept => {
                const count = allTokens.filter(t => t.department === dept.id).length;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDeptFilter(dept.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                      selectedDeptFilter === dept.id ? "bg-primary text-primary-foreground" : "bg-surface border border-border text-muted hover:text-foreground"
                    }`}
                  >
                    <span>{dept.icon}</span>
                    <span>{dept.name} ({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Token Cards Grid */}
            {allTokens
              .filter(t => selectedDeptFilter === "all" || t.department === selectedDeptFilter)
              .filter(t => {
                if (tokenStatusFilter === "all") return true;
                if (tokenStatusFilter === "waiting") return t.status === "waiting" || t.status === "priority";
                if (tokenStatusFilter === "in_consultation") return t.status === "in_consultation";
                if (tokenStatusFilter === "completed") return t.status === "completed";
                return true;
              }).length === 0 ? (
              <div className="p-8 text-center bg-surface rounded-2xl border border-dashed border-border text-muted">
                <Clock className="w-10 h-10 mx-auto mb-2 text-muted opacity-40" />
                <div className="font-bold text-foreground">No tokens match the selected status or department.</div>
                <button
                  onClick={() => {
                    setTokenStatusFilter("all");
                    setSelectedDeptFilter("all");
                  }}
                  className="mt-2 text-xs text-primary font-bold hover:underline"
                >
                  Clear Filters & Show All
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTokens
                .filter(t => selectedDeptFilter === "all" || t.department === selectedDeptFilter)
                .filter(t => {
                  if (tokenStatusFilter === "all") return true;
                  if (tokenStatusFilter === "waiting") return t.status === "waiting" || t.status === "priority";
                  if (tokenStatusFilter === "in_consultation") return t.status === "in_consultation";
                  if (tokenStatusFilter === "completed") return t.status === "completed";
                  return true;
                })
                .map(token => (
                  <Card
                    key={token.id}
                    className="border border-border bg-surface hover:border-primary/40 transition-all shadow-xs cursor-pointer group"
                    onClick={() => setSelectedTokenDetails(token)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-mono font-extrabold text-primary px-3 py-1 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {token.tokenNumber}
                        </div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          token.status === "priority" || token.priority
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                            : token.status === "in_consultation"
                            ? "bg-sky-500/10 text-sky-600 border border-sky-500/30"
                            : token.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                        }`}>
                          {token.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-foreground text-sm flex items-center justify-between">
                          <span>{token.patientName}</span>
                          <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Details →</span>
                        </div>
                        <div className="text-xs text-muted mt-0.5">Patient ID: {token.patientId}</div>
                        <div className="text-xs text-primary font-medium mt-0.5 capitalize">
                          Dept: {token.department.replace(/_/g, " ")}
                        </div>
                      </div>

                      {token.symptoms && token.symptoms.length > 0 && (
                        <div className="text-xs bg-muted/20 p-2 rounded-lg text-muted">
                          <strong>Chief Symptoms:</strong> {token.symptoms.join(", ")}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-muted border-t border-border/60 pt-2">
                        <span>Issued: {new Date(token.issuedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <span>Est: ~{token.estimatedWaitTime || 10} Mins</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                        {token.status !== "in_consultation" && token.status !== "completed" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateTokenStatus(token.id, "in_consultation")}
                            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-xs cursor-pointer"
                          >
                            Call Patient
                          </Button>
                        )}
                        {token.status !== "completed" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateTokenStatus(token.id, "completed")}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                          >
                            Mark Done
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTokenStatus(token.id, "skipped")}
                          className="text-xs text-muted cursor-pointer"
                        >
                          Skip
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteToken(token.id, token.tokenNumber)}
                          className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 px-2.5 cursor-pointer"
                          title="Delete / Cancel Token"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            )}
          </div>
        )}

        {/* ===================== 3. TAB: DOCTOR ROSTER & REGISTRY ===================== */}
        {activeTab === "doctors" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">Medical Specialists & OPD Roster</h2>
                <p className="text-xs text-muted">Manage active doctors, room assignments, and clinical status</p>
              </div>
              <Button onClick={() => setShowAddDoctorModal(true)} className="bg-primary text-primary-foreground font-semibold text-xs">
                <Plus className="w-4 h-4 mr-1.5" /> Add Doctor to Roster
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doc => (
                <Card key={doc.id} className="border border-border bg-surface hover:border-primary/40 transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-base">{doc.name}</div>
                          <div className="text-xs text-primary font-medium">{doc.specialization}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        doc.status === "available"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : doc.status === "in_opd"
                          ? "bg-sky-500/10 text-sky-600 border border-sky-500/30"
                          : "bg-muted text-muted"
                      }`}>
                        {doc.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted bg-background/50 p-3 rounded-xl border border-border">
                      <div className="flex justify-between">
                        <span>NMC Reg:</span>
                        <span className="font-semibold text-foreground">{doc.nmcRegistrationNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OPD Room:</span>
                        <span className="font-semibold text-foreground">{doc.opdRoom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="font-semibold text-foreground">{doc.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patients Seen Today:</span>
                        <span className="font-semibold text-emerald-600">{doc.patientsSeenToday || 14}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-muted flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {doc.email}
                      </span>
                      <div className="flex items-center gap-1">
                        <select
                          value={doc.status}
                          onChange={(e) => {
                            hospitalManager.updateDoctorStatus(doc.id, e.target.value as any);
                            setDoctors(hospitalManager.getDoctors());
                          }}
                          className="text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none"
                        >
                          <option value="available">Available</option>
                          <option value="in_opd">In OPD</option>
                          <option value="on_break">On Break</option>
                          <option value="off_duty">Off Duty</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ===================== 4. TAB: CLINICAL WINGS & DEPARTMENTS ===================== */}
        {activeTab === "departments" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Clinical Wings & Specialized Centers</h2>
              <p className="text-xs text-muted">Department status, doctor allocation, and live patient queue loads</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => {
                const deptTokens = allTokens.filter(t => t.department === dept.id);
                const deptWaiting = deptTokens.filter(t => t.status === "waiting" || t.status === "priority").length;
                const deptCompleted = deptTokens.filter(t => t.status === "completed").length;
                const deptDocs = doctors.filter(d => d.department === dept.id);

                return (
                  <Card key={dept.id} className="border border-border bg-surface p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{dept.icon}</span>
                        <div>
                          <div className="font-bold text-foreground text-base">{dept.name}</div>
                          <div className="text-xs text-muted">{deptDocs.length} Specialists Assigned</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center bg-background/50 p-2.5 rounded-xl border border-border">
                      <div>
                        <div className="text-base font-bold text-amber-500">{deptWaiting}</div>
                        <div className="text-[10px] text-muted">Waiting</div>
                      </div>
                      <div>
                        <div className="text-base font-bold text-sky-500">{deptTokens.filter(t => t.status === "in_consultation").length}</div>
                        <div className="text-[10px] text-muted">In OPD</div>
                      </div>
                      <div>
                        <div className="text-base font-bold text-emerald-500">{deptCompleted}</div>
                        <div className="text-[10px] text-muted">Done</div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedDeptFilter(dept.id);
                        setActiveTab("tokens");
                      }}
                      className="w-full text-xs"
                    >
                      View Department Queue ({deptTokens.length})
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== 5. TAB: PATIENT DIRECTORY ===================== */}
        {activeTab === "patients" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">Registered Patient In-Take Records</h2>
                <p className="text-xs text-muted">Consolidated database of triage cases, AYUSH assessments, and OPD entries</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient name..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <Card className="border border-border bg-surface">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {visits
                    .filter(v => searchQuery ? v.patientName.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    .map(visit => (
                      <div
                        key={visit.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/10 cursor-pointer transition-colors"
                        onClick={() => setSelectedVisitDetails(visit)}
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-foreground text-sm flex items-center gap-2">
                            <span className="hover:text-primary transition-colors">{visit.patientName}</span>
                            <span className="text-xs font-mono px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                              {visit.tokenNumber || "OPD"}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-muted rounded-full">
                              {visit.type}
                            </span>
                          </div>
                          <div className="text-xs text-muted flex items-center gap-2">
                            <span>Dept: {visit.department}</span>
                            <span>•</span>
                            <span>Date: {new Date(visit.date).toLocaleDateString()}</span>
                          </div>
                          {visit.symptoms && visit.symptoms.length > 0 && (
                            <div className="text-xs text-muted">
                              Symptoms: {visit.symptoms.map(s => s.name).join(", ")}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedVisitDetails(visit)}
                            className="text-xs h-8"
                          >
                            View Case Details
                          </Button>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            visit.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {visit.status.toUpperCase()}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeletePatientRecord(visit.id, visit.patientName)}
                            className="text-destructive hover:bg-destructive/10 p-1.5 h-8 w-8 cursor-pointer"
                            title="Delete patient record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================== 6. TAB: ANALYTICS & TRIAGE ===================== */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">OPD Flow & Triage Health Metrics</h2>
              <p className="text-xs text-muted">Patient intake metrics, wait times, and AYUSH vs Allopathic distribution</p>
            </div>

            {/* Top Stat Overview Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-border bg-surface p-4">
                <div className="text-xs text-muted font-medium">Total Registered Tokens</div>
                <div className="text-2xl font-black text-foreground mt-1">{stats.totalPatients}</div>
                <div className="text-[11px] text-emerald-600 mt-0.5">Across all 12 OPD clinical wings</div>
              </Card>

              <Card className="border border-border bg-surface p-4">
                <div className="text-xs text-muted font-medium">Priority / Emergency Triage</div>
                <div className="text-2xl font-black text-rose-600 mt-1">{stats.priorityCount}</div>
                <div className="text-[11px] text-rose-500 mt-0.5">Fast-tracked directly to consultants</div>
              </Card>

              <Card className="border border-border bg-surface p-4">
                <div className="text-xs text-muted font-medium">Average OPD Wait Time</div>
                <div className="text-2xl font-black text-amber-500 mt-1">11 Mins</div>
                <div className="text-[11px] text-muted mt-0.5">Reduced by 68% via Kiosk Token Engine</div>
              </Card>

              <Card className="border border-border bg-surface p-4">
                <div className="text-xs text-muted font-medium">ABDM Digital Health Record Sync</div>
                <div className="text-2xl font-black text-primary mt-1">100%</div>
                <div className="text-[11px] text-emerald-600 mt-0.5">ABHA Linked Case Files</div>
              </Card>
            </div>

            {/* Department-wise OPD Queue Breakdown */}
            <Card className="border border-border bg-surface">
              <CardHeader className="p-4 border-b border-border">
                <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
                  <span>Clinical Wing Intake & Queue Distribution</span>
                  <span className="text-xs text-muted font-normal">Live queue load per wing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {departments.map(dept => {
                    const deptTokens = allTokens.filter(t => t.department === dept.id);
                    const waitingCount = deptTokens.filter(t => t.status === "waiting" || t.status === "priority").length;
                    const inConsultCount = deptTokens.filter(t => t.status === "in_consultation").length;
                    const completedCount = deptTokens.filter(t => t.status === "completed").length;

                    return (
                      <div key={dept.id} className="p-3.5 bg-background rounded-xl border border-border flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{dept.icon}</span>
                            <span className="font-bold text-xs text-foreground">{dept.name}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {deptTokens.length} Total
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                          <div className="bg-surface p-1.5 rounded-lg border border-border/60">
                            <div className="font-bold text-amber-500">{waitingCount}</div>
                            <div className="text-[10px] text-muted">Waiting</div>
                          </div>
                          <div className="bg-surface p-1.5 rounded-lg border border-border/60">
                            <div className="font-bold text-sky-500">{inConsultCount}</div>
                            <div className="text-[10px] text-muted">In OPD</div>
                          </div>
                          <div className="bg-surface p-1.5 rounded-lg border border-border/60">
                            <div className="font-bold text-emerald-500">{completedCount}</div>
                            <div className="text-[10px] text-muted">Done</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border bg-surface p-5 text-center">
                <div className="text-3xl font-extrabold text-primary mb-1">9.4 Mins</div>
                <div className="text-xs font-semibold text-foreground">Average Triage-to-Consult Time</div>
                <div className="text-[11px] text-muted mt-1">Well within 15-minute national OPD benchmark</div>
              </Card>

              <Card className="border border-border bg-surface p-5 text-center">
                <div className="text-3xl font-extrabold text-emerald-600 mb-1">96.8%</div>
                <div className="text-xs font-semibold text-foreground">Patient Satisfaction Rating</div>
                <div className="text-[11px] text-muted mt-1">Based on digital kiosk departure ratings</div>
              </Card>

              <Card className="border border-border bg-surface p-5 text-center">
                <div className="text-3xl font-extrabold text-indigo-600 mb-1">42% : 58%</div>
                <div className="text-xs font-semibold text-foreground">AYUSH to Allopathic Routing</div>
                <div className="text-[11px] text-muted mt-1">Integrative care adoption index</div>
              </Card>
            </div>
          </div>
        )}

      </div>

      {/* ===================== MODAL: ISSUE NEW OPD TOKEN ===================== */}
      {showIssueTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-foreground text-base">
                <Plus className="w-5 h-5 text-primary" /> Issue Hospital OPD Token
              </div>
              <button onClick={() => setShowIssueTokenModal(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueTokenSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={tokenPatientName}
                  onChange={(e) => setTokenPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Clinical Department *</label>
                  <select
                    value={tokenDept}
                    onChange={(e) => setTokenDept(e.target.value as any)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Patient ABHA / ID (Optional)</label>
                  <input
                    type="text"
                    value={tokenPatientId}
                    onChange={(e) => setTokenPatientId(e.target.value)}
                    placeholder="e.g. 91-4829-1029-44"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Primary Symptoms / Reason</label>
                <input
                  type="text"
                  value={tokenSymptoms}
                  onChange={(e) => setTokenSymptoms(e.target.value)}
                  placeholder="e.g. High fever, dry cough, weakness"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="tokenPriority"
                  checked={tokenPriority}
                  onChange={(e) => setTokenPriority(e.target.checked)}
                  className="w-4 h-4 rounded text-primary"
                />
                <label htmlFor="tokenPriority" className="font-semibold text-rose-600 cursor-pointer">
                  Urgent / Priority Triage (Move to Front of Queue)
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowIssueTokenModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-semibold">
                  Generate Token
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD DOCTOR TO ROSTER ===================== */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-foreground text-base">
                <Stethoscope className="w-5 h-5 text-primary" /> Add Doctor to Hospital Registry
              </div>
              <button onClick={() => setShowAddDoctorModal(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Dr. Hiren Dave"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={newDocEmail}
                    onChange={(e) => setNewDocEmail(e.target.value)}
                    placeholder="doctor@hospital.gov.in"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Department *</label>
                  <select
                    value={newDocDept}
                    onChange={(e) => setNewDocDept(e.target.value as any)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Specialization</label>
                  <input
                    type="text"
                    value={newDocSpec}
                    onChange={(e) => setNewDocSpec(e.target.value)}
                    placeholder="e.g. Interventional Cardiologist"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">NMC / State Reg No</label>
                  <input
                    type="text"
                    value={newDocNmc}
                    onChange={(e) => setNewDocNmc(e.target.value)}
                    placeholder="e.g. G-58210-GUJ"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">OPD Room Number</label>
                  <input
                    type="text"
                    value={newDocRoom}
                    onChange={(e) => setNewDocRoom(e.target.value)}
                    placeholder="e.g. Room 106, 1st Floor"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Clinical Experience</label>
                  <input
                    type="text"
                    value={newDocExp}
                    onChange={(e) => setNewDocExp(e.target.value)}
                    placeholder="e.g. 10+ Years"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowAddDoctorModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-semibold">
                  Register Doctor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: TOKEN DETAILS DIALOG ===================== */}
      {selectedTokenDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-foreground text-base">
                <Clock className="w-5 h-5 text-primary" /> OPD Token Details: {selectedTokenDetails.tokenNumber}
              </div>
              <button onClick={() => setSelectedTokenDetails(null)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
                <div>
                  <div className="text-[10px] text-muted uppercase font-bold">Token Number</div>
                  <div className="text-2xl font-black font-mono text-primary">{selectedTokenDetails.tokenNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted uppercase font-bold">Status</div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase ${
                    selectedTokenDetails.status === "priority" || selectedTokenDetails.priority
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                      : selectedTokenDetails.status === "in_consultation"
                      ? "bg-sky-500/10 text-sky-600 border border-sky-500/30"
                      : selectedTokenDetails.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                  }`}>
                    {selectedTokenDetails.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-background rounded-xl border border-border">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Patient Name</span>
                  <span className="font-bold text-foreground text-sm">{selectedTokenDetails.patientName}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Patient ID</span>
                  <span className="font-mono text-foreground">{selectedTokenDetails.patientId}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Department</span>
                  <span className="font-semibold text-primary capitalize">{selectedTokenDetails.department.replace(/_/g, " ")}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Priority Level</span>
                  <span className="font-bold">{selectedTokenDetails.priority ? "High (Fast-Track)" : "Normal"}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Issued Time</span>
                  <span className="text-foreground">{new Date(selectedTokenDetails.issuedAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Est. Wait Time</span>
                  <span className="text-foreground font-semibold">~{selectedTokenDetails.estimatedWaitTime || 10} Mins</span>
                </div>
              </div>

              {selectedTokenDetails.symptoms && selectedTokenDetails.symptoms.length > 0 && (
                <div className="p-3 bg-background rounded-xl border border-border">
                  <span className="text-muted block text-[10px] uppercase font-bold mb-1">Chief Symptoms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTokenDetails.symptoms.map((sym, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-surface text-foreground font-medium rounded-md border border-border">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selectedTokenDetails.status !== "in_consultation" && selectedTokenDetails.status !== "completed" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleUpdateTokenStatus(selectedTokenDetails.id, "in_consultation");
                      setSelectedTokenDetails(null);
                    }}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white"
                  >
                    Call to OPD
                  </Button>
                )}
                {selectedTokenDetails.status !== "completed" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleUpdateTokenStatus(selectedTokenDetails.id, "completed");
                      setSelectedTokenDetails(null);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Mark Done
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTokenDetails(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: PATIENT VISIT CASE DETAILS ===================== */}
      {selectedVisitDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-foreground text-base">
                <Activity className="w-5 h-5 text-primary" /> Case Intake Record: {selectedVisitDetails.patientName}
              </div>
              <button onClick={() => setSelectedVisitDetails(null)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-background rounded-xl border border-border">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Patient Name</span>
                  <span className="font-bold text-foreground text-sm">{selectedVisitDetails.patientName}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Token</span>
                  <span className="font-mono font-bold text-primary">{selectedVisitDetails.tokenNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Type</span>
                  <span className="font-bold uppercase text-foreground">{selectedVisitDetails.type}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Department</span>
                  <span className="capitalize text-foreground font-semibold">{selectedVisitDetails.department}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Date Recorded</span>
                  <span className="text-foreground">{new Date(selectedVisitDetails.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Status</span>
                  <span className={`font-bold uppercase ${
                    selectedVisitDetails.status === "completed" ? "text-emerald-600" : "text-amber-600"
                  }`}>
                    {selectedVisitDetails.status}
                  </span>
                </div>
              </div>

              {selectedVisitDetails.symptoms && selectedVisitDetails.symptoms.length > 0 && (
                <div className="p-3 bg-background rounded-xl border border-border space-y-2">
                  <span className="text-muted block text-[10px] uppercase font-bold">Documented Symptoms & Severities</span>
                  <div className="space-y-1.5">
                    {selectedVisitDetails.symptoms.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-surface rounded-lg border border-border">
                        <span className="font-medium text-foreground">{s.name}</span>
                        <div className="flex items-center gap-2">
                          {s.notes && <span className="text-muted text-[11px]">{s.notes}</span>}
                          {s.severity !== undefined && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.severity >= 7
                                ? "bg-rose-500/10 text-rose-600"
                                : s.severity >= 4
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-emerald-500/10 text-emerald-600"
                            }`}>
                              Severity: {s.severity}/10
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVisitDetails.vitalSigns && (
                <div className="p-3 bg-background rounded-xl border border-border">
                  <span className="text-muted block text-[10px] uppercase font-bold mb-1">Vitals on Intake</span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {selectedVisitDetails.vitalSigns.bp && (
                      <div className="p-1.5 bg-surface rounded-lg border border-border">
                        <div className="font-bold text-foreground">{selectedVisitDetails.vitalSigns.bp}</div>
                        <div className="text-[10px] text-muted">BP</div>
                      </div>
                    )}
                    {selectedVisitDetails.vitalSigns.pulse && (
                      <div className="p-1.5 bg-surface rounded-lg border border-border">
                        <div className="font-bold text-foreground">{selectedVisitDetails.vitalSigns.pulse} bpm</div>
                        <div className="text-[10px] text-muted">Pulse</div>
                      </div>
                    )}
                    {selectedVisitDetails.vitalSigns.spo2 && (
                      <div className="p-1.5 bg-surface rounded-lg border border-border">
                        <div className="font-bold text-foreground">{selectedVisitDetails.vitalSigns.spo2}%</div>
                        <div className="text-[10px] text-muted">SpO2</div>
                      </div>
                    )}
                    {selectedVisitDetails.vitalSigns.temperature && (
                      <div className="p-1.5 bg-surface rounded-lg border border-border">
                        <div className="font-bold text-foreground">{selectedVisitDetails.vitalSigns.temperature}</div>
                        <div className="text-[10px] text-muted">Temp</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedVisitDetails.diagnosisNotes && (
                <div className="p-3 bg-background rounded-xl border border-border">
                  <span className="text-muted block text-[10px] uppercase font-bold mb-1">Clinical Intake / Diagnosis Notes</span>
                  <p className="text-foreground">{selectedVisitDetails.diagnosisNotes}</p>
                </div>
              )}

              {selectedVisitDetails.prescriptions && selectedVisitDetails.prescriptions.length > 0 && (
                <div className="p-3 bg-background rounded-xl border border-border">
                  <span className="text-muted block text-[10px] uppercase font-bold mb-1">Prescribed Rx</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVisitDetails.prescriptions.map((rx, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-surface text-foreground font-medium rounded-md border border-border">
                        {rx}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedVisitDetails(null)}
                >
                  Close Record
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
