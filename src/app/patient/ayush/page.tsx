"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Leaf, CheckCircle, AlertTriangle, Sparkles, Shield, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  ayushSystems,
  systemSpecificQuestions,
  determinePrakriti,
  determineAgni,
  determineKoshtha,
  prakritiTypes,
  generateSystemConsultation,
  type SystemConsultationSummary
} from "@/lib/ayushDatabase";
import { type AyushSystem, type AyushAssessment } from "@/types/ayush";
import { visitManager } from "@/lib/visitManager";
import { tokenManager } from "@/lib/tokenManager";
import { VoiceInput } from "@/components/ui/VoiceInput";

type AyushStep = "system_select" | "assessment" | "result" | "complete";

function AyushConsultationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedHospitalName = searchParams?.get("hospitalName") || "ITRA Jamnagar (National AYUSH Apex Institute)";

  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<AyushStep>("system_select");
  const [selectedSystem, setSelectedSystem] = useState<AyushSystem>("ayurveda");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [assessment, setAssessment] = useState<AyushAssessment | null>(null);
  const [consultationResult, setConsultationResult] = useState<SystemConsultationSummary | null>(null);
  const [savedVisitId, setSavedVisitId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.push("/patient/dashboard");
      }
    }
  }, [router]);

  const questions = systemSpecificQuestions[selectedSystem] || systemSpecificQuestions.ayurveda;

  const handleSystemSelect = (system: AyushSystem) => {
    setSelectedSystem(system);
    setCurrentQuestionIndex(0);
    setResponses({});
    setStep("assessment");
  };

  const handleResponse = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle voice response transcript by matching closest option
  const handleVoiceAnswer = (transcript: string) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    const lower = transcript.toLowerCase();
    const matchedOption = currentQ.options.find(
      opt => lower.includes(opt.label.toLowerCase()) || lower.includes(opt.value.toLowerCase()) || (opt.description && lower.includes(opt.description.toLowerCase()))
    );

    if (matchedOption) {
      handleResponse(currentQ.id, matchedOption.value);
    } else if (currentQ.options.length > 0) {
      handleResponse(currentQ.id, currentQ.options[0].value);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      generateAssessment();
      setStep("result");
    }
  };

  // Step-by-step backward navigation
  const handleStepBack = () => {
    if (step === "complete") {
      setStep("result");
    } else if (step === "result") {
      setStep("assessment");
      setCurrentQuestionIndex(questions.length - 1);
    } else if (step === "assessment") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      } else {
        setStep("system_select");
      }
    } else if (step === "system_select") {
      if (searchParams?.get("hospitalName")) {
        router.push("/patient/hospitals");
      } else {
        router.push("/patient/dashboard");
      }
    }
  };

  const currentSystem = ayushSystems.find(s => s.id === selectedSystem);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const generateAssessment = () => {
    const prakriti = determinePrakriti(responses);
    const agni = determineAgni(responses);
    const koshtha = determineKoshtha(responses);
    const consultation = generateSystemConsultation(selectedSystem, responses);
    setConsultationResult(consultation);

    const newAssessment: AyushAssessment = {
      system: selectedSystem,
      dashavidhaPariksha: {
        prakriti,
        vikriti: prakriti,
        Sara: {
          dhatus: ["Rasa", "Rakta", "Mamsa", "Meda", "Asthi", "Majja", "Shukra"],
          quality: "good",
        },
        Samhanana: {
          bodyBuild: "moderate",
          constitution: prakriti,
        },
        Purush: {
          height: "medium",
          weight: "medium",
          bodyFrame: "medium",
        },
        Pramana: {
          measurements: {},
        },
        Satmya: {
          adaptability: "moderate",
          compatibility: ["seasonal", "local"],
        },
        Sattva: {
          mentalState: "balanced",
          emotionalStability: "moderate",
        },
        AharaShakti: {
          appetite: "good",
          digestion: "good",
        },
        VyayamaShakti: {
          physicalStrength: "good",
          exerciseCapacity: "moderate",
        },
        Vaya: {
          age: user?.age || 30,
          lifeStage: "adulthood",
        },
        Agni: agni,
        Koshtha: koshtha,
      },
      aharaVihara: {
        diet: {
          type: "vegetarian",
          frequency: "regular",
          preferences: [],
          restrictions: [],
        },
        sleep: {
          duration: "7-8 hours",
          quality: "good",
          pattern: "regular",
        },
        exercise: {
          frequency: "moderate",
          type: ["yoga", "walking"],
          duration: "30 minutes",
        },
        lifestyle: {
          stressLevel: "moderate",
          workPattern: "active",
          addiction: {
            tobacco: false,
            alcohol: false,
            other: "",
          },
        },
      },
      chiefComplaint: `${currentSystem?.name} Constitution & Wellness Review`,
      nidanPanchaka: {
        nidana: consultation.diagnosisSummary,
        purvarupa: consultation.primaryPatternDescription,
        rupa: "Identified through clinical AYUSH questioning",
        samprapti: "Elemental & Dosha interaction",
        upashaya: consultation.lifestyleGuidelines.join(", "),
      },
      recommendedTherapies: consultation.therapies,
      lifestyleRecommendations: consultation.lifestyleGuidelines,
      dietaryRecommendations: consultation.dietaryGuidelines,
      prognosis: "good",
    };

    setAssessment(newAssessment);
  };

  const handleCompleteAndSave = () => {
    if (!user || !assessment) return;

    // 1. Issue a hospital queue token for AYUSH department
    const token = tokenManager.issueToken(
      user.id,
      user.name || "Patient",
      "ayurveda",
      false,
      [`${currentSystem?.name} Assessment: ${assessment.dashavidhaPariksha.prakriti}`]
    );

    // 2. Persist to visitManager
    const visit = visitManager.createVisitFromIntake({
      patientId: user.id,
      patientName: user.name || "Patient",
      type: "ayush",
      ayushAssessment: assessment,
      department: `${currentSystem?.name} Clinical Wing`,
      tokenId: token.id,
      tokenNumber: token.tokenNumber,
      hospitalName: selectedHospitalName,
      priorityFlags: []
    });

    setSavedVisitId(visit.id);
    setStep("complete");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <div className="bg-surface border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleStepBack}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <Leaf className="w-5 h-5 text-primary" />
            <span>AYUSH Integrative Consultation</span>
          </div>
          <button
            onClick={() => router.push("/patient/dashboard")}
            className="text-xs text-muted hover:text-foreground px-3 py-1 rounded border border-border"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <Card className="border-2 border-primary/20 shadow-md">
            <CardContent className="p-6">

              {/* STEP 1: Select AYUSH System */}
              {step === "system_select" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Select Traditional Medicine System
                    </h2>
                    <p className="text-sm text-muted">
                      Choose your preferred AYUSH discipline for personalized consultation & questions
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ayushSystems.map((system) => (
                      <button
                        key={system.id}
                        onClick={() => handleSystemSelect(system.id)}
                        className={`p-5 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                          selectedSystem === system.id
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border hover:border-primary/50 bg-surface"
                        }`}
                      >
                        <div className="text-4xl p-2 bg-background rounded-lg border border-border">{system.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground text-base mb-1">
                            {system.name}
                          </div>
                          <div className="text-xs text-primary font-medium mb-1">
                            {system.tagline}
                          </div>
                          <div className="text-xs text-muted line-clamp-2">
                            {system.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: System-Specific Assessment Questions */}
              {step === "assessment" && (
                <div className="space-y-6">
                  {/* Progress Header */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted font-medium">
                        {currentSystem?.name} • Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <span className="text-primary font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* System Badge with Voice Assistant */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentSystem?.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{currentSystem?.name} Evaluation</div>
                        <div className="text-xs text-muted">{currentSystem?.tagline}</div>
                      </div>
                    </div>
                    <VoiceInput
                      onTranscript={handleVoiceAnswer}
                      autoSpeakPrompt={currentQuestion.question}
                      size="sm"
                    />
                  </div>

                  {/* Question Prompt */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                      {currentQuestion.question}
                    </h3>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => {
                        const isSelected = responses[currentQuestion.id] === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleResponse(currentQuestion.id, option.value)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                              isSelected
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-border hover:border-primary/40 bg-surface"
                            }`}
                          >
                            <div>
                              <div className="font-medium text-foreground text-sm md:text-base">
                                {option.label}
                              </div>
                              {option.description && (
                                <div className="text-xs text-muted mt-1">
                                  {option.description}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 ml-3" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons with step-by-step Back */}
                  <div className="flex gap-4 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleStepBack}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {currentQuestionIndex === 0 ? "Change System" : "Previous Question"}
                    </Button>
                    <Button
                      className="flex-1 bg-primary text-primary-foreground font-semibold"
                      onClick={handleNextQuestion}
                      disabled={!responses[currentQuestion.id]}
                    >
                      {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Generate Consultation"}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Tailored Consultation Results */}
              {step === "result" && assessment && consultationResult && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {currentSystem?.name} Assessment & Consultation
                    </h2>
                    <p className="text-sm text-muted">
                      Tailored diagnostic findings and therapeutic recommendations
                    </p>
                  </div>

                  {/* Primary Pattern / Prakriti Card */}
                  <Card className="border-2 border-primary/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">Diagnostic Pattern</CardTitle>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                          {currentSystem?.name}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="text-xs text-muted mb-1">Identified Constitutional State:</div>
                        <div className="font-bold text-lg text-primary">{consultationResult.primaryPatternTitle}</div>
                        <div className="text-xs text-foreground mt-1">{consultationResult.primaryPatternDescription}</div>
                      </div>

                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-xs font-semibold text-foreground mb-1">Clinical Evaluation Summary:</div>
                        <div className="text-xs text-muted leading-relaxed">{consultationResult.diagnosisSummary}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Therapies & Dietary Advice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                          <Leaf className="w-4 h-4 text-emerald-600" /> Recommended Therapies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1.5 text-xs text-muted">
                          {consultationResult.therapies.map((t, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">•</span>
                              <span className="text-foreground">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-primary" /> Daily Lifestyle (Vihara)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1.5 text-xs text-muted">
                          {consultationResult.lifestyleGuidelines.map((g, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">•</span>
                              <span className="text-foreground">{g}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleStepBack}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Questions
                    </Button>
                    <Button
                      className="flex-1 bg-primary text-primary-foreground font-semibold"
                      onClick={handleCompleteAndSave}
                    >
                      Save & Get AYUSH Token
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: Completed Confirmation */}
              {step === "complete" && (
                <div className="text-center space-y-6 py-6">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      AYUSH Case Registered!
                    </h2>
                    <p className="text-sm text-muted">
                      Your consultation details have been recorded in your medical history
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push("/patient/visits")}
                    >
                      View in My Visits
                    </Button>
                    <Button
                      className="flex-1 bg-primary text-primary-foreground font-semibold"
                      onClick={() => router.push("/patient/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AyushConsultation() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading AYUSH Consultation...</div>}>
      <AyushConsultationContent />
    </Suspense>
  );
}
