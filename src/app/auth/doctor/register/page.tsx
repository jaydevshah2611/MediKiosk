"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Stethoscope, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation, languages, type LanguageCode } from "@/lib/languages";
import { type DoctorUser } from "@/types/auth";

type RegistrationStep = "language" | "professional" | "verification" | "complete";

export default function DoctorRegister() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>("language");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const { t } = useTranslation(selectedLanguage);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    medicalRegistrationNumber: "",
    specialization: "",
    qualification: "",
    hospital: "",
    department: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: "language", label: "Language", completed: step !== "language" },
    { id: "professional", label: "Professional", completed: ["verification", "complete"].includes(step) },
    { id: "verification", label: "Verify", completed: step === "complete" },
  ];

  const handleLanguageSelect = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    setTimeout(() => setStep("professional"), 300);
  };

  const handleProfessionalSubmit = () => {
    if (!formData.name || !formData.phone || !formData.email || 
        !formData.medicalRegistrationNumber || !formData.specialization || 
        !formData.qualification || !formData.hospital || !formData.department) {
      alert("Please fill all fields");
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
    setTimeout(() => {
      setLoading(false);
      setStep("complete");
    }, 1000);
  };

  const handleComplete = () => {
    const userData: DoctorUser = {
      id: `D${Date.now()}`,
      role: "doctor",
      preferredLanguage: selectedLanguage,
      phone: formData.phone,
      email: formData.email,
      name: formData.name,
      medicalRegistrationNumber: formData.medicalRegistrationNumber,
      specialization: formData.specialization,
      qualification: formData.qualification,
      hospitalId: formData.hospital,
      department: formData.department,
      verificationStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(userData));
    }
    router.push("/doctor/dashboard");
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

      case "professional":
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
                placeholder="Dr. Full Name"
              />
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@hospital.com"
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Medical Registration Number
              </label>
              <input
                type="text"
                value={formData.medicalRegistrationNumber}
                onChange={(e) => setFormData({ ...formData, medicalRegistrationNumber: e.target.value })}
                placeholder="Enter your medical registration number"
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g., General Medicine, Cardiology"
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g., MBBS, MD"
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Hospital / Clinic
              </label>
              <input
                type="text"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                placeholder="Hospital or clinic name"
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Department name"
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
              />
            </div>
            <Button onClick={handleProfessionalSubmit} className="w-full bg-primary">
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
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Registration Submitted
              </h2>
              <p className="text-muted">Your account is pending verification</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4 text-left space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-foreground">
                  Verification Status: <span className="font-medium">Pending</span>
                </span>
              </div>
              <div className="text-sm text-muted">
                Your professional details will be verified by the hospital administration. You will be notified once your account is verified.
              </div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4 text-left">
              <div className="text-sm text-muted mb-1">Preferred Language:</div>
              <div className="font-medium text-foreground">
                {languages.find(l => l.code === selectedLanguage)?.native}
              </div>
            </div>
            <Button onClick={handleComplete} className="w-full bg-primary">
              Go to Doctor Portal
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
            onClick={() => router.push("/auth/doctor/login")}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t("back")}</span>
          </button>
          <div className="font-bold text-lg text-foreground">
            {t("doctor")} {t("signup")}
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
                  <Stethoscope className="w-8 h-8 text-primary" />
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