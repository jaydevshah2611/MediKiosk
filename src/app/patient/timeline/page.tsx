"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientNav } from "@/components/patient/PatientNav";
import { visitManager, type PatientVisitRecord } from "@/lib/visitManager";
import { documentProcessor } from "@/lib/documentProcessor";
import { useLanguage } from "@/contexts/LanguageContext";
import { type UploadedDocument } from "@/types/document";
import { InlineGuideBanner } from "@/components/ui/InlineGuideBanner";
import {
  Clock,
  Calendar,
  FileText,
  Stethoscope,
  Leaf,
  Pill,
  Sparkles,
  Activity,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  type: "visit" | "ayush" | "document" | "prescription";
  title: string;
  subtitle: string;
  doctorOrHospital?: string;
  tags?: string[];
  details?: string;
  rawData?: any;
}

export default function PatientTimelinePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);

        // Aggregate visits and documents into a unified health journey
        const visits = visitManager.getVisits(parsed.id);
        const docs = documentProcessor.getPatientDocuments(parsed.id);

        const timelineEvents: TimelineEvent[] = [];

        // Add visits
        visits.forEach(v => {
          timelineEvents.push({
            id: v.id,
            date: v.date,
            type: v.type === "ayush" ? "ayush" : "visit",
            title: v.type === "ayush" ? `${v.department} Consultation` : `${v.department} Intake`,
            subtitle: v.symptoms.map(s => s.name).join(", "),
            doctorOrHospital: `${v.assignedDoctor || "Physician"} • ${v.hospitalName || "AIIMS Kiosk"}`,
            tags: v.symptoms.map(s => s.name),
            details: v.diagnosisNotes || v.ayushAssessment?.chiefComplaint,
            rawData: v
          });

          // If visit had prescriptions
          if (v.prescriptions && v.prescriptions.length > 0) {
            timelineEvents.push({
              id: `${v.id}-rx`,
              date: v.date,
              type: "prescription",
              title: "Prescription Issued",
              subtitle: v.prescriptions.join("; "),
              doctorOrHospital: v.assignedDoctor,
              tags: ["Prescription", "Medications"],
              rawData: v.prescriptions
            });
          }
        });

        // Add documents
        docs.forEach(d => {
          timelineEvents.push({
            id: d.id,
            date: d.uploadedAt,
            type: "document",
            title: `Document: ${d.fileName}`,
            subtitle: `Type: ${d.type.replace(/_/g, " ").toUpperCase()} (${documentProcessor.formatFileSize(d.fileSize)})`,
            doctorOrHospital: d.extractedEntities?.doctors?.[0] || "Self Uploaded",
            tags: [
              ...(d.extractedEntities?.medications?.map(m => m.name) || []),
              ...(d.extractedEntities?.investigations?.map(i => i.name) || [])
            ],
            details: d.ocrText ? d.ocrText.substring(0, 160) + "..." : undefined,
            rawData: d
          });
        });

        // Sort descending by date
        timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(timelineEvents);
      } else {
        router.push("/");
      }
    }
  }, [router]);

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "ayush":
        return <Leaf className="w-4 h-4 text-emerald-600" />;
      case "prescription":
        return <Pill className="w-4 h-4 text-purple-600" />;
      case "document":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Stethoscope className="w-4 h-4 text-primary" />;
    }
  };

  const getBadgeColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "ayush":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "prescription":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "document":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

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
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                <Clock className="w-7 h-7 text-primary" /> {t("health_timeline_title")}
              </h1>
              <p className="text-sm text-muted">
                {t("health_timeline_subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
              <ShieldCheck className="w-4 h-4" /> ABHA Unified Record
            </div>
          </div>

          {/* Inline Step Guide */}
          <InlineGuideBanner
            title="How Your Unified Health Timeline Works"
            subtitle="Consolidated longitudinal health records across visits, prescriptions, and lab tests"
            steps={[
              {
                stepNumber: 1,
                badge: "Consolidation",
                title: "1. Automated Synchronisation",
                description: "Every OPD visit intake, AYUSH consultation, and uploaded record automatically registers here chronologically."
              },
              {
                stepNumber: 2,
                badge: "Inspection",
                title: "2. Click to Expand",
                description: "Review detailed doctor diagnosis notes, vitals, prescribed medicines, and OCR document transcripts."
              },
              {
                stepNumber: 3,
                badge: "Continuity",
                title: "3. Share with Doctors",
                description: "Doctors can view this longitudinal stream directly during consultation for safer clinical care."
              }
            ]}
          />

          {/* Timeline Stream */}
          {events.length === 0 ? (
            <Card className="border-2 border-dashed border-border p-12 text-center">
              <Activity className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-foreground">Timeline is empty</h3>
              <p className="text-sm text-muted mt-1">Start your first visit or upload records to begin tracking your health journey.</p>
              <div className="flex justify-center gap-3 mt-4">
                <Button className="bg-primary" onClick={() => router.push("/patient/new-visit")}>
                  Start New Visit
                </Button>
                <Button variant="outline" onClick={() => router.push("/patient/documents")}>
                  Upload Documents
                </Button>
              </div>
            </Card>
          ) : (
            <div className="relative border-l-2 border-border ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8 py-2">
              {events.map((event) => {
                const dateObj = new Date(event.date);
                const dateFormatted = dateObj.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                });
                const timeFormatted = dateObj.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div key={event.id} className="relative group">
                    {/* Circle on timeline line */}
                    <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-full bg-surface border-2 border-border group-hover:border-primary flex items-center justify-center shadow-xs transition-colors">
                      {getEventIcon(event.type)}
                    </div>

                    <Card className="border border-border bg-surface hover:border-primary/50 transition-all hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeColor(event.type)} uppercase`}>
                              {event.type}
                            </span>
                            <h3 className="font-bold text-foreground text-base">
                              {event.title}
                            </h3>
                          </div>
                          <div className="text-xs text-muted font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{dateFormatted} at {timeFormatted}</span>
                          </div>
                        </div>

                        <div className="pt-3 space-y-2">
                          <div className="text-sm font-semibold text-foreground">
                            {event.subtitle}
                          </div>

                          {event.doctorOrHospital && (
                            <div className="text-xs text-muted flex items-center gap-1.5">
                              <span>Provider:</span>
                              <strong className="text-foreground">{event.doctorOrHospital}</strong>
                            </div>
                          )}

                          {event.details && (
                            <div className="text-xs text-muted bg-background p-2.5 rounded-lg border border-border mt-2 leading-relaxed">
                              {event.details}
                            </div>
                          )}

                          {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {event.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded bg-background border border-border text-muted"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
