"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientNav } from "@/components/patient/PatientNav";
import { visitManager, type PatientVisitRecord } from "@/lib/visitManager";
import { tokenManager } from "@/lib/tokenManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { InlineGuideBanner } from "@/components/ui/InlineGuideBanner";
import {
  FileText,
  Calendar,
  Clock,
  User,
  Building2,
  Stethoscope,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Activity,
  Pill
} from "lucide-react";

export default function PatientVisitsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [visits, setVisits] = useState<PatientVisitRecord[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<PatientVisitRecord[]>([]);
  const [selectedType, setSelectedType] = useState<"all" | "allopathic" | "ayush">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalVisit, setActiveModalVisit] = useState<PatientVisitRecord | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        const data = visitManager.getVisits(parsed.id);
        setVisits(data);
        setFilteredVisits(data);
      } else {
        router.push("/");
      }
    }
  }, [router]);

  useEffect(() => {
    let list = [...visits];
    if (selectedType !== "all") {
      list = list.filter(v => v.type === selectedType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(v =>
        v.department.toLowerCase().includes(q) ||
        v.hospitalName?.toLowerCase().includes(q) ||
        v.symptoms.some(s => s.name.toLowerCase().includes(q)) ||
        v.assignedDoctor?.toLowerCase().includes(q)
      );
    }
    setFilteredVisits(list);
  }, [selectedType, searchQuery, visits]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PatientHeader user={user} />

      <div className="max-w-7xl w-full mx-auto px-4 pt-2">
        <PatientNav />
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("my_visits_title")}</h1>
              <p className="text-sm text-muted">{t("my_visits_subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push("/patient/new-visit")}
                className="bg-primary text-primary-foreground font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" /> {t("new_allopathic_visit")}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/patient/ayush")}
              >
                {t("ayush_consultation")}
              </Button>
            </div>
          </div>

          {/* Inline Step Guide */}
          <InlineGuideBanner
            title="How to Review & Track Your Visits"
            subtitle="Access past consultation summaries, vital signs, tokens, and digital prescriptions"
            steps={[
              {
                stepNumber: 1,
                badge: "Filter & Search",
                title: "1. Filter by OPD Type",
                description: "Toggle between Allopathic (Modern Medicine) and AYUSH consultations or search by symptom."
              },
              {
                stepNumber: 2,
                badge: "Summary",
                title: "2. View Case Summary",
                description: "Click 'View Summary' to see blood pressure, triage priority, assigned doctor, and prescription notes."
              },
              {
                stepNumber: 3,
                badge: "Live Queue",
                title: "3. Live Token Status",
                description: "Active visits display current token numbers and queue status for hospital reception and doctor clinics."
              }
            ]}
          />

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_placeholder_visits")}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "allopathic", "ayush"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {type === "all" ? t("all_visits") : type}
                </button>
              ))}
            </div>
          </div>

          {/* Visits List */}
          {filteredVisits.length === 0 ? (
            <Card className="border-2 border-dashed border-border p-12 text-center">
              <FileText className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-foreground">{t("no_visits_found")}</h3>
              <p className="text-sm text-muted mt-1">Start a new intake or adjust your search filter</p>
              <Button
                className="mt-4 bg-primary"
                onClick={() => router.push("/patient/new-visit")}
              >
                {t("start_new_visit")}
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredVisits.map((visit) => {
                const dateFormatted = new Date(visit.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <Card
                    key={visit.id}
                    className="border border-border hover:border-primary/50 transition-all bg-surface hover:shadow-sm"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                            visit.type === "ayush" ? "bg-emerald-100 text-emerald-800" : "bg-primary/10 text-primary"
                          }`}>
                            {visit.tokenNumber || "OPD"}
                          </div>
                          <div>
                            <div className="font-bold text-foreground flex items-center gap-2">
                              <span>{visit.department}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                visit.type === "ayush" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {visit.type.toUpperCase()}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                visit.status === "completed" ? "bg-muted text-foreground" : "bg-primary/10 text-primary"
                              }`}>
                                {visit.status.replace(/_/g, " ").toUpperCase()}
                              </span>
                            </div>
                            <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {visit.hospitalName}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {dateFormatted}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveModalVisit(visit)}
                          className="self-start sm:self-auto"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> {t("view_summary")}
                        </Button>
                      </div>

                      {/* Symptoms Tags */}
                      <div className="pt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted font-medium">Reported Concerns:</span>
                        {visit.symptoms.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-background border border-border text-foreground"
                          >
                            {s.name} {s.severity ? `(${s.severity}/10)` : ""}
                          </span>
                        ))}
                      </div>

                      {/* Prescription / Doctor remarks excerpt */}
                      {visit.diagnosisNotes && (
                        <div className="mt-3 p-2.5 rounded-lg bg-background text-xs text-muted border border-border flex items-start gap-2">
                          <Stethoscope className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-foreground">{visit.assignedDoctor}:</strong> {visit.diagnosisNotes}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Detailed Visit Modal */}
          {activeModalVisit && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Visit Case Summary</h3>
                    <div className="text-xs text-muted">ID: {activeModalVisit.id} • {activeModalVisit.hospitalName}</div>
                  </div>
                  <button
                    onClick={() => setActiveModalVisit(null)}
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-muted"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    <div className="text-muted">Token</div>
                    <div className="font-bold text-primary text-sm">{activeModalVisit.tokenNumber || "N/A"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    <div className="text-muted">Department</div>
                    <div className="font-bold text-foreground">{activeModalVisit.department}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    <div className="text-muted">Status</div>
                    <div className="font-bold text-foreground capitalize">{activeModalVisit.status}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    <div className="text-muted">Doctor</div>
                    <div className="font-bold text-foreground truncate">{activeModalVisit.assignedDoctor || "Assigned on Call"}</div>
                  </div>
                </div>

                {/* Vitals */}
                {activeModalVisit.vitalSigns && (
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <div className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-primary" /> Recorded Vitals
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div><span className="text-muted">BP:</span> <span className="font-semibold">{activeModalVisit.vitalSigns.bp || "--"}</span></div>
                      <div><span className="text-muted">Pulse:</span> <span className="font-semibold">{activeModalVisit.vitalSigns.pulse ? `${activeModalVisit.vitalSigns.pulse} bpm` : "--"}</span></div>
                      <div><span className="text-muted">SpO2:</span> <span className="font-semibold">{activeModalVisit.vitalSigns.spo2 ? `${activeModalVisit.vitalSigns.spo2}%` : "--"}</span></div>
                      <div><span className="text-muted">Temp:</span> <span className="font-semibold">{activeModalVisit.vitalSigns.temperature || "--"}</span></div>
                    </div>
                  </div>
                )}

                {/* Recorded Symptoms */}
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Detailed Symptoms & Notes</h4>
                  <div className="space-y-2">
                    {activeModalVisit.symptoms.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-background border border-border text-xs">
                        <div className="font-bold text-foreground">{s.name} {s.severity ? `— Severity ${s.severity}/10` : ""}</div>
                        {s.notes && <div className="text-muted mt-1">{s.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prescriptions */}
                {activeModalVisit.prescriptions && activeModalVisit.prescriptions.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-emerald-600" /> Prescriptions & Care Plan
                    </div>
                    <ul className="space-y-1 text-xs text-foreground">
                      {activeModalVisit.prescriptions.map((rx, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{rx}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button onClick={() => setActiveModalVisit(null)} className="bg-primary">
                    Close Summary
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
