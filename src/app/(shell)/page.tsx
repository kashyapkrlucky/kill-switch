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
  Gauge,
  GitBranch,
  LockKeyhole,
  Rocket,
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

  const releaseLanes = [
    {
      label: "Development",
      value: stats.totalFlags,
      dotClass: "bg-emerald-300",
      barClass: "bg-emerald-300/80",
      copy: "Fast iteration lane",
    },
    {
      label: "Staging",
      value: Math.max(stats.activeFlags, 0),
      dotClass: "bg-sky-300",
      barClass: "bg-sky-300/80",
      copy: "QA validation lane",
    },
    {
      label: "Production",
      value: stats.activeFlags,
      dotClass: "bg-amber-300",
      barClass: "bg-amber-300/80",
      copy: "Customer-facing lane",
    },
  ];

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

      <div className="w-full flex flex-row gap-6">
        <section className="flex-1 glass-panel overflow-hidden rounded-xl p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-emerald-300" />
                <h2 className="text-sm font-semibold text-white">
                  Release Pipeline
                </h2>
              </div>
              <p className="text-sm text-slate-400">
                One flag moves through dedicated environment states.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
              <Gauge className="h-3.5 w-3.5 text-emerald-300" />
              {stats.activeFlags} active controls
            </div>
          </div>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              title="Projects"
              value={stats.projects}
              description="Applications connected to this workspace."
              icon={<FolderOpen className="h-5 w-5 text-sky-300" />}
              iconColor="bg-sky-500/15"
              accent="sky"
            />

            <InfoCard
              title="Active Flags"
              value={stats.activeFlags}
              description="Currently enabled rollout controls."
              icon={<Flag className="h-5 w-5 text-emerald-300" />}
              iconColor="bg-emerald-500/15"
              accent="emerald"
            />

            <InfoCard
              title="Total Flags"
              value={stats.totalFlags}
              description="Managed release decisions across projects."
              icon={<Shield className="h-5 w-5 text-violet-300" />}
              iconColor="bg-violet-500/15"
              accent="violet"
            />

            <InfoCard
              title="API Tokens"
              value={stats.apiTokens}
              description="Issued tokens that can evaluate flags."
              icon={<KeyIcon className="h-5 w-5 text-rose-300" />}
              iconColor="bg-rose-500/15"
              accent="rose"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {releaseLanes.map((lane) => (
              <div
                key={lane.label}
                className="rounded-lg border border-slate-800 bg-slate-950/45 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {lane.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{lane.copy}</p>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${lane.dotClass}`}
                  />
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold text-white">
                    {lane.value.toLocaleString()}
                  </p>
                  <div className="h-12 w-24 overflow-hidden rounded border border-slate-800 bg-slate-900">
                    <div className="flex h-full items-end gap-1 px-2 pb-2">
                      {[45, 70, 52, 84, 62, 94].map((height, index) => (
                        <span
                          key={index}
                          className={`w-full rounded-sm ${lane.barClass}`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


          <ApiUsage />
        </section>

        <aside className="w-1/4 flex flex-col gap-4">
          <div className="glass-panel rounded-xl p-4">
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
          <div className="hairline-panel rounded-xl p-4">
            <div className="mb-4 flex items-center gap-2">
              <LockKeyhole className="h-4 w-4 text-sky-300" />
              <h2 className="text-sm font-semibold text-white">Governance</h2>
            </div>
            <div className="space-y-3">
              {[
                [
                  "Project scoped access",
                  "Tokens only evaluate their project.",
                ],
                ["Production default", "Runtime reads are safe by default."],
                [
                  "Environment cache",
                  "Responses isolate dev, stage, and prod.",
                ],
              ].map(([title, copy]) => (
                <div key={title} className="flex gap-3">
                  <GitBranch className="mt-0.5 h-3.5 w-3.5 text-slate-500" />
                  <div>
                    <p className="text-xs font-medium text-slate-200">
                      {title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <RecentFlags />
    </div>
  );
}
