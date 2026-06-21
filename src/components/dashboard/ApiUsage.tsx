import { useEffect, useRef } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Activity, Shield } from "lucide-react";

interface TokenUsage {
  id: string;
  projectName: string;
  requests: number;
  limit: number;
  remaining: number;
  percentageUsed: number;
  status: string;
  expiresAt: string;
  isNearLimit: boolean;
}

export default function ApiUsage() {
  const { usage, getUsage } = useDashboardStore();
  const hasCurrentRef = useRef(false);

  useEffect(() => {
    if (hasCurrentRef.current) return;
    hasCurrentRef.current = true;
    getUsage();
  }, [getUsage]);

  // Handle case where usage is array (from API) or object (from store initial state)
  const tokenUsageData = Array.isArray(usage) ? (usage as TokenUsage[]) : [];

  if (tokenUsageData.length === 0) {
    return (
      <section className="glass-panel rounded-xl p-8">
        <div className="text-center text-slate-400">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60">
            <Shield className="h-7 w-7 opacity-60" />
          </div>
          <p className="text-sm font-medium text-slate-300">
            No API tokens found
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Issue a project token to evaluate flags at runtime.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Activity className="h-4 w-4 text-sky-300" />
          Access Token Usage
        </h3>
        <span className="text-xs text-slate-500">
          {tokenUsageData.length} token{tokenUsageData.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tokenUsageData.map((token: TokenUsage) => (
          <div
            key={token.id}
            className="hairline-panel rounded-xl p-4 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {token.projectName}
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                  Expires: {new Date(token.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    token.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {token.status}
                </span>
                {token.isNearLimit && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    Near Limit
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Usage</span>
                  <span className="text-xs font-medium text-white">
                    {token.requests.toLocaleString()} /{" "}
                    {token.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-950">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      token.percentageUsed > 80
                        ? "bg-rose-400"
                        : token.percentageUsed > 60
                          ? "bg-amber-300"
                          : "bg-emerald-300"
                    }`}
                    style={{
                      width: `${Math.min(token.percentageUsed, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Used</p>
                  <p className="text-sm font-medium text-white">
                    {token.requests.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Remaining</p>
                  <p className="text-sm font-medium text-emerald-300">
                    {token.remaining.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Usage %</p>
                  <p className="text-sm font-medium text-white">
                    {token.percentageUsed || "0"}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
