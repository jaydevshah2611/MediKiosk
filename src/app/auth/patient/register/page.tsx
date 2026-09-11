"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, User, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation, languages, type LanguageCode } from "@/lib/languages";
import { type PatientUser } from "@/types/auth";

type RegistrationStep = "language" | "basic" | "identification" | "consent" | "verification" | "complete";

export default function PatientRegister() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>("language");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const { t } = useTranslation(selectedLanguage);
  
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "" as "male" | "female" | "other" | "prefer_not_to_say",
    phone: "",
    hasABHA: false,
    abhaId: "",
    consent: false,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: "language", label: "Language", completed: step !== "language" },
    { id: "basic", label: "Basic Info", completed: ["identification", "consent", "verification", "complete"].includes(step) },
    { id: "identification", label: "Health ID", completed: ["consent", "verification", "complete"].includes(step) },
    { id: "consent", label: "Consent", completed: ["verification", "complete"].includes(step) },
    { id: "verification", label: "Verify", completed: step === "complete" },
  ];

  const handleLanguageSelect = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    setTimeout(() => setStep("basic"), 300);
  };

  const handleBasicInfoSubmit = () => {
    if (!formData.name || !formData.dateOfBirth || !formData.gender || !formData.phone) {
      alert("Please fill all fields");
      return;
    }
    setStep("identification");
  };

  const handleIdentificationSubmit = () => {
    if (formData.hasABHA && !formData.abhaId) {
      alert("Please enter your ABHA ID");
      return;
    }
    setStep("consent");
  };

  const handleConsentSubmit = () => {
    if (!formData.consent) {
      alert("Please agree to the consent terms");
      return;
    }
    setStep("verification");
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    // Simulate account creation
    setTimeout(() => {
      setLoading(false);
      setStep("complete");
    }, 1000);
  };

  const handleComplete = () => {
    // Store user data (in real app, this would be sent to backend)
    const userData: PatientUser = {
      id: `P${Date.now()}`,
      role: "patient",
      preferredLanguage: selectedLanguage,
      phone: formData.phone,
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      abhaId: formData.hasABHA ? formData.abhaId : undefined,
      createdAt: new Date().toISOString(),
    };
    
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(userData));
    }
    router.push("/patient/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case "language":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">
                {t("select_language")}
              </h2>
              <p className="text-sm text-muted text-center">
                This will be your default portal language
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedLanguage === lang.code
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-surface"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground mb-1">
                      {lang.native}
                    </div>
                    <div className="text-sm text-muted">{lang.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "basic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("full_name")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("date_of_birth")}
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("gender")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["male", "female", "other", "prefer_not_to_say"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setFormData({ ...formData, gender: gender as any })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.gender === gender
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-surface"
                    }`}
                  >
                    <div className="text-center text-sm font-medium text-foreground">
                      {t(gender)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("mobile_number")}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
                maxLength={10}
              />
            </div>
            <Button onClick={handleBasicInfoSubmit} className="w-full bg-primary">
              {t("continue")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case "identification":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
                Do you already have an ABHA ID?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({ ...formData, hasABHA: true })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.hasABHA
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-surface"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-foreground mb-1">Yes, I have ABHA</div>
                  </div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, hasABHA: false })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    !formData.hasABHA
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-surface"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-foreground mb-1">I don't have ABHA</div>
                  </div>
                </button>
              </div>
            </div>
            {formData.hasABHA && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ABHA ID
                </label>
                <input
                  type="text"
                  value={formData.abhaId}
                  onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                  placeholder="Enter your ABHA ID"
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
                />
              </div>
            )}
            <Button onClick={handleIdentificationSubmit} className="w-full bg-primary">
              {t("continue")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case "consent":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
                {t("consent_title")}
              </h2>
              <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
                <p className="text-sm text-foreground">
                  We will use your information to:
                </p>
                <ul className="space-y-2 text-sm text-muted">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Create your medical case history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Process your uploaded documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Prepare information for your doctor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Maintain your healthcare records</span>
                  </li>
                </ul>
                <p className="text-sm text-foreground mt-4">
                  Your information will only be shared according to your permissions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="consent" className="text-sm text-foreground cursor-pointer">
                {t("i_agree")}
              </label>
            </div>
            <Button onClick={handleConsentSubmit} className="w-full bg-primary">
              {t("continue")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case "verification":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
                Verify your mobile number
              </h2>
              <p className="text-sm text-muted text-center">
                OTP sent to: +91 {formData.phone}
              </p>
            </div>
            {!otpSent ? (
              <Button onClick={handleSendOTP} disabled={loading} className="w-full bg-primary">
                {loading ? "Sending..." : t("send_otp")}
              </Button>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="w-full bg-primary">
                  {loading ? "Verifying..." : t("verify_otp")}
                </Button>
                <button className="w-full text-sm text-primary hover:underline">
                  {t("resend_otp")}
                </button>
              </div>
            )}
          </div>
        );

      case "complete":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Account Created
              </h2>
              <p className="text-muted">Welcome!</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4 text-left">
              <div className="text-sm text-muted mb-1">Preferred Language:</div>
              <div className="font-medium text-foreground">
                {languages.find(l => l.code === selectedLanguage)?.native}
              </div>
            </div>
            <Button onClick={handleComplete} className="w-full bg-primary">
              Go to Patient Portal
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/auth/patient/login")}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t("back")}</span>
          </button>
          <div className="font-bold text-lg text-foreground">
            {t("patient")} {t("signup")}
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Progress Steps */}
      {step !== "complete" && (
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        s.completed
                          ? "bg-primary text-primary-foreground"
                          : step === s.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface border-2 border-border text-muted"
                      }`}
                    >
                      {s.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="text-xs mt-1 text-muted">{s.label}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        s.completed ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                {step === "complete" ? "✓" : t("signup")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}