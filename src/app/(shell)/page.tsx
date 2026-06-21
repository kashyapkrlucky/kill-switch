"use client";
import ApiUsage from "@/components/dashboard/ApiUsage";
import RecentFlags from "@/components/dashboard/RecentFlags";
import PageHeader from "@/components/layout/PageHeader";
import InfoCard from "@/components/ui/InfoCard";
import { Button } from "@/components/ui/Button";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  Flag,
  FolderOpen,
  Shield,
  LayoutDashboardIcon,
  KeyIcon,
  ArrowRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
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
    <div className="w-full">
      <PageHeader
        title="Control Plane"
        description="Monitor feature releases, access tokens, and project readiness from one operational view."
        icon={<LayoutDashboardIcon className="h-5 w-5 text-emerald-300" />}
        actionButton={
          <div className="flex flex-wrap gap-2">
            <Link href="/flags">
              <Button variant="outline">
                Review flags
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/access">
              <Button>
                Manage access
                <KeyIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          title="Projects"
          value={stats.projects}
          description="Applications connected to this workspace."
          icon={<FolderOpen className="h-5 w-5 text-sky-300" />}
          iconColor="bg-sky-500/15"
        />

        <InfoCard
          title="Active Flags"
          value={stats.activeFlags}
          description="Currently enabled rollout controls."
          icon={<Flag className="h-5 w-5 text-emerald-300" />}
          iconColor="bg-emerald-500/15"
        />

        <InfoCard
          title="Total Flags"
          value={stats.totalFlags}
          description="Managed release decisions across projects."
          icon={<Shield className="h-5 w-5 text-violet-300" />}
          iconColor="bg-violet-500/15"
        />

        <InfoCard
          title="API Tokens"
          value={stats.apiTokens}
          description="Issued tokens that can evaluate flags."
          icon={<KeyIcon className="h-5 w-5 text-rose-300" />}
          iconColor="bg-rose-500/15"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <RecentFlags />
          <ApiUsage />
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-300" />
              <h2 className="text-sm font-semibold text-white">
                Release Readiness
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Flags are centralized
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Use project-scoped flags to keep release controls auditable.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Token hygiene
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Rotate API tokens regularly and keep usage limits visible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
