"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, FolderGit2, User, Settings, Clock, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatientNavProps {
  className?: string;
}

export function PatientNav({ className }: PatientNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { label: t("nav_home"), href: "/patient/dashboard", icon: Home },
    { label: t("nav_visits"), href: "/patient/visits", icon: FileText },
    { label: t("nav_records"), href: "/patient/documents", icon: FolderGit2 },
    { label: t("nav_timeline"), href: "/patient/timeline", icon: Clock },
    { label: t("nav_hospitals"), href: "/patient/hospitals", icon: Building2 },
    { label: t("nav_profile"), href: "/patient/profile", icon: User },
    { label: t("nav_settings"), href: "/patient/settings", icon: Settings },
  ];

  return (
    <div className={cn("flex items-center justify-center gap-1 sm:gap-2 border-b border-border py-2 px-2 overflow-x-auto bg-surface/50", className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/patient/dashboard" && pathname.startsWith(item.href));
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
