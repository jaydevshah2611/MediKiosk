"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressStepper } from "@/components/kiosk/ProgressStepper";
import { ArrowLeft, ArrowRight, Edit2, Check, Volume2, Play, Pause } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewSection {
  id: string;
  title: string;
  content: string;
  canEdit: boolean;
}

export default function KioskReview() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { id: "welcome", label: "Welcome", completed: true, current: false },
    { id: "consent", label: "Consent", completed: true, current: false },
    { id: "interview", label: "Interview", completed: true, current: false },
    { id: "scan", label: "Scan", completed: true, current: false },
    { id: "review", label: "Review", completed: false, current: true },
    { id: "confirm", label: "Confirm", completed: false, current: false },
  ];

  const reviewSections: ReviewSection[] = [
    {
      id: "chief_complaint",
      title: "Chief Complaint",
      content: "Patient reports persistent headaches for the past 2 weeks, accompanied by occasional dizziness and fatigue.",
      canEdit: true,
    },
    {
      id: "symptoms",
      title: "Symptoms & Duration",
      content: "Headaches: 2 weeks, severity 7/10. Dizziness: intermittent, especially when standing up quickly. Fatigue: constant, affecting daily activities.",
      canEdit: true,
    },
    {
      id: "medical_history",
      title: "Medical History",
      content: "No known chronic conditions. Previous surgery: appendectomy (2015). No known allergies.",
      canEdit: true,
    },
    {
      id: "medications",
      title: "Current Medications",
      content: "None currently prescribed. Patient occasionally takes over-the-counter pain relievers for headaches.",
      canEdit: true,
    },
    {
      id: "family_history",
      content: "Father has hypertension. Mother has type 2 diabetes. No other significant family medical history.",
      canEdit: true,
      title: "Family History",
    },
  ];

  const handleContinue = () => {
    router.push("/kiosk/confirmation");
  };

  const handleBack = () => {
    router.push("/kiosk/scan-documents");
  };

  const handleEdit = (sectionId: string) => {
    // In a real implementation, this would navigate back to the interview
    // with the specific section highlighted for editing
    router.push("/kiosk/interview");
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would play the audio summary
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Stepper */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ProgressStepper steps={steps} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Review Your Information
            </h1>
            <p className="text-xl text-muted">
              Please review the collected information before submitting
            </p>
          </div>

          {/* Audio Summary Option */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Listen to Summary
                    </h3>
                    <p className="text-sm text-muted">
                      Hear a summary of your collected information
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePlayAudio}
                  className="h-12 w-12 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Sections */}
          <div className="space-y-4">
            {reviewSections.map((section) => (
              <Card
                key={section.id}
                className={`border-2 transition-all ${
                  expandedSection === section.id
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {section.canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(section.id)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      <button
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === section.id ? null : section.id
                          )
                        }
                        className="text-muted hover:text-foreground"
                      >
                        {expandedSection === section.id ? "▼" : "▶"}
                      </button>
                    </div>
                  </div>
                </CardHeader>
                {expandedSection === section.id && (
                  <CardContent>
                    <p className="text-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Document Summary */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Scanned Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Prescription</div>
                    <div className="text-sm text-muted">Scanned and processed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Lab Report</div>
                    <div className="text-sm text-muted">Scanned and processed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Notice */}
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Ready to Submit
                  </h3>
                  <p className="text-sm text-muted">
                    Your information has been collected and processed. By clicking continue, you confirm that the information is accurate and consent to share it with your healthcare provider.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="h-14 px-8"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              className="bg-primary text-lg h-14 px-8"
            >
              Submit & Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}