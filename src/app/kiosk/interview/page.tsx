"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressStepper } from "@/components/kiosk/ProgressStepper";
import { VoiceInterviewCard } from "@/components/kiosk/VoiceInterviewCard";
import { RedFlagAlert } from "@/components/kiosk/RedFlagAlert";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  question: string;
  category: string;
  required: boolean;
}

const questions: Question[] = [
  {
    id: "chief_complaint",
    question: "What is the main reason for your visit today?",
    category: "Chief Complaint",
    required: true,
  },
  {
    id: "symptom_duration",
    question: "How long have you been experiencing these symptoms?",
    category: "History of Present Illness",
    required: true,
  },
  {
    id: "symptom_severity",
    question: "On a scale of 1 to 10, how would you rate the severity of your symptoms?",
    category: "History of Present Illness",
    required: true,
  },
  {
    id: "past_conditions",
    question: "Do you have any previous medical conditions or surgeries?",
    category: "Past Medical History",
    required: false,
  },
  {
    id: "medications",
    question: "Are you currently taking any medications?",
    category: "Drug & Allergy History",
    required: false,
  },
  {
    id: "allergies",
    question: "Do you have any known drug or food allergies?",
    category: "Drug & Allergy History",
    required: true,
  },
  {
    id: "family_history",
    question: "Does anyone in your family have similar health conditions?",
    category: "Family History",
    required: false,
  },
];

export default function KioskInterview() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [showRedFlag, setShowRedFlag] = useState(false);

  const steps = [
    { id: "welcome", label: "Welcome", completed: true, current: false },
    { id: "consent", label: "Consent", completed: true, current: false },
    { id: "interview", label: "Interview", completed: false, current: true },
    { id: "scan", label: "Scan", completed: false, current: false },
    { id: "review", label: "Review", completed: false, current: false },
    { id: "confirm", label: "Confirm", completed: false, current: false },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    // Check for red flags based on responses
    if (currentQuestion.id === "symptom_severity" && responses[currentQuestion.id] && parseInt(responses[currentQuestion.id]) >= 8) {
      setShowRedFlag(true);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push("/kiosk/scan-documents");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.push("/kiosk/consent");
    }
  };

  const handleResponse = (text: string) => {
    setResponses((prev) => ({ ...prev, [currentQuestion.id]: text }));
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop the Web Speech API
  };

  const handleRedFlagContinue = () => {
    setShowRedFlag(false);
    router.push("/kiosk/scan-documents"); // Skip to emergency handling
  };

  const handleRedFlagDismiss = () => {
    setShowRedFlag(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push("/kiosk/scan-documents");
    }
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Medical Interview
              </h1>
              <div className="text-right">
                <div className="text-sm text-muted">Progress</div>
                <div className="text-2xl font-bold text-primary">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="font-medium text-foreground">Category:</span>
              <span>{currentQuestion.category}</span>
              <span className="text-muted">•</span>
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              {currentQuestion.required && (
                <>
                  <span className="text-muted">•</span>
                  <span className="text-danger">Required</span>
                </>
              )}
            </div>
          </div>

          {/* Red Flag Alert */}
          {showRedFlag && (
            <RedFlagAlert
              symptoms={[
                "High symptom severity reported (8+)",
                "Immediate medical attention may be required",
              ]}
              onContinue={handleRedFlagContinue}
              onDismiss={handleRedFlagDismiss}
            />
          )}

          {/* Voice Interview Card */}
          <VoiceInterviewCard
            question={currentQuestion.question}
            transcript={responses[currentQuestion.id]}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            onTextResponse={handleResponse}
          />

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
              onClick={handleNext}
              disabled={!responses[currentQuestion.id] && currentQuestion.required}
              className="bg-primary text-lg h-14 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              ) : (
                "Continue to Document Scan"
              )}
            </Button>
          </div>

          {/* Skip Option */}
          {!currentQuestion.required && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else {
                    router.push("/kiosk/scan-documents");
                  }
                }}
              >
                Skip this question
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}