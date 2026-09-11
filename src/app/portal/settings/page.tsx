"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Shield, Lock, Palette, LogOut, Save } from "lucide-react";

export default function PortalSettings() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted">Dr. Sharma • General Medicine</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <Input defaultValue="Dr." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <Input defaultValue="Sharma" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input defaultValue="dr.sharma@hospital.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Specialization</label>
                <Input defaultValue="General Medicine" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Medical License Number</label>
                <Input defaultValue="MLN-12345-67890" />
              </div>
              <Button className="bg-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Red Flag Alerts</div>
                  <div className="text-sm text-muted">
                    Get notified when patients with red flags are added to queue
                  </div>
                </div>
                <Badge className="bg-success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Queue Updates</div>
                  <div className="text-sm text-muted">
                    Real-time updates when patients are added or removed
                  </div>
                </div>
                <Badge className="bg-success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Email Summaries</div>
                  <div className="text-sm text-muted">
                    Daily summary of completed consultations
                  </div>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="outline">
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Dark Mode</div>
                  <div className="text-sm text-muted">
                    Switch between light and dark themes
                  </div>
                </div>
                <Badge variant="outline">Light</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <div className="font-medium text-foreground">High Contrast</div>
                  <div className="text-sm text-muted">
                    Increase contrast for better visibility
                  </div>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Large Text</div>
                  <div className="text-sm text-muted">
                    Increase font size for better readability
                  </div>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-danger">
            <CardHeader>
              <CardTitle className="text-xl text-danger">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Sign Out</div>
                  <div className="text-sm text-muted">
                    Sign out from all devices
                  </div>
                </div>
                <Button variant="destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}