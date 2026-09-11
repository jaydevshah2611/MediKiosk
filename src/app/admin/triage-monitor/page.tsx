"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, User, ArrowRight, RefreshCw } from "lucide-react";

interface TriagePatient {
  id: string;
  token: string;
  name: string;
  age: number;
  redFlag: string;
  triggeredAt: string;
  timeSinceFlag: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

export default function TriageMonitor() {
  // Mock data
  const triagePatients: TriagePatient[] = [
    {
      id: "1",
      token: "A-455",
      name: "Sunita Devi",
      age: 55,
      redFlag: "Chest pain and shortness of breath",
      triggeredAt: new Date(Date.now() - 3 * 60000).toISOString(),
      timeSinceFlag: 3,
      acknowledged: false,
    },
    {
      id: "2",
      token: "A-452",
      name: "Rajesh Kumar",
      age: 45,
      redFlag: "High severity headache (7/10) with dizziness",
      triggeredAt: new Date(Date.now() - 12 * 60000).toISOString(),
      timeSinceFlag: 12,
      acknowledged: true,
      acknowledgedBy: "Dr. Sharma",
    },
    {
      id: "3",
      token: "A-460",
      name: "Mohammed Ali",
      age: 62,
      redFlag: "Difficulty breathing and high fever",
      triggeredAt: new Date(Date.now() - 5 * 60000).toISOString(),
      timeSinceFlag: 5,
      acknowledged: false,
    },
  ];

  const unacknowledgedCount = triagePatients.filter((p) => !p.acknowledged).length;

  const handleAcknowledge = (patientId: string) => {
    // In real implementation, this would acknowledge the red flag
    console.log("Acknowledging patient:", patientId);
  };

  const handleViewPatient = (patientId: string) => {
    // In real implementation, this would navigate to patient detail
    console.log("Viewing patient:", patientId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Triage Monitor</h1>
              <p className="text-sm text-muted">Real-time red flag monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={unacknowledgedCount > 0 ? "destructive" : "outline"}>
                {unacknowledgedCount} Unacknowledged
              </Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Active Red Flags</p>
                  <p className="text-3xl font-bold text-danger">{triagePatients.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Unacknowledged</p>
                  <p className="text-3xl font-bold text-warning">{unacknowledgedCount}</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Avg Response Time</p>
                  <p className="text-3xl font-bold text-success">4.2m</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Triage List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Red Flagged Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {triagePatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border-2 ${
                    patient.acknowledged
                      ? "border-success bg-success/5"
                      : "border-danger bg-danger/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className={`w-5 h-5 ${
                          patient.acknowledged ? "text-success" : "text-danger"
                        }`} />
                        <span className="font-semibold text-foreground">
                          {patient.name} ({patient.age})
                        </span>
                        <Badge variant="outline">{patient.token}</Badge>
                        {patient.acknowledged && (
                          <Badge className="bg-success">Acknowledged</Badge>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-muted">Red Flag: </span>
                        <span className="text-sm text-foreground">{patient.redFlag}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {patient.timeSinceFlag}m ago
                        </span>
                        {patient.acknowledged && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            By {patient.acknowledgedBy}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!patient.acknowledged && (
                        <Button
                          size="sm"
                          onClick={() => handleAcknowledge(patient.id)}
                          className="bg-success"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        View
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
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