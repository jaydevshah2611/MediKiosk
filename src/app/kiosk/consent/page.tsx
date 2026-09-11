"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressStepper } from "@/components/kiosk/ProgressStepper";
import { ArrowRight, Volume2, ArrowLeft, Info } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function KioskConsent() {
  const router = useRouter();
  const [consents, setConsents] = useState({
    voice: false,
    documents: false,
    hisShare: false,
  });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const steps = [
    { id: "welcome", label: "Welcome", completed: true, current: false },
    { id: "consent", label: "Consent", completed: false, current: true },
    { id: "interview", label: "Interview", completed: false, current: false },
    { id: "scan", label: "Scan", completed: false, current: false },
    { id: "review", label: "Review", completed: false, current: false },
    { id: "confirm", label: "Confirm", completed: false, current: false },
  ];

  const handleConsentToggle = (type: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleContinue = () => {
    // Validate that all consents are granted
    if (Object.values(consents).every((value) => value)) {
      router.push("/kiosk/interview");
    }
  };

  const handleBack = () => {
    router.push("/kiosk/welcome");
  };

  const allConsentsGranted = Object.values(consents).every((value) => value);

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
              Your Consent Matters
            </h1>
            <p className="text-xl text-muted">
              Please review and grant consent for the following
            </p>
          </div>

          {/* Consent Cards */}
          <div className="space-y-4">
            {/* Voice Recording Consent */}
            <Card className={`border-2 transition-all ${
              consents.voice ? "border-success bg-success/5" : "border-border"
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Voice Recording Consent</CardTitle>
                  <button
                    onClick={() => setExpandedSection(expandedSection === "voice" ? null : "voice")}
                    className="text-muted hover:text-foreground"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted mb-4">
                  I consent to have my voice recorded during the interview for transcription and AI processing.
                </p>
                {expandedSection === "voice" && (
                  <div className="bg-background rounded-lg p-4 mb-4 text-sm text-muted">
                    <p className="mb-2">
                      <strong>Why we need this:</strong> Voice recording enables our AI to transcribe your responses and extract relevant medical information for your physician.
                    </p>
                    <p>
                      <strong>Data handling:</strong> Voice recordings are temporarily stored for processing and automatically deleted within 24 hours after transcription.
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Audio explanation would play here
                    }}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Listen to explanation
                  </Button>
                  <Button
                    onClick={() => handleConsentToggle("voice")}
                    className={consents.voice ? "bg-success" : "bg-primary"}
                  >
                    {consents.voice ? "Granted" : "Grant Consent"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Document Scanning Consent */}
            <Card className={`border-2 transition-all ${
              consents.documents ? "border-success bg-success/5" : "border-border"
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Document Scanning Consent</CardTitle>
                  <button
                    onClick={() => setExpandedSection(expandedSection === "documents" ? null : "documents")}
                    className="text-muted hover:text-foreground"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted mb-4">
                  I consent to have my documents (prescriptions, lab reports, etc.) scanned and digitized for my medical record.
                </p>
                {expandedSection === "documents" && (
                  <div className="bg-background rounded-lg p-4 mb-4 text-sm text-muted">
                    <p className="mb-2">
                      <strong>Why we need this:</strong> Digitizing your documents helps create a complete medical history and enables our AI to extract important information like diagnoses and medications.
                    </p>
                    <p>
                      <strong>Data handling:</strong> Scanned documents are stored securely and can be accessed by you and your authorized healthcare providers.
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Audio explanation would play here
                    }}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Listen to explanation
                  </Button>
                  <Button
                    onClick={() => handleConsentToggle("documents")}
                    className={consents.documents ? "bg-success" : "bg-primary"}
                  >
                    {consents.documents ? "Granted" : "Grant Consent"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* HIS Data Sharing Consent */}
            <Card className={`border-2 transition-all ${
              consents.hisShare ? "border-success bg-success/5" : "border-border"
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Hospital System Data Sharing</CardTitle>
                  <button
                    onClick={() => setExpandedSection(expandedSection === "hisShare" ? null : "hisShare")}
                    className="text-muted hover:text-foreground"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted mb-4">
                  I consent to share my processed medical information with the hospital's information system for my care.
                </p>
                {expandedSection === "hisShare" && (
                  <div className="bg-background rounded-lg p-4 mb-4 text-sm text-muted">
                    <p className="mb-2">
                      <strong>Why we need this:</strong> Sharing with the hospital system ensures your physician has access to your information during consultation and for future reference.
                    </p>
                    <p>
                      <strong>Data handling:</strong> Only processed medical information is shared. Raw voice recordings and unprocessed documents are not shared with the hospital system.
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Audio explanation would play here
                    }}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Listen to explanation
                  </Button>
                  <Button
                    onClick={() => handleConsentToggle("hisShare")}
                    className={consents.hisShare ? "bg-success" : "bg-primary"}
                  >
                    {consents.hisShare ? "Granted" : "Grant Consent"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Important Information
                  </h3>
                  <p className="text-sm text-muted">
                    You can withdraw your consent at any time. Your data will be handled according to the DPDP Act 2023 and hospital privacy policies. All consents are recorded with timestamps for audit purposes.
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
              disabled={!allConsentsGranted}
              className="bg-primary text-lg h-14 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}