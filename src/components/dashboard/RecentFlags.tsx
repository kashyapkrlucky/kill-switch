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
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          <FlagIcon className="h-4 w-4 text-emerald-300" />
          Recent Feature Flags
        </h2>
        <PageLink
          href="/flags"
          className="text-xs font-medium text-emerald-300 transition-colors hover:text-emerald-200"
        >
          View all
        </PageLink>
      </div>

      <FlagList flags={recentFlags} />
    </section>
  );
}
