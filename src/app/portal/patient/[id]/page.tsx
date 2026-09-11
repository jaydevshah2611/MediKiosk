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
import { useEffect, useState } from "react";

export default function PatientDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      // Mock data - in real implementation, this would come from an API
      setPatient({
        id: p.id,
        name: "Rajesh Kumar",
        age: 45,
        gender: "Male",
        abhaId: "1234-5678-9012",
        phone: "+91 98765 43210",
        email: "rajesh.kumar@email.com",
        language: "Hindi",
      });
    });
  }, [params]);

  if (!patient) return <div>Loading...</div>;

  const history: HistoryRecord = {
    patientId: patient.id,
    sessionId: "session-123",
    chiefComplaint: "Persistent headaches with dizziness for the past 2 weeks",
    hpi: "Patient reports throbbing headaches primarily in the temporal region, occurring 3-4 times per day. Associated symptoms include dizziness upon standing, fatigue, and occasional nausea. Pain severity rated 7/10. No photophobia or phonophobia reported.",
    pastHistory: "Appendectomy in 2015. No known chronic conditions. No previous hospitalizations.",
    drugAllergyHistory: "No known drug allergies. Patient occasionally takes OTC pain relievers (paracetamol) for headaches.",
    familyHistory: "Father has hypertension. Mother has type 2 diabetes. No other significant family medical history.",
    personalHistory: "Non-smoker, occasional alcohol consumption (social). Works as a software engineer, sedentary lifestyle. Sleeps 6-7 hours per night.",
    reviewOfSystems: "General: Fatigue present. HEENT: No visual changes, no hearing loss. Cardiovascular: No chest pain, palpitations. Respiratory: No shortness of breath. GI: No nausea, vomiting, or abdominal pain. Neurological: Dizziness present, no syncope.",
    redFlags: [
      {
        symptom: "High severity headache (7/10) with dizziness",
        triggeredAt: new Date().toISOString(),
      },
    ],
  };

  const documents: ScannedDocument[] = [
    {
      id: "doc-1",
      patientId: patient.id,
      type: "prescription",
      extractedText: "Prescription for paracetamol 500mg, take one tablet twice daily for pain relief. Prescribed by Dr. Patel on 2024-01-15.",
      extractedEntities: {
        diagnoses: [],
        medications: [{ name: "Paracetamol", dosage: "500mg twice daily" }],
        investigations: [],
      },
      timelinePosition: "2024-01-15",
    },
    {
      id: "doc-2",
      patientId: patient.id,
      type: "labReport",
      extractedText: "Complete blood count report. Hemoglobin: 14.2 g/dL, WBC: 7,500/mm³, Platelets: 250,000/mm³. All values within normal range.",
      extractedEntities: {
        diagnoses: [],
        medications: [],
        investigations: [
          { name: "Hemoglobin", value: "14.2 g/dL", range: "13-17 g/dL", abnormal: false },
          { name: "WBC", value: "7,500/mm³", range: "4,500-11,000/mm³", abnormal: false },
          { name: "Platelets", value: "250,000/mm³", range: "150,000-400,000/mm³", abnormal: false },
        ],
      },
      timelinePosition: "2024-01-10",
    },
  ];

  const flags = [
    {
      type: "danger" as const,
      message: "High severity headache reported",
      details: "Patient rates pain 7/10 with associated dizziness - may require immediate evaluation",
    },
  ];

  const handleBack = () => {
    router.push("/portal/dashboard");
  };

  const handleSectionEdit = (section: string) => {
    // In real implementation, this would open an edit modal
    console.log("Editing section:", section);
  };

  const handleSectionAccept = (section: string) => {
    // In real implementation, this would mark the section as accepted
    console.log("Accepting section:", section);
  };

  const handleDocumentClick = (document: ScannedDocument) => {
    // In real implementation, this would show the full document
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
                    <div className="font-semibold text-foreground">{patient?.name || "Loading..."}</div>
                    <div className="text-sm text-muted">
                      {patient?.age} years • {patient?.gender}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-muted">ABHA ID:</span>
                    <span className="text-foreground">{patient?.abhaId || "Loading..."}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted" />
                    <span className="text-muted">Phone:</span>
                    <span className="text-foreground">{patient?.phone || "Loading..."}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted" />
                    <span className="text-muted">Email:</span>
                    <span className="text-foreground">{patient?.email || "Loading..."}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline">Language: {patient?.language || "Loading..."}</Badge>
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