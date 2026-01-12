import { ClockIcon, FlagIcon, FolderOpenIcon } from "lucide-react";
import PageLink from "../ui/PageLink";
import { IProject } from "@/core/types/app.types";

export default function RecentProjects({ recentProjects }: { recentProjects: IProject[] }) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FolderOpenIcon className="w-4 h-4 text-blue-500" />
                  Projects
                </h2>
                <PageLink
                  href="/projects"
                  className="text-emerald-500 hover:text-emerald-400 text-xs font-medium transition-colors"
                >
                  View all
                </PageLink>
              </div>
            </div>

            <div className="divide-y divide-slate-700">
              {recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="p-3 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-medium text-sm">
                      {project.name}
                    </h3>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        project.status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <FlagIcon className="w-3 h-3" />
                      {project.flags} flags
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {project.updatedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
    )
}