"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressStepper } from "@/components/kiosk/ProgressStepper";
import { ArrowLeft, ArrowRight, Camera, RefreshCw, Check, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ScannedDoc {
  id: string;
  type: "prescription" | "labReport" | "dischargeSummary";
  preview: string;
  timestamp: string;
}

export default function KioskScanDocuments() {
  const router = useRouter();
  const [scannedDocs, setScannedDocs] = useState<ScannedDoc[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<"prescription" | "labReport" | "dischargeSummary">("prescription");

  const steps = [
    { id: "welcome", label: "Welcome", completed: true, current: false },
    { id: "consent", label: "Consent", completed: true, current: false },
    { id: "interview", label: "Interview", completed: true, current: false },
    { id: "scan", label: "Scan", completed: false, current: true },
    { id: "review", label: "Review", completed: false, current: false },
    { id: "confirm", label: "Confirm", completed: false, current: false },
  ];

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      const newDoc: ScannedDoc = {
        id: Date.now().toString(),
        type: selectedDocType,
        preview: "/placeholder-doc.png", // In real implementation, this would be the actual image
        timestamp: new Date().toISOString(),
      };
      setScannedDocs([...scannedDocs, newDoc]);
      setIsScanning(false);
    }, 2000);
  };

  const handleRemoveDoc = (id: string) => {
    setScannedDocs(scannedDocs.filter((doc) => doc.id !== id));
  };

  const handleContinue = () => {
    router.push("/kiosk/review");
  };

  const handleBack = () => {
    router.push("/kiosk/interview");
  };

  const docTypeLabels = {
    prescription: "Prescription",
    labReport: "Lab Report",
    dischargeSummary: "Discharge Summary",
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
        <div className="max-w-6xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Scan Your Documents
            </h1>
            <p className="text-xl text-muted">
              Scan prescriptions, lab reports, or discharge summaries to complete your medical record
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Scanning Section */}
            <div className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">
                    Document Scanner
                  </h2>

                  {/* Document Type Selection */}
                  <div className="space-y-4 mb-6">
                    <label className="text-sm font-medium text-foreground">
                      Select Document Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(docTypeLabels).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedDocType(key as any)}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            selectedDocType === key
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Camera View (Placeholder) */}
                  <div className="bg-background rounded-lg border-2 border-dashed border-border aspect-video flex items-center justify-center mb-6">
                    {isScanning ? (
                      <div className="text-center">
                        <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-muted">Scanning document...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-muted mx-auto mb-4" />
                        <p className="text-muted">Camera view will appear here</p>
                      </div>
                    )}
                  </div>

                  {/* Scan Button */}
                  <Button
                    size="lg"
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-full bg-primary"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="mr-2 w-5 h-5 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 w-5 h-5" />
                        Scan Document
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Scanning Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      Ensure good lighting for clear scans
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      Place document flat on the scanning surface
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      Scan all pages of multi-page documents
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      Remove any obstructions or shadows
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Scanned Documents Section */}
            <div className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Scanned Documents
                    </h2>
                    <div className="text-sm text-muted">
                      {scannedDocs.length} document{scannedDocs.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {scannedDocs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-muted" />
                      </div>
                      <p className="text-muted mb-4">
                        No documents scanned yet
                      </p>
                      <p className="text-sm text-muted">
                        Scan your first document to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scannedDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-background rounded-lg p-4 border border-border"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded bg-muted/20 flex items-center justify-center flex-shrink-0">
                              <Camera className="w-8 h-8 text-muted" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-foreground">
                                  {docTypeLabels[doc.type]}
                                </h4>
                                <button
                                  onClick={() => handleRemoveDoc(doc.id)}
                                  className="text-muted hover:text-danger transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="text-sm text-muted">
                                Scanned at {new Date(doc.timestamp).toLocaleTimeString()}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                                  Processing complete
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* OCR Status */}
              {scannedDocs.length > 0 && (
                <Card className="bg-success/5 border-success/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-success" />
                      <div>
                        <h3 className="font-semibold text-foreground">
                          OCR Processing Complete
                        </h3>
                        <p className="text-sm text-muted">
                          {scannedDocs.length} document{scannedDocs.length !== 1 ? "s" : ""} processed successfully
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

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
              Continue to Review
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/kiosk/review")}
            >
              Skip document scanning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}