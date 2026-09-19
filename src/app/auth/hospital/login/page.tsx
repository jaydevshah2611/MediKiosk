"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  FileCheck2,
  Lock,
  Hospital,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { allIndiaHospitals } from "@/lib/hospitalsDatabase";

export default function HospitalLogin() {
  const router = useRouter();
  const { language, t } = useLanguage();

  // Form states
  const [loginMethod, setLoginMethod] = useState<"registry" | "quick_select">("quick_select");
  const [selectedHospitalId, setSelectedHospitalId] = useState(allIndiaHospitals[0]?.id || "hosp-civil-ahmedabad");
  const [hospitalRegNo, setHospitalRegNo] = useState("REG-GU-CIVIL-2026");
  const [adminUsername, setAdminUsername] = useState("admin.civil");
  const [adminPassword, setAdminPassword] = useState("Hospital@2026");
  const [adminRole, setAdminRole] = useState<"admin" | "nodal_officer" | "triage_coordinator">("admin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selectedHospitalData = allIndiaHospitals.find(h => h.id === selectedHospitalId) || allIndiaHospitals[0];

  const handleHospitalQuickSelect = (hospId: string) => {
    setSelectedHospitalId(hospId);
    const hosp = allIndiaHospitals.find(h => h.id === hospId);
    if (hosp) {
      const slug = hosp.name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      setHospitalRegNo(`REG-${hosp.state.substring(0, 2).toUpperCase()}-${slug.toUpperCase()}-2026`);
      setAdminUsername(`admin.${slug}`);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminUsername || !adminPassword) {
      setMessage({ type: "error", text: "Please provide valid administrative credentials." });
      return;
    }

    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      const hospitalObj = selectedHospitalData;
      const hospitalUser = {
        id: `HOSP-${Date.now()}`,
        role: "hospital",
        name: `${hospitalObj.name} (Admin Center)`,
        hospitalName: hospitalObj.name,
        hospitalRegistrationNumber: hospitalRegNo || `REG-IND-${hospitalObj.id.toUpperCase()}`,
        address: `${hospitalObj.address}, ${hospitalObj.city}, ${hospitalObj.state}`,
        adminUsername: adminUsername,
        adminRole: adminRole,
        abhaCertified: hospitalObj.abhaCertified,
        category: hospitalObj.category,
        totalBeds: hospitalObj.totalBeds,
        availableBeds: hospitalObj.availableBeds,
        icuAvailable: hospitalObj.icuAvailable,
        activeDoctors: hospitalObj.activeDoctorCount,
        preferredLanguage: language,
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem("currentUser", JSON.stringify(hospitalUser));
      localStorage.setItem("userRole", "hospital");
      localStorage.setItem("authToken", `ndhm-hosp-token-${Date.now()}`);

      setLoading(false);
      setMessage({ type: "success", text: "ABDM Hospital Node Authenticated. Redirecting..." });

      setTimeout(() => {
        router.push("/hospital/dashboard");
      }, 400);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col medical-bg">
      {/* Top Bar */}
      <div className="glass border-b border-primary/20 bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("back_to_home")}</span>
          </button>
          <div className="font-bold text-base text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>{t("hospital_node_gateway")}</span>
          </div>
          <LanguageSwitcher compact />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full space-y-5">
          {message && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-destructive/10 border border-destructive/30 text-destructive"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {message.text}
            </div>
          )}

          <Card className="border-2 border-primary/20 bg-surface shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4 border-b border-border text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <Hospital className="w-7 h-7" />
              </div>
              <CardTitle className="text-2xl font-black text-foreground">
                {t("hospital_opd_login")}
              </CardTitle>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Secure institutional authentication for Hospital Administrators, OPD In-charges, and Nodal Triage Officers.
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {/* Method Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-background rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setLoginMethod("quick_select")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    loginMethod === "quick_select"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Select Connected Hospital
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("registry")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    loginMethod === "registry"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Manual ROHINI / ABDM ID
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Connected Hospital Selection */}
                {loginMethod === "quick_select" ? (
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary" /> Select Healthcare Facility (All India)
                    </label>
                    <select
                      value={selectedHospitalId}
                      onChange={(e) => handleHospitalQuickSelect(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary font-medium"
                    >
                      {allIndiaHospitals.map((hosp) => (
                        <option key={hosp.id} value={hosp.id}>
                          {hosp.name} — {hosp.city}, {hosp.state} ({hosp.category})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-primary" /> Hospital Registry / ROHINI / ABDM Facility Code
                    </label>
                    <input
                      type="text"
                      required
                      value={hospitalRegNo}
                      onChange={(e) => setHospitalRegNo(e.target.value)}
                      placeholder="e.g. AIIMS-ND-NDHM-9021 or ROHINI-882103"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                )}

                {/* Facility summary chip */}
                {selectedHospitalData && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{selectedHospitalData.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">
                        ABDM Verified Facility
                      </span>
                    </div>
                    <div className="text-muted text-[11px] flex flex-wrap gap-x-3">
                      <span>📍 {selectedHospitalData.city}, {selectedHospitalData.state}</span>
                      <span>🛏️ {selectedHospitalData.totalBeds} Beds ({selectedHospitalData.availableBeds} Free)</span>
                      <span>👨‍⚕️ {selectedHospitalData.activeDoctorCount} On Duty</span>
                    </div>
                  </div>
                )}

                {/* Admin Role selection */}
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Administrative Station Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: "admin", label: "Medical Supdt. / Admin" },
                      { role: "nodal_officer", label: "OPD Nodal Officer" },
                      { role: "triage_coordinator", label: "Triage Desk Lead" },
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setAdminRole(item.role as any)}
                        className={`p-2 rounded-xl border text-center transition-all text-xs font-semibold ${
                          adminRole === item.role
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Username & Password Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-primary" /> Admin ID / User ID
                    </label>
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="e.g. admin.aiims"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-primary" /> Institutional Password
                    </label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all mt-2"
                >
                  {loading ? "Verifying Institutional ABDM Credentials..." : "Authenticate Hospital Administration Node →"}
                </Button>
              </form>

              {/* Demo Hint Helper */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Pre-filled Demo Credentials:
                </div>
                <div>Select any hospital from the list or use:</div>
                <div className="font-mono text-[10px] text-foreground font-semibold">
                  Admin ID: <span className="text-primary">{adminUsername || "admin.aiims"}</span> | Password: <span className="text-primary">Hospital@2026</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <button
              onClick={() => router.push("/auth/hospital/register")}
              className="text-xs text-muted hover:text-primary transition-colors underline font-medium"
            >
              Register a New Hospital Facility or Community Health Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
