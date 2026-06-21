import { useEffect, useRef } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Shield } from "lucide-react";

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
      <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-8">
        <div className="text-center text-slate-400">
          <Shield className="mx-auto mb-3 h-10 w-10 opacity-60" />
          <p className="text-sm">No API tokens found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          Access Token Usage
        </h3>
        <span className="text-xs text-slate-500">
          {tokenUsageData.length} token{tokenUsageData.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {tokenUsageData.map((token: TokenUsage) => (
          <div
            key={token.id}
            className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 transition-colors hover:bg-slate-900"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-white">{token.projectName}</h4>
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
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      token.percentageUsed > 80
                        ? "bg-red-500"
                        : token.percentageUsed > 60
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
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
