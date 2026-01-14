import { FlagIcon } from "lucide-react";
import PageLink from "../ui/PageLink";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect, useRef } from "react";
import FlagList from "../flags/FlagList";

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
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
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

      <FlagList flags={recentFlags} isDashboard={true} />
    </div>
  );
}
