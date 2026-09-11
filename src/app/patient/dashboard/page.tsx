"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, FileText, Clock, Building2, Shield, Leaf, Plus, Activity, CalendarCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PatientNav } from "@/components/patient/PatientNav";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { visitManager } from "@/lib/visitManager";
import { tokenManager } from "@/lib/tokenManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { InlineGuideBanner } from "@/components/ui/InlineGuideBanner";

export default function PatientDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [recentVisitsCount, setRecentVisitsCount] = useState(0);
  const [activeTokens, setActiveTokens] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const visits = visitManager.getVisits(parsedUser.id);
        setRecentVisitsCount(visits.length);

        const tokens = tokenManager.getTokensByPatient(parsedUser.id);
        setActiveTokens(tokens.filter(t => t.status === "waiting" || t.status === "priority" || t.status === "in_consultation"));
      } else {
        router.push("/");
      }
    }
  }, [router]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PatientHeader user={user} />

      {/* Navigation Bar */}
      <div className="max-w-7xl w-full mx-auto px-4 pt-2">
        <PatientNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Active Queue Token Banner (if any) */}
          {activeTokens.length > 0 && (
            <Card className="border-2 border-primary bg-primary/10 shadow-sm animate-pulse">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground font-black text-xl flex items-center justify-center">
                    {activeTokens[0].tokenNumber}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Active OPD Token: {activeTokens[0].tokenNumber}</div>
                    <div className="text-xs text-muted">
                      Department: <strong className="uppercase">{activeTokens[0].department.replace(/_/g, " ")}</strong> • Status: <span className="font-semibold text-primary">{activeTokens[0].status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push("/patient/visits")}
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  Track Token
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Welcome & Primary CTA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2 border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-background p-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("fast_track_opd")}</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                    {t("start_new_intake")}
                  </h2>
                  <p className="text-sm text-muted mt-1 max-w-lg">
                    {t("intake_desc")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground font-bold shadow-md h-12 px-6"
                    onClick={() => router.push("/patient/new-visit")}
                  >
                    <Plus className="mr-2 w-5 h-5" />
                    {t("new_allopathic_visit")}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/40 hover:bg-primary/5 font-bold h-12 px-6"
                    onClick={() => router.push("/patient/ayush")}
                  >
                    <Leaf className="mr-2 w-5 h-5 text-emerald-600" />
                    {t("ayush_consultation")}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border border-border p-6 flex flex-col justify-between bg-surface">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Activity className="w-4 h-4" /> {t("health_overview")}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 rounded-lg bg-background border border-border text-center">
                    <div className="text-2xl font-black text-foreground">{recentVisitsCount}</div>
                    <div className="text-[11px] text-muted">{t("recorded_visits")}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-background border border-border text-center">
                    <div className="text-2xl font-black text-foreground">ABHA</div>
                    <div className="text-[11px] text-emerald-600 font-semibold">{t("active_and_synced")}</div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-primary font-semibold mt-4"
                onClick={() => router.push("/patient/timeline")}
              >
                {t("view_full_timeline")}
              </Button>
            </Card>
          </div>

          {/* Inline Step-by-Step Portal Walkthrough */}
          <InlineGuideBanner
            title="How to Use Your Patient Portal"
            subtitle="Follow these 4 simple steps to triage, get OPD tokens, manage records, and track doctor visits"
            steps={[
              {
                stepNumber: 1,
                badge: "Fast-Track Intake",
                title: "1. Start Triage / Token",
                description: "Click 'New Allopathic Visit' or 'AYUSH Consultation' to log symptoms and get your OPD queue token.",
                actionText: "Start Intake",
                actionHref: "/patient/new-visit"
              },
              {
                stepNumber: 2,
                badge: "ABDM Registry",
                title: "2. Explore Hospitals",
                description: "Check live OPD wait times, on-duty doctors, and ICU bed availability in national hospitals.",
                actionText: "View Hospitals",
                actionHref: "/patient/hospitals"
              },
              {
                stepNumber: 3,
                badge: "Clinical OCR",
                title: "3. Upload Documents",
                description: "Upload past test reports & prescriptions. AI will analyze lab values and highlight deficiencies.",
                actionText: "Upload Records",
                actionHref: "/patient/documents"
              },
              {
                stepNumber: 4,
                badge: "Longitudinal Care",
                title: "4. Health Timeline",
                description: "Review all your past consultations, doctor remarks, and issued digital prescriptions.",
                actionText: "Open Timeline",
                actionHref: "/patient/timeline"
              }
            ]}
          />

          {/* Quick Hub Navigation Cards */}
          <div>
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-primary" /> {t("patient_services_hub")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

              {/* My Visits */}
              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => router.push("/patient/visits")}
              >
                <div className="portal-glow-inner p-5 flex flex-col items-center text-center space-y-2.5 relative overflow-hidden group">
                  <div className="glow-blob bg-teal-500" />
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs z-10">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="z-10">
                    <div className="font-bold text-foreground text-sm group-hover:text-teal-600 transition-colors">{t("my_visits")}</div>
                    <div className="text-[11px] text-muted">{t("consultation_history")}</div>
                  </div>
                </div>
              </div>

              {/* Records / Documents */}
              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => router.push("/patient/documents")}
              >
                <div className="portal-glow-inner p-5 flex flex-col items-center text-center space-y-2.5 relative overflow-hidden group">
                  <div className="glow-blob bg-blue-500" />
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs z-10">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="z-10">
                    <div className="font-bold text-foreground text-sm group-hover:text-blue-600 transition-colors">{t("records_ocr")}</div>
                    <div className="text-[11px] text-muted">{t("upload_reports")}</div>
                  </div>
                </div>
              </div>

              {/* Health Timeline */}
              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => router.push("/patient/timeline")}
              >
                <div className="portal-glow-inner p-5 flex flex-col items-center text-center space-y-2.5 relative overflow-hidden group">
                  <div className="glow-blob bg-amber-500" />
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs z-10">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="z-10">
                    <div className="font-bold text-foreground text-sm group-hover:text-amber-600 transition-colors">{t("timeline_title")}</div>
                    <div className="text-[11px] text-muted">{t("health_journey")}</div>
                  </div>
                </div>
              </div>

              {/* Connected Hospitals */}
              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => router.push("/patient/hospitals")}
              >
                <div className="portal-glow-inner p-5 flex flex-col items-center text-center space-y-2.5 relative overflow-hidden group">
                  <div className="glow-blob bg-indigo-500" />
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs z-10">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="z-10">
                    <div className="font-bold text-foreground text-sm group-hover:text-indigo-600 transition-colors">{t("connected_hospitals")}</div>
                    <div className="text-[11px] text-muted">{t("connected_providers")}</div>
                  </div>
                </div>
              </div>

              {/* AYUSH Center */}
              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => router.push("/patient/ayush")}
              >
                <div className="portal-glow-inner p-5 flex flex-col items-center text-center space-y-2.5 relative overflow-hidden group">
                  <div className="glow-blob bg-emerald-500" />
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs z-10">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div className="z-10">
                    <div className="font-bold text-foreground text-sm group-hover:text-emerald-600 transition-colors">{t("ayush_systems")}</div>
                    <div className="text-[11px] text-muted">{t("traditional_medicine")}</div>
                  </div>
                </div>
              </div>

              {/* Consent & Data Sharing */}
              <div
                className="portal-glow-card rounded-2xl p-[1.5px] cursor-pointer"
                onClick={() => router.push("/patient/consent")}
              >
                <div className="portal-glow-inner p-5 flex flex-col items-center text-center space-y-2.5 relative overflow-hidden group">
                  <div className="glow-blob bg-purple-500" />
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs z-10">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="z-10">
                    <div className="font-bold text-foreground text-sm group-hover:text-purple-600 transition-colors">{t("data_sharing")}</div>
                    <div className="text-[11px] text-muted">{t("consent_manager")}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
