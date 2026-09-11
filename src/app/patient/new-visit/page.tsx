"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Search,
  Plus,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  HandMetal,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Stethoscope,
  Volume2
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { type LanguageCode } from "@/lib/languages";
import { bodySystems, searchSymptoms, getSymptomsByBodySystem } from "@/lib/symptomDatabase";
import { allopathicSymptomCatalog, type SystemSymptomItem } from "@/lib/allopathicCatalog";
import { useState, useEffect, Suspense } from "react";
import { type Symptom, type SymptomResponse, type BodySystem } from "@/types/symptoms";
import { visitManager } from "@/lib/visitManager";
import { tokenManager } from "@/lib/tokenManager";
import { Department } from "@/types/token";
import { SignLanguageAvatar } from "@/components/patient/SignLanguageAvatar";
import { VoiceInput } from "@/components/ui/VoiceInput";

type VisitStep = "body_system" | "symptom_selection" | "follow_up" | "review" | "complete";

function NewVisitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedHospitalName = searchParams?.get("hospitalName") || "Civil Hospital MediCity Kiosk Ahmedabad";

  const { language, setLanguage, t, languages } = useLanguage();
  const selectedLanguage = language;
  const [user, setUser] = useState<any>(null);

  const [step, setStep] = useState<VisitStep>("body_system");
  const [selectedBodySystem, setSelectedBodySystem] = useState<BodySystem | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
  const [symptomResponses, setSymptomResponses] = useState<SymptomResponse[]>([]);
  const [currentResponses, setCurrentResponses] = useState<Record<string, string | number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFlags, setPriorityFlags] = useState<any[]>([]);
  const [createdToken, setCreatedToken] = useState<any>(null);

  // Custom user-entered complaint & Accessibility Avatar toggle
  const [customComplaint, setCustomComplaint] = useState("");
  const [showSignLanguageAvatar, setShowSignLanguageAvatar] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        router.push("/");
      }
    }
  }, [router]);

  // Step-by-step backwards navigation
  const handleStepBack = () => {
    if (step === "complete") {
      setStep("review");
    } else if (step === "review") {
      if (selectedSymptoms.length > 0) {
        setStep("follow_up");
        setCurrentSymptomIndex(selectedSymptoms.length - 1);
      } else {
        setStep("symptom_selection");
      }
    } else if (step === "follow_up") {
      if (currentSymptomIndex > 0) {
        setCurrentSymptomIndex(prev => prev - 1);
        const prevResponse = symptomResponses[currentSymptomIndex - 1];
        if (prevResponse) {
          setCurrentResponses(prevResponse.responses);
        }
      } else {
        setStep("symptom_selection");
      }
    } else if (step === "symptom_selection") {
      setStep("body_system");
    } else if (step === "body_system") {
      if (searchParams?.get("hospitalName")) {
        router.push("/patient/hospitals");
      } else {
        router.push("/patient/dashboard");
      }
    }
  };

  const handleBodySystemSelect = (system: BodySystem) => {
    setSelectedBodySystem(system);
    setStep("symptom_selection");
  };

  const handleSymptomToggle = (symptom: Symptom) => {
    setSelectedSymptoms(prev => {
      const exists = prev.find(s => s.id === symptom.id);
      if (exists) {
        return prev.filter(s => s.id !== symptom.id);
      } else {
        return [...prev, symptom];
      }
    });
  };

  // Convert an allopathic catalog item into a standard Symptom object
  const handleCatalogItemToggle = (item: SystemSymptomItem) => {
    const symptomObj: Symptom = {
      id: item.id,
      name: item.name,
      translations: item.translations,
      bodySystem: selectedBodySystem || "general",
      relatedSymptoms: [],
      followUpQuestions: [
        {
          id: `${item.id}_severity`,
          question: `Severity level for ${item.name} (1 to 10)`,
          translations: {
            en: `Severity level for ${item.name} (1 to 10)`,
            hi: `${item.name} के दर्द/गंभीरता का स्तर (1 से 10)`,
            gu: `${item.name} ની તીવ્રતા સ્તર (1 થી 10)`
          },
          type: "severity",
          required: false
        },
        {
          id: `${item.id}_duration`,
          question: "How long have you been experiencing this?",
          translations: {
            en: "How long have you been experiencing this?",
            hi: "यह समस्या कितने समय से है?",
            gu: "આ તકલીફ કેટલા સમયથી છે?"
          },
          type: "duration",
          options: [
            { value: "today", label: "Started Today / Sudden", translations: { en: "Started Today / Sudden" } },
            { value: "1_3_days", label: "1-3 Days", translations: { en: "1-3 Days" } },
            { value: "1_2_weeks", label: "1-2 Weeks", translations: { en: "1-2 Weeks" } },
            { value: "chronic", label: "More than a Month", translations: { en: "More than a Month" } }
          ],
          required: false
        }
      ]
    };

    handleSymptomToggle(symptomObj);
  };

  // Add custom typed complaint as a symptom
  const handleAddCustomComplaint = (customText?: string) => {
    const textToAdd = customText || customComplaint;
    if (!textToAdd.trim()) return;

    const customSymptom: Symptom = {
      id: `custom_${Date.now()}`,
      name: textToAdd.trim(),
      translations: { en: textToAdd.trim() },
      bodySystem: selectedBodySystem || "general",
      relatedSymptoms: [],
      followUpQuestions: [
        {
          id: `custom_severity`,
          question: "How severe is this discomfort on a scale of 1-10?",
          translations: { en: "How severe is this discomfort on a scale of 1-10?" },
          type: "severity",
          required: false
        },
        {
          id: `custom_notes`,
          question: "Any additional notes or triggers for the physician?",
          translations: { en: "Any additional notes or triggers for the physician?" },
          type: "custom",
          required: false
        }
      ]
    };

    setSelectedSymptoms(prev => [...prev, customSymptom]);
    setCustomComplaint("");
  };

  const handleStartFollowUp = () => {
    if (selectedSymptoms.length === 0) {
      const generalSymptom: Symptom = {
        id: "general_checkup",
        name: "General Physician Evaluation / Unspecified Symptoms",
        translations: { en: "General Physician Evaluation / Unspecified Symptoms" },
        bodySystem: selectedBodySystem || "general",
        relatedSymptoms: [],
        followUpQuestions: []
      };
      setSelectedSymptoms([generalSymptom]);
      setSymptomResponses([
        {
          symptomId: "general_checkup",
          symptomName: "General Physician Evaluation & Consultation",
          responses: {
            consultation_type: "Routine General Intake",
            patient_preference: "Direct Doctor Assessment"
          },
          severity: 3,
          timestamp: new Date().toISOString()
        }
      ]);
      setStep("review");
      return;
    }

    setCurrentSymptomIndex(0);
    setCurrentResponses({});
    setStep("follow_up");
  };

  const handleFollowUpResponse = (questionId: string, value: string | number) => {
    setCurrentResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNextSymptom = () => {
    const currentSymptom = selectedSymptoms[currentSymptomIndex];

    let severity: number | undefined;
    const severityResponse = Object.entries(currentResponses).find(([key]) => key.includes("severity"));
    if (severityResponse) {
      severity = Number(severityResponse[1]);
    }

    const response: SymptomResponse = {
      symptomId: currentSymptom.id,
      symptomName: currentSymptom.name,
      responses: Object.keys(currentResponses).length > 0 ? currentResponses : { status: "Patient opted for direct verbal consultation with doctor" },
      severity: severity || 4,
      timestamp: new Date().toISOString(),
    };

    setSymptomResponses(prev => {
      const filtered = prev.filter(r => r.symptomId !== currentSymptom.id);
      return [...filtered, response];
    });

    // Check priority rules if severity is high
    if (severity && severity >= 8) {
      setPriorityFlags(prev => {
        const alreadyPresent = prev.some(f => f.symptom === currentSymptom.name);
        if (alreadyPresent) return prev;
        return [...prev, {
          symptom: currentSymptom.name,
          severity: "high",
          message: `High severity (${severity}/10) recorded for ${currentSymptom.name}. Prioritized for immediate triage.`,
        }];
      });
    }

    if (currentSymptomIndex < selectedSymptoms.length - 1) {
      setCurrentSymptomIndex(prev => prev + 1);
      setCurrentResponses({});
    } else {
      setStep("review");
    }
  };

  const mapBodySystemToDepartment = (bs: BodySystem | null): Department => {
    switch (bs) {
      case "cardiovascular": return "cardiology";
      case "musculoskeletal": return "orthopedics";
      case "head_neurological": return "neurology";
      case "skin": return "dermatology";
      case "eyes": return "ophthalmology";
      case "ent": return "ent";
      case "dental_oral": return "dental";
      case "respiratory": return "general_medicine";
      case "gastrointestinal": return "general_medicine";
      case "urinary": return "general_medicine";
      case "reproductive": return "gynecology";
      case "mental_behavioral": return "general_medicine";
      case "endocrine_metabolic": return "general_medicine";
      default: return "general_medicine";
    }
  };

  const handleCompleteVisit = () => {
    if (!user) return;

    const dept = mapBodySystemToDepartment(selectedBodySystem);
    const isPriority = priorityFlags.length > 0;

    // 1. Issue live token in queue
    const token = tokenManager.issueToken(
      user.id,
      user.name || "Patient",
      dept,
      isPriority,
      selectedSymptoms.map(s => s.name)
    );
    setCreatedToken(token);

    // 2. Persist to visit history
    visitManager.createVisitFromIntake({
      patientId: user.id,
      patientName: user.name || "Patient",
      type: "allopathic",
      bodySystem: selectedBodySystem || undefined,
      symptomResponses: symptomResponses.length > 0 ? symptomResponses : [
        {
          symptomId: "general_opd",
          symptomName: "General Allopathic Consultation",
          responses: { intake: "Direct Intake Verified" },
          severity: 4,
          timestamp: new Date().toISOString()
        }
      ],
      priorityFlags,
      department: dept.replace(/_/g, " ").toUpperCase(),
      tokenId: token.id,
      tokenNumber: token.tokenNumber,
      hospitalName: selectedHospitalName
    });

    setStep("complete");
  };

  const renderBodySystemSelection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">
          What brings you in today?
        </h2>
        <p className="text-sm text-muted">
          Select the affected body system or health area, or speak your complaint
        </p>
      </div>

      {/* ISL Sign Language Avatar Accessibility Card */}
      {showSignLanguageAvatar && (
        <SignLanguageAvatar
          currentText="Please choose the affected body system or tap Direct General Consultation."
          stepName="body_system"
          language={selectedLanguage}
        />
      )}

      {/* Quick Direct Proceed Button for patients without specific categories */}
      <div className="p-4 rounded-xl bg-primary/10 border-2 border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-foreground text-sm">Not sure or general checkup?</div>
            <div className="text-xs text-muted">Skip area selection and proceed straight to general physician intake</div>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedBodySystem("general");
            handleStartFollowUp();
          }}
          className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold flex items-center gap-2"
        >
          <span>Direct General Consultation</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Search with Voice Input */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms or areas (or speak using mic)..."
            className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none bg-surface text-foreground text-sm"
          />
        </div>
        <VoiceInput
          onTranscript={(text) => setSearchQuery(text)}
          language={selectedLanguage}
          size="md"
        />
      </div>

      {/* Body System Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bodySystems
          .filter(s => searchQuery ? (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.translations[selectedLanguage] && s.translations[selectedLanguage].toLowerCase().includes(searchQuery.toLowerCase()))) : true)
          .map((system) => (
            <button
              key={system.id}
              onClick={() => handleBodySystemSelect(system.id)}
              className="p-5 rounded-xl border-2 border-border hover:border-primary transition-all bg-surface hover:bg-primary/5 text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">{system.icon}</div>
              <div className="text-sm font-semibold text-foreground">
                {system.translations[selectedLanguage] || system.name}
              </div>
            </button>
          ))}
      </div>
    </div>
  );

  const renderSymptomSelection = () => {
    const systemSymptomsFromDb = getSymptomsByBodySystem(selectedBodySystem!);
    const catalogSymptoms = selectedBodySystem ? (allopathicSymptomCatalog[selectedBodySystem] || allopathicSymptomCatalog.general) : allopathicSymptomCatalog.general;
    const currentSystem = bodySystems.find(s => s.id === selectedBodySystem);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{currentSystem?.icon || "🩺"}</span>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {currentSystem?.translations[selectedLanguage] || currentSystem?.name || "General Symptoms"}
              </h2>
              <p className="text-xs text-muted">Select symptoms, speak into mic, or type custom complaints</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {selectedSymptoms.length} Selected
          </span>
        </div>

        {/* ISL Sign Language Avatar Accessibility Card */}
        {showSignLanguageAvatar && (
          <SignLanguageAvatar
            currentText={`Choose from the listed symptoms for ${currentSystem?.name || "General"} or speak your complaint into the microphone.`}
            stepName="symptom_selection"
            language={selectedLanguage}
          />
        )}

        {/* Custom Symptom Input with Integrated Voice Input */}
        <div className="flex items-center gap-2 p-3 bg-surface rounded-xl border border-border">
          <input
            type="text"
            value={customComplaint}
            onChange={(e) => setCustomComplaint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomComplaint();
              }
            }}
            placeholder="Type or speak your symptom / complaint..."
            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
          />
          <VoiceInput
            onTranscript={(text) => {
              setCustomComplaint(text);
              handleAddCustomComplaint(text);
            }}
            language={selectedLanguage}
            size="sm"
          />
          <Button
            onClick={() => handleAddCustomComplaint()}
            disabled={!customComplaint.trim()}
            size="sm"
            className="bg-primary text-primary-foreground font-semibold shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        {/* Combined Symptoms List */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {/* 1. Pre-configured database symptoms */}
          {systemSymptomsFromDb.map((symptom) => {
            const isSelected = selectedSymptoms.some(s => s.id === symptom.id);
            return (
              <button
                key={symptom.id}
                onClick={() => handleSymptomToggle(symptom)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/40 bg-surface"
                }`}
              >
                <div>
                  <div className="font-semibold text-foreground text-base">
                    {symptom.translations[selectedLanguage] || symptom.name}
                  </div>
                  {symptom.relatedSymptoms && symptom.relatedSymptoms.length > 0 && (
                    <div className="text-xs text-muted mt-1">
                      Related markers: {symptom.relatedSymptoms.join(", ")}
                    </div>
                  )}
                </div>
                {isSelected ? (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
                )}
              </button>
            );
          })}

          {/* 2. Enhanced catalog items */}
          {catalogSymptoms.map((item) => {
            const isSelected = selectedSymptoms.some(s => s.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleCatalogItemToggle(item)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/40 bg-surface"
                }`}
              >
                <div>
                  <div className="font-semibold text-foreground text-base">
                    {item.translations[selectedLanguage] || item.name}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    Clinical marker for {currentSystem?.name || "General OPD"}
                  </div>
                </div>
                {isSelected ? (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
                )}
              </button>
            );
          })}

          {/* 3. Custom added symptoms */}
          {selectedSymptoms.filter(s => s.id.startsWith("custom_")).map((custom) => (
            <div
              key={custom.id}
              className="w-full p-4 rounded-xl border-2 border-primary bg-primary/10 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 bg-primary/20 rounded-full mr-2">Custom</span>
                <span className="font-semibold text-foreground text-base">{custom.name}</span>
              </div>
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleStepBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Areas
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground font-semibold"
            onClick={handleStartFollowUp}
          >
            {selectedSymptoms.length > 0 ? `Continue (${selectedSymptoms.length} Selected)` : "Continue to General Review"}
          </Button>
        </div>
      </div>
    );
  };

  const renderFollowUpQuestions = () => {
    const currentSymptom = selectedSymptoms[currentSymptomIndex];
    if (!currentSymptom) {
      return (
        <div className="text-center p-6 space-y-4">
          <p className="text-muted">No specific symptom questions required.</p>
          <Button onClick={() => setStep("review")}>Proceed to Review</Button>
        </div>
      );
    }

    const progress = ((currentSymptomIndex + 1) / selectedSymptoms.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted font-medium">
              Symptom {currentSymptomIndex + 1} of {selectedSymptoms.length}: <strong>{currentSymptom.name}</strong>
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

        {/* ISL Sign Language Avatar Accessibility Card */}
        {showSignLanguageAvatar && (
          <SignLanguageAvatar
            currentText={`Rate the severity and duration for ${currentSymptom.name}.`}
            stepName="follow_up"
            language={selectedLanguage}
          />
        )}

        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            {currentSymptom.translations[selectedLanguage] || currentSymptom.name}
          </h2>
          <p className="text-sm text-muted">
            Provide additional details, or speak your answers
          </p>
        </div>

        <div className="space-y-5">
          {currentSymptom.followUpQuestions && currentSymptom.followUpQuestions.length > 0 ? (
            currentSymptom.followUpQuestions.map((question) => (
              <div key={question.id} className="space-y-2.5 p-4 rounded-xl bg-surface border border-border">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-foreground">
                    {question.translations[selectedLanguage] || question.question}
                  </label>
                  <VoiceInput
                    onTranscript={(spokenText) => {
                      if (question.type === "severity") {
                        const num = parseInt(spokenText.match(/\d+/)?.[0] || "5");
                        handleFollowUpResponse(question.id, Math.min(10, Math.max(1, num)));
                      } else if (question.options) {
                        const match = question.options.find(o => spokenText.toLowerCase().includes(o.label.toLowerCase()) || spokenText.toLowerCase().includes(o.value.toLowerCase()));
                        if (match) handleFollowUpResponse(question.id, match.value);
                      } else {
                        handleFollowUpResponse(question.id, spokenText);
                      }
                    }}
                    autoSpeakPrompt={question.translations[selectedLanguage] || question.question}
                    language={selectedLanguage}
                    size="sm"
                  />
                </div>

                {question.type === "severity" ? (
                  <div className="space-y-3 pt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentResponses[question.id] || 5}
                      onChange={(e) => handleFollowUpResponse(question.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between items-center text-xs text-muted">
                      <span>1 (Mild)</span>
                      <span className="text-sm font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">
                        Severity: {currentResponses[question.id] || 5}/10
                      </span>
                      <span>10 (Severe)</span>
                    </div>
                  </div>
                ) : question.options ? (
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option) => {
                      const isSelected = currentResponses[question.id] === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleFollowUpResponse(question.id, option.value)}
                          className={`p-3 rounded-lg border-2 transition-all text-left text-sm font-medium cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border hover:border-primary/40 bg-background text-foreground"
                          }`}
                        >
                          {option.translations[selectedLanguage] || option.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentResponses[question.id] as string || ""}
                      onChange={(e) => handleFollowUpResponse(question.id, e.target.value)}
                      className="flex-1 px-4 py-2.5 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-background text-foreground text-sm"
                      placeholder="Type your notes or duration..."
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 rounded-xl bg-muted/20 border border-border text-center text-sm text-muted">
              General consultation selected. Doctor will review all clinical findings in person.
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleStepBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentSymptomIndex === 0 ? "Back to Symptoms" : "Previous Symptom"}
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground font-semibold"
            onClick={handleNextSymptom}
          >
            {currentSymptomIndex < selectedSymptoms.length - 1 ? "Next Symptom" : "Review Intake"}
          </Button>
        </div>
      </div>
    );
  };

  const renderReview = () => (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">
          Review Case Summary
        </h2>
        <p className="text-sm text-muted">
          Verify your intake answers before generating OPD Queue Token
        </p>
      </div>

      {/* ISL Sign Language Avatar Accessibility Card */}
      {showSignLanguageAvatar && (
        <SignLanguageAvatar
          currentText="Review your recorded symptoms and confirm to issue your hospital OPD token."
          stepName="review"
          language={selectedLanguage}
        />
      )}

      {/* Priority Alert if any */}
      {priorityFlags.length > 0 && (
        <Card className="border-2 border-amber-300 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-amber-900 mb-1">
                  High Priority Triage Triggered
                </div>
                <ul className="space-y-1 text-xs text-amber-800">
                  {priorityFlags.map((flag, idx) => (
                    <li key={idx}>• {flag.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary of Symptoms */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {symptomResponses.map((res, idx) => (
          <Card key={idx} className="border border-border">
            <CardHeader className="py-3 px-4 bg-muted/20">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold text-foreground">{res.symptomName}</CardTitle>
                {res.severity !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary">
                    Severity: {res.severity}/10
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 text-xs space-y-1 text-muted">
              {Object.entries(res.responses).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="capitalize">{k.replace(/_/g, " ")}:</span>
                  <span className="font-medium text-foreground">{String(v)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 pt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleStepBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit Symptoms
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground font-semibold"
          onClick={handleCompleteVisit}
        >
          Confirm & Issue Token
        </Button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-6 py-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          OPD Token Issued Successfully!
        </h2>
        <p className="text-sm text-muted">
          Your clinical case has been routed to the attending physician
        </p>
      </div>

      {createdToken && (
        <Card className="border-2 border-primary bg-primary/5 max-w-sm mx-auto p-5">
          <div className="space-y-3 text-center">
            <div className="text-xs uppercase font-bold text-muted tracking-wider">
              Token Number
            </div>
            <div className="text-4xl font-extrabold text-primary font-mono tracking-wider">
              {createdToken.tokenNumber}
            </div>
            <div className="text-xs text-muted flex justify-between border-t border-border/50 pt-2">
              <span>Department:</span>
              <span className="font-semibold text-foreground uppercase">{createdToken.department}</span>
            </div>
            <div className="text-xs text-muted flex justify-between">
              <span>Estimated Wait:</span>
              <span className="font-semibold text-foreground">~{createdToken.estimatedWaitMinutes} Mins</span>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/patient/visits")}
        >
          View My Visits
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground font-semibold"
          onClick={() => router.push("/patient/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStepBack}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSignLanguageAvatar(!showSignLanguageAvatar)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                showSignLanguageAvatar
                  ? "bg-indigo-600 text-white border-indigo-700"
                  : "bg-surface text-muted border-border hover:text-foreground"
              }`}
            >
              <HandMetal className="w-3.5 h-3.5" />
              <span>ISL Sign Avatar {showSignLanguageAvatar ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <Card className="border border-border bg-surface shadow-sm">
          <CardContent className="p-6">
            {step === "body_system" && renderBodySystemSelection()}
            {step === "symptom_selection" && renderSymptomSelection()}
            {step === "follow_up" && renderFollowUpQuestions()}
            {step === "review" && renderReview()}
            {step === "complete" && renderComplete()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewVisit() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading New Visit...</div>}>
      <NewVisitContent />
    </Suspense>
  );
}
