"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HistorySummaryCard } from "@/components/portal/HistorySummaryCard";
import { DocumentTimeline } from "@/components/portal/DocumentTimeline";
import { FlagBanner } from "@/components/portal/FlagBanner";
import { ArrowLeft, User, Calendar, Phone, Mail, CheckCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { HistoryRecord, ScannedDocument } from "@/types";

interface PatientDetailClientProps {
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    abhaId: string;
    phone: string;
    email: string;
    language: string;
  };
  history: HistoryRecord;
  documents: ScannedDocument[];
  flags: Array<{
    type: "danger" | "warning" | "info";
    message: string;
    details: string;
  }>;
}

export function PatientDetailClient({
  patient,
  history,
  documents,
  flags,
}: PatientDetailClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/portal/dashboard");
  };

  const handleSectionEdit = (section: string) => {
    console.log("Editing section:", section);
  };

  const handleSectionAccept = (section: string) => {
    console.log("Accepting section:", section);
  };

  const handleDocumentClick = (document: ScannedDocument) => {
    console.log("Viewing document:", document);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Queue
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
                <p className="text-sm text-muted">Token: A-452 • Dr. Sharma</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Flag Emergency
              </Button>
              <Button size="sm" className="bg-primary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Consultation
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Patient Info & Flags */}
          <div className="space-y-6">
            {/* Patient Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{patient.name}</div>
                    <div className="text-sm text-muted">
                      {patient.age} years • {patient.gender}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-muted">ABHA ID:</span>
                    <span className="text-foreground">{patient.abhaId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted" />
                    <span className="text-muted">Phone:</span>
                    <span className="text-foreground">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted" />
                    <span className="text-muted">Email:</span>
                    <span className="text-foreground">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline">Language: {patient.language}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flag Banner */}
            <FlagBanner flags={flags} />

            {/* Vital Signs (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted mb-1">BP</div>
                    <div className="font-semibold text-foreground">130/85</div>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted mb-1">Pulse</div>
                    <div className="font-semibold text-foreground">78 bpm</div>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted mb-1">Temp</div>
                    <div className="font-semibold text-foreground">98.6°F</div>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted mb-1">SpO2</div>
                    <div className="font-semibold text-foreground">98%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Medical History */}
          <div className="lg:col-span-2 space-y-6">
            {/* History Summary */}
            <HistorySummaryCard
              history={history}
              onSectionEdit={handleSectionEdit}
              onSectionAccept={handleSectionAccept}
            />

            {/* Document Timeline */}
            <DocumentTimeline
              documents={documents}
              onDocumentClick={handleDocumentClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}