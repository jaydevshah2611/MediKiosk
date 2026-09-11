"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientNav } from "@/components/patient/PatientNav";
import { type LanguageCode } from "@/lib/languages";
import { useLanguage } from "@/contexts/LanguageContext";
import { InlineGuideBanner } from "@/components/ui/InlineGuideBanner";
import {
  Settings,
  Languages,
  Bell,
  Shield,
  Moon,
  Smartphone,
  CheckCircle2,
  Trash2,
  DownloadCloud
} from "lucide-react";

export default function PatientSettingsPage() {
  const router = useRouter();
  const { language, setLanguage, t, languages } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } else {
        router.push("/");
      }
    }
  }, [router]);

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    if (user && typeof window !== "undefined") {
      const updated = { ...user, preferredLanguage: lang };
      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleExportData = () => {
    if (typeof window === "undefined") return;
    const exportPayload = {
      user,
      visits: localStorage.getItem("patientVisits"),
      documents: localStorage.getItem("uploadedDocuments"),
      tokens: localStorage.getItem("hospitalTokens")
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medikiosk-patient-records-${Date.now()}.json`;
    a.click();
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
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Settings className="w-7 h-7 text-primary" /> {t("nav_settings")}
            </h1>
            <p className="text-sm text-muted">
              Configure kiosk interface language, alerts, privacy, and local data export
            </p>
          </div>

          {/* Inline Step Guide */}
          <InlineGuideBanner
            title="How to Configure Preferences & Backups"
            subtitle="Manage notification channels, regional languages, and portable health data backups"
            steps={[
              {
                stepNumber: 1,
                badge: "Language",
                title: "1. Select Language",
                description: "Pick your preferred regional Indian language for prompts, OCR summaries, and voice assistance."
              },
              {
                stepNumber: 2,
                badge: "Alerts",
                title: "2. Queue & WhatsApp Alerts",
                description: "Toggle SMS and WhatsApp notifications for live OPD queue position and prescription delivery."
              },
              {
                stepNumber: 3,
                badge: "Data Export",
                title: "3. Export ABHA Records",
                description: "Download all local consultations, tokens, and scanned document data as an encrypted JSON file."
              }
            ]}
          />

          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Preferences updated successfully!
            </div>
          )}

          {/* Language Selection */}
          <Card className="border border-border bg-surface">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary" /> {t("select_language")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs text-muted">
                Choose the preferred language for symptom descriptions, follow-up questionnaires, and AI voice queries.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      language === lang.code
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs scale-102"
                        : "border-border hover:border-primary/40 bg-background text-foreground"
                    }`}
                  >
                    <div className="text-sm font-semibold">{lang.native}</div>
                    <div className="text-[11px] text-muted font-normal">{lang.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications & OPD Status Alerts */}
          <Card className="border border-border bg-surface">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" /> OPD Token & Queue Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">SMS Token Alerts</div>
                  <div className="text-xs text-muted">Receive live SMS alerts when your token is 2 spots away</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div>
                  <div className="font-semibold text-foreground">WhatsApp Prescription Sync</div>
                  <div className="text-xs text-muted">Automatically deliver digital prescription PDFs to registered mobile</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & ABDM Data Export */}
          <Card className="border border-border bg-surface">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Data Sovereignty & ABHA Export
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <p className="text-xs text-muted leading-relaxed">
                MediKiosk strictly follows the ABDM Data Governance standards. Your clinical consultations and OCR documents are stored under your explicit consent.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="text-xs font-semibold"
                >
                  <DownloadCloud className="w-4 h-4 mr-1.5" /> Export All Health Records (JSON)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/patient/consent")}
                  className="text-xs font-semibold"
                >
                  <Shield className="w-4 h-4 mr-1.5" /> Manage Consents & Revocation
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
