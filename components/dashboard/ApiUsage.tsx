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
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <div className="text-center text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No API tokens found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-white">Access Token Usage</h3>

      {/* Per-Token Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {tokenUsageData.map((token: TokenUsage) => (
          <div
            key={token.id}
            className="border border-slate-600 rounded-lg p-4 bg-slate-800/50 hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-white">{token.projectName}</h4>
                <p className="text-xs text-gray-400 mt-1">
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
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
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

              <div className="flex flex-row gap-4 mt-3">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Used</p>
                  <p className="text-sm font-medium text-white">
                    {token.requests.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Remaining</p>
                  <p className="text-sm font-medium text-emerald-400">
                    {token.remaining.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Usage %</p>
                  <p className="text-sm font-medium text-white">
                    {token.percentageUsed || "0"}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
