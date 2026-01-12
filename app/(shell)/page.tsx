import RecentFlags from "@/components/dashboard/RecentFlags";
import RecentProjects from "@/components/dashboard/RecentProjects";
import PageHeader from "@/components/layout/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import { IFlag, FlagStatus } from "@/core/types/app.types";
import {
  Flag,
  FolderOpen,
  Shield,
  LayoutDashboardIcon,
} from "lucide-react";

export default function Home() {
  // Mock data for dashboard
  const stats = {
    totalProjects: 12,
    activeFlags: 24,
    totalFlags: 31,
    recentActivity: 8,
  };

  const recentFlags: IFlag[] = [
    {
      _id: "1",
      name: "New User Dashboard",
      project: "Web App",
      status: FlagStatus.ACTIVE,
      updatedAt: "2 hours ago",
    },
  ];

  const recentProjects = [
    {
      _id: "1",
      name: "Web App",
      flags: 12,
      status: "active" as const,
      owner: "user1",
      members: ["user1", "user2"],
      updatedAt: "1 hour ago",
    },
  ];

  return (
    <div className="w-full p-2">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your feature flags and projects"
        icon={<LayoutDashboardIcon className="w-5 h-5 text-emerald-500" />}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

        <InfoCard
          title="Total Projects"
          value={stats.totalProjects}
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
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Flags */}
        <div className="lg:col-span-2">
          <RecentFlags recentFlags={recentFlags} />
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-1">
          <RecentProjects recentProjects={recentProjects} />
        </div>
      </div>
    </div>
  );
}
