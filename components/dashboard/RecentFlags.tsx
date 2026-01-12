import { ClockIcon, FlagIcon, FolderOpenIcon } from "lucide-react";
import PageLink from "../ui/PageLink";
import { IFlag } from "@/core/types/app.types";

export default function RecentFlags( { recentFlags }: { recentFlags: IFlag[] } ) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
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

            <div className="divide-y divide-slate-700">
              {recentFlags.map((flag) => (
                <div
                  key={flag._id}
                  className="p-3 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium text-sm">
                          {flag.name}
                        </h3>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            flag.status === "active"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : flag.status === "inactive"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {flag.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FolderOpenIcon className="w-3 h-3" />
                          {flag.project}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {flag.updatedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    )
}