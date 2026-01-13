import { ClockIcon, FlagIcon, FolderOpenIcon } from "lucide-react";
import PageLink from "../ui/PageLink";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect, useRef } from "react";

export default function RecentFlags() {
  const { recentFlags, getRecentFlags } = useDashboardStore();
  const hasCurrentRef = useRef(false);  

  // Fetch recent flags on mount
  useEffect(() => {
    if (hasCurrentRef.current) return;
    hasCurrentRef.current = true;
    getRecentFlags();
  }, [getRecentFlags]);

  return (
    <div className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <FlagIcon className="w-4 h-4 text-emerald-500" />
            Recent Feature Flags
          </h2>
          <PageLink
            href="/flags"
            className="text-emerald-500 hover:text-emerald-400 text-xs font-medium transition-colors"
          >
            View all
          </PageLink>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-xs font-medium text-gray-400">Flag Name</th>
              <th className="text-left p-3 text-xs font-medium text-gray-400">Status</th>
              <th className="text-left p-3 text-xs font-medium text-gray-400">Project</th>
              <th className="text-left p-3 text-xs font-medium text-gray-400">Created</th>
            </tr>
          </thead>
          <tbody>
            {recentFlags.map((flag) => (
              <tr
                key={flag._id}
                className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-3">
                  <div>
                    <h3 className="text-white font-medium text-sm">
                      {flag.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{flag.description}</p>
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      flag.status === "active"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : flag.status === "inactive"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {flag.status}
                  </span>
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <FolderOpenIcon className="w-3 h-3" />
                    {flag.project}
                  </span>
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <ClockIcon className="w-3 h-3" />
                    {flag.createdAt ? new Date(flag.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
