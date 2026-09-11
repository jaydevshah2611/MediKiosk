"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, AlertTriangle, User, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PatientQueue {
  id: string;
  token: string;
  name: string;
  age: number;
  chiefComplaint: string;
  waitingTime: number;
  redFlag: boolean;
  priority: "normal" | "urgent" | "emergency";
}

export default function PortalDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "redflag" | "normal">("all");

  // Mock data - in real implementation, this would come from an API
  const patientQueue: PatientQueue[] = [
    {
      id: "1",
      token: "A-452",
      name: "Rajesh Kumar",
      age: 45,
      chiefComplaint: "Persistent headaches with dizziness",
      waitingTime: 12,
      redFlag: true,
      priority: "urgent",
    },
    {
      id: "2",
      token: "A-453",
      name: "Priya Sharma",
      age: 32,
      chiefComplaint: "Fever and body ache",
      waitingTime: 8,
      redFlag: false,
      priority: "normal",
    },
    {
      id: "3",
      token: "A-454",
      name: "Amit Patel",
      age: 28,
      chiefComplaint: "Routine checkup",
      waitingTime: 5,
      redFlag: false,
      priority: "normal",
    },
    {
      id: "4",
      token: "A-455",
      name: "Sunita Devi",
      age: 55,
      chiefComplaint: "Chest pain and shortness of breath",
      waitingTime: 3,
      redFlag: true,
      priority: "emergency",
    },
    {
      id: "5",
      token: "A-456",
      name: "Vikram Singh",
      age: 38,
      chiefComplaint: "Joint pain",
      waitingTime: 15,
      redFlag: false,
      priority: "normal",
    },
  ];

  const filteredPatients = patientQueue.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.token.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "redflag" && patient.redFlag) ||
      (filterStatus === "normal" && !patient.redFlag);
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-danger text-white";
      case "urgent":
        return "bg-warning text-white";
      default:
        return "bg-success text-white";
    }
  };

  const handlePatientClick = (patientId: string) => {
    router.push(`/portal/patient/${patientId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Physician Portal</h1>
              <p className="text-sm text-muted">Dr. Sharma • General Medicine</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Settings
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Total Patients</p>
                  <p className="text-3xl font-bold text-foreground">{patientQueue.length}</p>
                </div>
                <User className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Red Flags</p>
                  <p className="text-3xl font-bold text-danger">
                    {patientQueue.filter((p) => p.redFlag).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(patientQueue.reduce((acc, p) => acc + p.waitingTime, 0) / patientQueue.length)}m
                  </p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Completed Today</p>
                  <p className="text-3xl font-bold text-success">12</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Queue */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Today's Queue</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "redflag" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("redflag")}
                  >
                    Red Flags
                  </Button>
                  <Button
                    variant={filterStatus === "normal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("normal")}
                  >
                    Normal
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-foreground">{patient.name}</span>
                      <Badge className={getPriorityColor(patient.priority)}>
                        {patient.priority}
                      </Badge>
                      {patient.redFlag && (
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Red Flag
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted">
                      <span>Token: {patient.token}</span>
                      <span>Age: {patient.age}</span>
                      <span className="truncate max-w-md">{patient.chiefComplaint}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted">Waiting</div>
                      <div className="font-semibold text-foreground">
                        {patient.waitingTime}m
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}