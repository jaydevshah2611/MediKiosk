"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientNav } from "@/components/patient/PatientNav";
import { allIndiaHospitals, type ConnectedHospital } from "@/lib/hospitalsDatabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { InlineGuideBanner } from "@/components/ui/InlineGuideBanner";
import {
  Building2,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Search,
  Sparkles,
  Bed,
  Filter
} from "lucide-react";

export default function PatientHospitalsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.push("/");
      }
    }
  }, [router]);

  const uniqueStates = ["all", ...new Set(allIndiaHospitals.map(h => h.state))];

  const filteredHospitals = allIndiaHospitals.filter(h => {
    const matchesCategory = selectedCategory === "all" || h.category === selectedCategory;
    const matchesState = selectedState === "all" || h.state === selectedState;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q ||
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.state.toLowerCase().includes(q) ||
      h.departmentsAvailable.some(d => d.toLowerCase().includes(q));
    return matchesCategory && matchesState && matchesQuery;
  });

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
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-7 h-7 text-primary" /> {t("connected_hospitals_title")}
              </h1>
              <p className="text-sm text-muted">
                {t("connected_hospitals_subtitle")}
              </p>
            </div>
            <Button
              className="bg-primary text-primary-foreground font-semibold"
              onClick={() => router.push("/patient/new-visit")}
            >
              {t("get_token_now")}
            </Button>
          </div>

          {/* Inline Step Guide */}
          <InlineGuideBanner
            title="How to Select & Triage at Connected Hospitals"
            subtitle="Browse live wait times, available specialists, and route directly to hospital OPD queues"
            steps={[
              {
                stepNumber: 1,
                badge: "Filter & Search",
                title: "1. Filter by State or Specialty",
                description: "Search by hospital name, city, state, or specialty (e.g., Cardiology, AYUSH, AIIMS)."
              },
              {
                stepNumber: 2,
                badge: "Live Telemetry",
                title: "2. Check Queue & Beds",
                description: "Review live OPD wait times, on-duty doctors, available general beds, and ICU capacities."
              },
              {
                stepNumber: 3,
                badge: "Queue Booking",
                title: "3. Click 'Select & Triage'",
                description: "Directly pre-book your OPD token for that specific hospital wing and notify their desk."
              }
            ]}
          />

          {/* Search & Filter Bar */}
          <div className="space-y-3 bg-surface p-4 rounded-xl border border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by hospital name, city, state, or specialty (e.g. Cardiology, AYUSH, AIIMS)..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">All States & UTs</option>
                  {uniqueStates.filter(s => s !== "all").map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
              {["all", "Government / Apex", "AYUSH Institute", "District Hospital", "State Medical College", "Super Specialty", "Community Health Center"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {cat === "all" ? "All Centers" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted flex items-center justify-between">
            <span>Showing <strong>{filteredHospitals.length}</strong> verified healthcare facilities across India</span>
            <span>National ABDM Live Registry Sync active</span>
          </div>

          {/* Hospital Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredHospitals.map((hosp) => (
              <Card
                key={hosp.id}
                className="border border-border hover:border-primary/50 transition-all bg-surface hover:shadow-md flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                          {hosp.category}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/60 text-foreground border border-border">
                          📍 {hosp.city}, {hosp.state}
                        </span>
                        {hosp.abhaCertified && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> ABDM Certified
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground text-lg leading-snug">
                        {hosp.name}
                      </h3>
                      <div className="text-xs text-muted flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                        <span>{hosp.address} ({hosp.distance})</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-4 gap-1.5 text-center p-3 rounded-xl bg-background border border-border text-xs">
                    <div>
                      <div className="text-[11px] text-muted">Est. OPD Wait</div>
                      <div className="font-extrabold text-primary text-sm sm:text-base mt-0.5">~{hosp.currentWaitEstimate}m</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted">On-Duty Doctors</div>
                      <div className="font-extrabold text-foreground text-sm sm:text-base mt-0.5">{hosp.activeDoctorCount}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted">Beds Free</div>
                      <div className="font-extrabold text-emerald-600 text-sm sm:text-base mt-0.5">{hosp.availableBeds}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted">ICU Free</div>
                      <div className="font-extrabold text-purple-600 text-sm sm:text-base mt-0.5">{hosp.icuAvailable}</div>
                    </div>
                  </div>

                  {/* Departments Available */}
                  <div>
                    <div className="text-xs font-semibold text-muted mb-1.5">Specialties & OPD Wings:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {hosp.departmentsAvailable.map((dept, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted/40 text-foreground border border-border"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact info & Action */}
                  <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-muted">
                      <div>Contact: <strong className="text-foreground">{hosp.contact}</strong></div>
                      <div className="text-[11px] text-destructive font-medium">Emergency: {hosp.emergency}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const target = hosp.category.includes("AYUSH") ? "/patient/ayush" : "/patient/new-visit";
                          router.push(`${target}?hospitalId=${encodeURIComponent(hosp.id)}&hospitalName=${encodeURIComponent(hosp.name)}`);
                        }}
                        className="bg-primary text-primary-foreground font-semibold"
                      >
                        Select & Triage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
