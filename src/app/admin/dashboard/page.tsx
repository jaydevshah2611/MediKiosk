"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, AlertTriangle, FileText, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  // Mock data for charts
  const dailyVolumeData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 52 },
    { name: "Wed", value: 48 },
    { name: "Thu", value: 61 },
    { name: "Fri", value: 55 },
    { name: "Sat", value: 38 },
    { name: "Sun", value: 32 },
  ];

  const avgPrepTimeData = [
    { name: "Week 1", value: 12 },
    { name: "Week 2", value: 10 },
    { name: "Week 3", value: 8 },
    { name: "Week 4", value: 7 },
  ];

  const complaintDistributionData = [
    { name: "Fever", value: 35 },
    { name: "Headache", value: 25 },
    { name: "Joint Pain", value: 20 },
    { name: "Cough", value: 15 },
    { name: "Other", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted">Hospital Operations • MediKiosk</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">System Status: Online</Badge>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Daily Volume</p>
                  <p className="text-3xl font-bold text-foreground">284</p>
                  <p className="text-xs text-success mt-1">+12% from yesterday</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Avg Prep Time</p>
                  <p className="text-3xl font-bold text-foreground">7.2m</p>
                  <p className="text-xs text-success mt-1">-18% from last week</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Red Flags Today</p>
                  <p className="text-3xl font-bold text-danger">8</p>
                  <p className="text-xs text-muted mt-1">3 acknowledged</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Documents Processed</p>
                  <p className="text-3xl font-bold text-foreground">456</p>
                  <p className="text-xs text-success mt-1">98% success rate</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            data={dailyVolumeData}
            type="bar"
            title="Daily Patient Volume"
            xAxisKey="name"
            dataKey="value"
          />
          <AnalyticsChart
            data={avgPrepTimeData}
            type="line"
            title="Average Preparation Time (minutes)"
            xAxisKey="name"
            dataKey="value"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            data={complaintDistributionData}
            type="pie"
            title="Common Complaints Distribution"
            dataKey="value"
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <div className="font-medium text-foreground">API Server</div>
                    <div className="text-sm text-muted">Response time: 45ms</div>
                  </div>
                </div>
                <Badge className="bg-success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <div className="font-medium text-foreground">Database</div>
                    <div className="text-sm text-muted">Connections: 12/20</div>
                  </div>
                </div>
                <Badge className="bg-success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <div className="font-medium text-foreground">OCR Service</div>
                    <div className="text-sm text-muted">Queue: 3 pending</div>
                  </div>
                </div>
                <Badge className="bg-success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <div>
                    <div className="font-medium text-foreground">AI Pipeline</div>
                    <div className="text-sm text-muted">High load detected</div>
                  </div>
                </div>
                <Badge className="bg-warning">Degraded</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <AlertTriangle className="w-6 h-6" />
                <span>View Triage</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>AI Quality</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span>Integrations</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Staff Mgmt</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}