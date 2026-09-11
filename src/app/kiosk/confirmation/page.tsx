"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressStepper } from "@/components/kiosk/ProgressStepper";
import { CheckCircle, Clock, ArrowRight, Home, Download, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KioskConfirmation() {
  const router = useRouter();

  const steps = [
    { id: "welcome", label: "Welcome", completed: true, current: false },
    { id: "consent", label: "Consent", completed: true, current: false },
    { id: "interview", label: "Interview", completed: true, current: false },
    { id: "scan", label: "Scan", completed: true, current: false },
    { id: "review", label: "Review", completed: true, current: false },
    { id: "confirm", label: "Confirm", completed: false, current: true },
  ];

  const tokenNumber = "A-452";
  const estimatedWaitTime = 15;
  const assignedDoctor = "Dr. Sharma";

  const handleGoHome = () => {
    router.push("/marketing");
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
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Information Submitted Successfully
            </h1>
            <p className="text-xl text-muted">
              Your medical information has been processed and sent to your healthcare provider
            </p>
          </div>

          {/* Token Card */}
          <Card className="border-2 border-success/20 bg-success/5">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted mb-2">Your Token Number</div>
                  <div className="text-6xl font-bold text-primary tracking-wider">
                    {tokenNumber}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-background rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted">Estimated Wait Time</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {estimatedWaitTime} minutes
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted">Assigned Doctor</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {assignedDoctor}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                What Happens Next
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Your Information is Reviewed
                    </h3>
                    <p className="text-sm text-muted">
                      Dr. Sharma will review your medical summary before your consultation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Wait for Your Token
                    </h3>
                    <p className="text-sm text-muted">
                      Monitor the display screen for your token number to be called
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Consultation Begins
                    </h3>
                    <p className="text-sm text-muted">
                      When your token is called, proceed to consultation room 3
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Options */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-16"
              onClick={() => {
                // In a real implementation, this would download a summary
              }}
            >
              <Download className="mr-2 w-5 h-5" />
              Download Summary
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-16"
              onClick={() => {
                // In a real implementation, this would share via ABDM
              }}
            >
              <Share2 className="mr-2 w-5 h-5" />
              Share via ABDM
            </Button>

            <Button
              size="lg"
              className="h-16 bg-primary"
              onClick={handleGoHome}
            >
              <Home className="mr-2 w-5 h-5" />
              Return to Home
            </Button>
          </div>

          {/* Important Notice */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Please Note
                  </h3>
                  <p className="text-sm text-muted">
                    Your token number is valid for today only. If you miss your turn, please inform the reception desk. Your medical information will be available to Dr. Sharma for your consultation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center">
            <p className="text-muted mb-4">Need assistance?</p>
            <Button variant="ghost" size="sm">
              Contact Reception
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}