"use client";
import ApiUsage from "@/components/dashboard/ApiUsage";
import RecentFlags from "@/components/dashboard/RecentFlags";
import PageHeader from "@/components/layout/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Flag, FolderOpen, Shield, LayoutDashboardIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Home() {
  const { stats, getStats } = useDashboardStore();
  const hasCurrentRef = useRef(false);

  // Fetch recent flags on mount
  useEffect(() => {
    if (hasCurrentRef.current) return;
    hasCurrentRef.current = true;
    getStats();
  }, [getStats]);


  return (
    <div className="w-full p-2">
      {/* Header */}
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
          description="+2 this week"
        />

        <InfoCard
          title="Active Flags"
          value={stats.activeFlags}
          icon={<Flag className="w-4 h-4 text-emerald-500" />}
          iconColor="bg-emerald-500/20"
          description="77% of total"
        />

        <InfoCard
          title="Total Flags"
          value={stats.totalFlags}
          icon={<Shield className="w-4 h-4 text-purple-500" />}
          iconColor="bg-purple-500/20"
          description="+5 this week"
        />

        <InfoCard
          title="API Tokens"
          value={stats.apiTokens}
          icon={<Shield className="w-4 h-4 text-purple-500" />}
          iconColor="bg-purple-500/20"
          description="+5 this week"
        />
      </div>
      {/* Main Content Grid */}
      <div className="flex flex-col gap-4">
        {/* Recent Flags */} 
          <RecentFlags />
          <ApiUsage />  
      </div>
    </div>
  );
}
