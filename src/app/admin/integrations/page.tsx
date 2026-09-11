"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Link2, Database } from "lucide-react";

interface IntegrationStatus {
  name: string;
  status: "connected" | "disconnected" | "degraded";
  lastSync: string;
  dataFlow: string;
}

export default function IntegrationsPage() {
  const integrations: IntegrationStatus[] = [
    {
      name: "Hospital Information System (HIS)",
      status: "connected",
      lastSync: "2 min ago",
      dataFlow: "Bi-directional",
    },
    {
      name: "ABDM Health ID",
      status: "connected",
      lastSync: "5 min ago",
      dataFlow: "Outbound",
    },
    {
      name: "Lab Information System",
      status: "degraded",
      lastSync: "1 hour ago",
      dataFlow: "Inbound",
    },
    {
      name: "Pharmacy System",
      status: "connected",
      lastSync: "10 min ago",
      dataFlow: "Outbound",
    },
    {
      name: "ABDM Consent Manager",
      status: "connected",
      lastSync: "3 min ago",
      dataFlow: "Bi-directional",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-success";
      case "disconnected":
        return "bg-danger";
      case "degraded":
        return "bg-warning";
      default:
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5" />;
      case "disconnected":
        return <XCircle className="w-5 h-5" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleSync = (integrationName: string) => {
    console.log("Syncing:", integrationName);
  };

  const handleConfigure = (integrationName: string) => {
    console.log("Configuring:", integrationName);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
              <p className="text-sm text-muted">External system connections and sync status</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh All
              </Button>
              <Button size="sm" className="bg-primary">
                Add Integration
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overall Status */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">System Integration Health</div>
                  <div className="text-sm text-muted">
                    4 of 5 integrations operational
                  </div>
                </div>
              </div>
              <Badge className="bg-success">Good</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Integration Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.name} className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(integration.status)}
                  <span className="text-sm text-muted">
                    Last sync: {integration.lastSync}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted" />
                  <span className="text-sm text-muted">
                    Data flow: {integration.dataFlow}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(integration.name)}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Sync Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfigure(integration.name)}
                  >
                    <Link2 className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FHIR/ABDM Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl">FHIR & ABDM Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">FHIR R4 Resources</h3>
                <div className="space-y-2">
                  {["Patient", "Observation", "Condition", "MedicationRequest", "DocumentReference"].map((resource) => (
                    <div key={resource} className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="text-sm text-foreground">{resource}</span>
                      <Badge className="bg-success text-xs">Compliant</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">ABDM Services</h3>
                <div className="space-y-2">
                  {[
                    { name: "Health ID Verification", status: "Active" },
                    { name: "Consent Manager", status: "Active" },
                    { name: "Health Data Fetch", status: "Active" },
                    { name: "HIP Linking", status: "Active" },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="text-sm text-foreground">{service.name}</span>
                      <Badge className="bg-success text-xs">{service.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}