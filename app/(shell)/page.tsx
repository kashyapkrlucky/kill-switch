import PageLink from "@/components/ui/PageLink";
import {
  Flag,
  FolderOpen,
  Shield,
  Clock,
} from "lucide-react";

export default function Home() {
  // Mock data for dashboard
  const stats = {
    totalProjects: 12,
    activeFlags: 24,
    totalFlags: 31,
    recentActivity: 8,
  };

  const recentFlags = [
    {
      id: 1,
      name: "New User Dashboard",
      project: "Web App",
      status: "active",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "Payment Gateway V2",
      project: "E-commerce",
      status: "inactive",
      lastUpdated: "5 hours ago",
    },
    {
      id: 3,
      name: "Mobile App Sync",
      project: "Mobile",
      status: "active",
      lastUpdated: "1 day ago",
    },
    {
      id: 4,
      name: "Analytics Integration",
      project: "Web App",
      status: "testing",
      lastUpdated: "2 days ago",
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Web App",
      flags: 12,
      status: "active",
      lastUpdated: "1 hour ago",
    },
    {
      id: 2,
      name: "Mobile",
      flags: 8,
      status: "active",
      lastUpdated: "3 hours ago",
    },
    {
      id: 3,
      name: "E-commerce",
      flags: 6,
      status: "inactive",
      lastUpdated: "1 day ago",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">
                Overview of your feature flags and projects
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Total Projects
                    </p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats.totalProjects}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">+2 this week</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <FolderOpen className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Active Flags
                    </p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats.activeFlags}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">77% of total</p>
                  </div>
                  <div className="bg-emerald-500/20 p-3 rounded-lg">
                    <Flag className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Total Flags
                    </p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats.totalFlags}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">+5 this week</p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Flags */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Flag className="w-5 h-5 text-emerald-500" />
                    Recent Feature Flags
                  </h2>
                  <PageLink
                    href="/flags"
                    className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    View all
                  </PageLink>
                </div>
              </div>

              <div className="divide-y divide-slate-700">
                {recentFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-4 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-medium">
                            {flag.name}
                          </h3>
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
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <FolderOpen className="w-3 h-3" />
                            {flag.project}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {flag.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-500" />
                    Projects
                  </h2>
                  <PageLink
                    href="/projects"
                    className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    View all
                  </PageLink>
                </div>
              </div>

              <div className="divide-y divide-slate-700">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          project.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        {project.flags} flags
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.lastUpdated}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
