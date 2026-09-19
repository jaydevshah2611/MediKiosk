"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Smartphone, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { savePatientSession, listRegisteredPatients } from "@/lib/patientSession";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import type { PatientUser } from "@/types/auth";

const DEMO_OTP = "123456";

export default function PatientLogin() {
  const router = useRouter();
  const { t } = useLanguage();

  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savedPatients, setSavedPatients] = useState<PatientUser[]>([]);

  useEffect(() => {
    setSavedPatients(listRegisteredPatients());
  }, []);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setMessage({ type: "error", text: "Please enter a valid 10-digit mobile number" });
      return;
    }

    setLoading(true);
    setMessage(null);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      setMessage({ type: "success", text: `Demo mode: Use OTP ${DEMO_OTP}` });
    }, 800);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setMessage({ type: "error", text: "Please enter a valid 6-digit OTP" });
      return;
    }

    setLoading(true);
    setMessage(null);
    setTimeout(() => {
      setLoading(false);
      if (otp === DEMO_OTP) {
        savePatientSession({ phone, name: fullName.trim() || undefined });
        router.push("/patient/dashboard");
      } else {
        setMessage({ type: "error", text: `Invalid OTP. Demo mode: Use ${DEMO_OTP}` });
      }
    }, 800);
  };

  const handleResendOTP = () => {
    setLoading(true);
    setMessage(null);
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: "success", text: `OTP resent. Demo mode: Use ${DEMO_OTP}` });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col medical-bg">
      <div className="glass border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t("back")}</span>
          </button>
          <div className="font-bold text-lg text-foreground">
            {t("patient")} {t("login")}
          </div>
          <LanguageSwitcher compact />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {message && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-success/10 border border-success/30 text-success"
                : "bg-danger/10 border border-danger/30 text-danger"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {message.text}
            </div>
          )}

          <Card className="border-2 border-primary/20 glass-card">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shadow-neon-purple">
                  <Smartphone className="w-8 h-8 text-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                {t("login")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!otpSent ? (
                <div className="space-y-4">
                  {savedPatients.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted">{t("saved_patients")}</p>
                      <div className="flex flex-wrap gap-2">
                        {savedPatients.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setPhone(p.phone);
                              setFullName(p.name);
                            }}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:border-primary bg-background"
                          >
                            {t("continue_as")} {p.name} ({p.phone})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("your_full_name")}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-glass text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("mobile_number")}
                    </label>
                    <div className="flex gap-2">
                      <div className="px-4 py-3 border-2 border-border rounded-lg bg-glass text-muted text-sm flex items-center">
                        +91
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="XXXXX XXXXX"
                        className="flex-1 px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-glass text-foreground"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSendOTP}
                    disabled={loading || phone.length !== 10}
                    className="w-full bg-primary hover:bg-primary-dark"
                  >
                    {loading ? "Sending..." : t("send_otp")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("otp")}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="1 2 3 4 5 6"
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-glass text-foreground text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                    <p className="text-sm text-muted mt-2 text-center">
                      OTP sent to +91 {phone}
                    </p>
                  </div>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-primary hover:bg-primary-dark"
                  >
                    {loading ? "Verifying..." : t("verify_otp")}
                  </Button>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => { setOtpSent(false); setOtp(""); setMessage(null); }}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      Change number
                    </button>
                    <button
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-sm text-primary hover:underline"
                    >
                      {t("resend_otp")}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <div className="text-sm text-muted">or</div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/auth/patient/register")}
            >
              {t("signup")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}