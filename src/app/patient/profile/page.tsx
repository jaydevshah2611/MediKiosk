"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientNav } from "@/components/patient/PatientNav";
import { type LanguageCode } from "@/lib/languages";
import { useLanguage } from "@/contexts/LanguageContext";
import { InlineGuideBanner } from "@/components/ui/InlineGuideBanner";
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  Heart,
  Calendar,
  MapPin,
  AlertCircle,
  Save,
  CheckCircle2,
  Lock,
  Pencil,
  Globe,
  Languages
} from "lucide-react";

export default function PatientProfilePage() {
  const router = useRouter();
  const { language, setLanguage, t, languages } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    abhaId: "",
    bloodGroup: "O+",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    allergies: "None known",
    chronicConditions: "None",
    preferredLanguage: "en" as LanguageCode
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        const lang = (parsed.preferredLanguage as LanguageCode) || language || "en";
        setFormData({
          name: parsed.name || "Aarav Sharma",
          age: parsed.age || "24",
          gender: parsed.gender || "Male",
          phone: parsed.phone || "+91 98765 43210",
          email: parsed.email || "patient@medikiosk.gov.in",
          abhaId: parsed.abhaId || "91-4829-1940-5821",
          bloodGroup: parsed.bloodGroup || "O+",
          address: parsed.address || "Near SG Highway, Bodakdev, Ahmedabad, Gujarat",
          emergencyContactName: parsed.emergencyContactName || "Family Guardian",
          emergencyContactPhone: parsed.emergencyContactPhone || "+91 98765 00000",
          allergies: parsed.allergies || "Penicillin, Dust Pollen",
          chronicConditions: parsed.chronicConditions || "Mild Seasonal Asthma",
          preferredLanguage: lang
        });
      } else {
        router.push("/");
      }
    }
  }, [router, language]);

  const handleLanguageSelect = (langCode: LanguageCode) => {
    setFormData(prev => ({ ...prev, preferredLanguage: langCode }));
    setLanguage(langCode);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      const updatedUser = {
        ...user,
        ...formData
      };
      setLanguage(formData.preferredLanguage);
      setUser(updatedUser);
      setIsEditing(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PatientHeader user={user} />

      <div className="max-w-7xl w-full mx-auto px-4 pt-2">
        <PatientNav />
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Inline Step Guide */}
          <InlineGuideBanner
            title="How to Manage Your Health Profile & Language"
            subtitle="Update personal details, ABHA identification, emergency contacts, and regional language"
            steps={[
              {
                stepNumber: 1,
                badge: "Identity",
                title: "1. Update Medical Details",
                description: "Click 'Edit Profile' to update blood group, emergency numbers, and chronic conditions."
              },
              {
                stepNumber: 2,
                badge: "Multilingual",
                title: "2. Change Language",
                description: "Select any regional language card (Hindi, Gujarati, Marathi, Tamil, etc.) to immediately translate all views."
              },
              {
                stepNumber: 3,
                badge: "ABHA Sync",
                title: "3. Verify ABHA Card",
                description: "Your 14-digit ABHA ID links all hospital visits and OCR documents seamlessly across the ABDM network."
              }
            ]}
          />

          {/* Profile Header Banner */}
          <Card className="border border-border bg-surface overflow-hidden shadow-sm">
            <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/10 to-surface border-b border-border" />
            <CardContent className="p-6 relative pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-surface border-4 border-surface shadow-md flex items-center justify-center bg-primary/20 text-primary">
                    <User className="w-12 h-12" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <span>{formData.name}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> ABHA Verified
                      </span>
                    </h1>
                    <p className="text-xs text-muted">ABHA ID: <strong className="font-mono text-foreground">{formData.abhaId}</strong></p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        {t("cancel")}
                      </Button>
                      <Button size="sm" onClick={handleSave} className="bg-primary text-primary-foreground font-semibold">
                        <Save className="w-4 h-4 mr-1.5" /> {t("submit")}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {isSaved && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 mb-3 animate-fade-in-up">
                  <CheckCircle2 className="w-4 h-4" /> Profile details and language preference updated successfully!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Preference Card */}
          <Card className="border border-border bg-surface">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary" /> {t("select_language")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs text-muted">
                Select your preferred regional language. All voice assistants, intake forms, and case notes will adapt to your chosen language.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageSelect(lang.code as LanguageCode)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      language === lang.code
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs scale-102"
                        : "border-border hover:border-primary/40 bg-background text-foreground"
                    }`}
                  >
                    <div className="text-sm font-semibold">{lang.native}</div>
                    <div className="text-[11px] text-muted font-normal">{lang.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Details Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Personal Details */}
            <Card className="border border-border bg-surface">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                    />
                  ) : (
                    <div className="font-semibold text-foreground">{formData.name}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1">Age</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                      />
                    ) : (
                      <div className="font-semibold text-foreground">{formData.age} Years</div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1">Gender</label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="font-semibold text-foreground">{formData.gender}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                      />
                    ) : (
                      <div className="font-semibold text-foreground">{formData.phone}</div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1">Blood Group</label>
                    {isEditing ? (
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    ) : (
                      <div className="font-bold text-primary">{formData.bloodGroup}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Residential Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                    />
                  ) : (
                    <div className="text-muted text-xs">{formData.address}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Medical Background & Emergency Contact */}
            <Card className="border border-border bg-surface">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-destructive" /> Medical Conditions & Emergency
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Known Allergies</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                    />
                  ) : (
                    <div className="text-xs font-medium text-foreground bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                      {formData.allergies}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Chronic Conditions / Ongoing Illness</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.chronicConditions}
                      onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                    />
                  ) : (
                    <div className="text-xs font-medium text-foreground bg-primary/5 border border-primary/20 p-2 rounded-lg">
                      {formData.chronicConditions}
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-3">
                  <div className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-destructive" /> Emergency Contact Details
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted block mb-1">Contact Person</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <div className="font-semibold text-foreground text-xs">{formData.emergencyContactName}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">Contact Phone</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <div className="font-semibold text-foreground text-xs">{formData.emergencyContactPhone}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
}
