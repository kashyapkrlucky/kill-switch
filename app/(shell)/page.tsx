"use client";
import ApiUsage from "@/components/dashboard/ApiUsage";
import RecentFlags from "@/components/dashboard/RecentFlags";
import PageHeader from "@/components/layout/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  Flag,
  FolderOpen,
  Shield,
  LayoutDashboardIcon,
  KeyIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function Home() {
  const { stats, getStats } = useDashboardStore();
  const hasCurrentRef = useRef(false);

  useEffect(() => {
    if (hasCurrentRef.current) return;
    hasCurrentRef.current = true;
    getStats();
  }, [getStats]);

  return (
    <div className="w-full p-2">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your feature flags and projects"
        icon={<LayoutDashboardIcon className="w-5 h-5 text-emerald-500" />}
      />

      {/* Stats Grid */}
      <div className="flex flex-row gap-4 mb-4">
        <InfoCard
          title="Total Projects"
          value={stats.projects}
          icon={<FolderOpen className="w-4 h-4 text-blue-500" />}
          iconColor="bg-blue-500/20"
        />

        <InfoCard
          title="Active Flags"
          value={stats.activeFlags}
          icon={<Flag className="w-4 h-4 text-emerald-500" />}
          iconColor="bg-emerald-500/20"
        />

        <InfoCard
          title="Total Flags"
          value={stats.totalFlags}
          icon={<Shield className="w-4 h-4 text-purple-500" />}
          iconColor="bg-purple-500/20"
        />

        <InfoCard
          title="API Tokens"
          value={stats.apiTokens}
          icon={<KeyIcon className="w-4 h-4 text-red-500" />}
          iconColor="bg-red-500/20"
        />
      </div>
      {/* Main Content Grid */}
      <div className="flex flex-col gap-4">
        <RecentFlags />
        <ApiUsage />
      </div>
    </div>
  );
}
