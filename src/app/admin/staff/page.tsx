"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, Plus, Search, Edit2, Trash2, Shield } from "lucide-react";
import { useState } from "react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: "active" | "inactive";
  lastActive: string;
}

export default function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const staffMembers: StaffMember[] = [
    {
      id: "1",
      name: "Dr. Sharma",
      role: "Physician",
      department: "General Medicine",
      email: "dr.sharma@hospital.com",
      status: "active",
      lastActive: "5 min ago",
    },
    {
      id: "2",
      name: "Dr. Patel",
      role: "Physician",
      department: "Cardiology",
      email: "dr.patel@hospital.com",
      status: "active",
      lastActive: "2 hours ago",
    },
    {
      id: "3",
      name: "Nurse Johnson",
      role: "Nurse",
      department: "OPD",
      email: "nurse.johnson@hospital.com",
      status: "active",
      lastActive: "10 min ago",
    },
    {
      id: "4",
      name: "Admin Smith",
      role: "Administrator",
      department: "IT",
      email: "admin.smith@hospital.com",
      status: "active",
      lastActive: "1 hour ago",
    },
    {
      id: "5",
      name: "Dr. Williams",
      role: "Physician",
      department: "Pediatrics",
      email: "dr.williams@hospital.com",
      status: "inactive",
      lastActive: "3 days ago",
    },
  ];

  const filteredStaff = staffMembers.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = () => {
    console.log("Add staff member");
  };

  const handleEditStaff = (staffId: string) => {
    console.log("Edit staff:", staffId);
  };

  const handleDeleteStaff = (staffId: string) => {
    console.log("Delete staff:", staffId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
              <p className="text-sm text-muted">Manage hospital staff and access control</p>
            </div>
            <Button size="sm" className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Total Staff</p>
                  <p className="text-3xl font-bold text-foreground">{staffMembers.length}</p>
                </div>
                <User className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Active</p>
                  <p className="text-3xl font-bold text-success">
                    {staffMembers.filter((s) => s.status === "active").length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Physicians</p>
                  <p className="text-3xl font-bold text-foreground">
                    {staffMembers.filter((s) => s.role === "Physician").length}
                  </p>
                </div>
                <User className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Nurses</p>
                  <p className="text-3xl font-bold text-foreground">
                    {staffMembers.filter((s) => s.role === "Nurse").length}
                  </p>
                </div>
                <User className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Staff Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{staff.name}</div>
                      <div className="text-sm text-muted">
                        {staff.role} • {staff.department}
                      </div>
                      <div className="text-xs text-muted mt-1">{staff.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge
                        className={staff.status === "active" ? "bg-success" : "bg-muted"}
                      >
                        {staff.status}
                      </Badge>
                      <div className="text-xs text-muted mt-1">
                        Last active: {staff.lastActive}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStaff(staff.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="text-danger hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
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