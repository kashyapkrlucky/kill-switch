"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/layout/PageHeader";
import {
  Key,
  Copy,
  Check,
  AlertCircle,
  Code,
  Terminal,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import LabeledSelectField from "@/components/ui/LabeledSelectField";
import { useProjectStore } from "@/store/useProjectStore";

interface ApiToken {
  token: string;
  projectId: string;
  projectName: string;
  permissions: string[];
  createdAt: string;
  expiresAt: string;
  usage: {
    requests: number;
    limit: number;
    resetDate: string;
  };
}

export default function ApiAccess() {
  const { projects, getProjects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState("");
  const [generatedToken, setGeneratedToken] = useState<ApiToken | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleGenerateToken = async () => {
    if (!selectedProject) return;

    setIsGenerating(true);
    try {
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const project = projects.find((p) => p._id === selectedProject);
      const mockToken: ApiToken = {
        token: `ks_${Math.random()
          .toString(36)
          .substring(2, 15)}_${Math.random().toString(36).substring(2, 10)}`,
        projectId: selectedProject,
        projectName: project?.name || "Unknown",
        permissions: ["read:flags"],
        createdAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ).toISOString(),
        usage: {
          requests: 1247,
          limit: 5000,
          resetDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      };

      setGeneratedToken(mockToken);
    } catch (error) {
      console.error("Error generating token:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedToken) return;

    try {
      await navigator.clipboard.writeText(generatedToken.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const selectedProjectData = projects.find((p) => p._id === selectedProject);

  return (
    <div className="w-full p-2">
      <PageHeader
        title="API Access"
        description="Generate API tokens to integrate with your applications"
        icon={<Key className="w-5 h-5 text-emerald-500" />}
      />

      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Left Column - Token Generation */}
        <div className="w-full lg:w-2/3 space-y-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Generate Token
            </h2>

            <div className="flex flex-row items-end gap-4">
              <LabeledSelectField
                label="Select Project"
                icon={<Key className="w-3 h-3 text-gray-400" />}
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                options={[
                  { value: "", label: "Choose project..." },
                  ...projects.map((project) => ({
                    value: project._id,
                    label: project.name,
                  })),
                ]}
                className="flex-1"
              />

              <Button
                onClick={handleGenerateToken}
                disabled={!selectedProject || isGenerating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Generate new API Token
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Middle & Right Columns - Token Display */}
          {generatedToken ? (
            <>
              {/* Token Details */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    API Tokens
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    Expires:{" "}
                    {new Date(generatedToken.expiresAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-row gap-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Project
                      </label>
                      <div className="text-white text-sm">
                        {generatedToken.projectName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Permissions
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {generatedToken.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-full">
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Token
                      </label>

                      <div className="w-full flex flex-row items-center gap-2">
                        <div className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg p-2 font-mono text-sm text-emerald-400 break-all">
                          {generatedToken.token}
                        </div>
                        <Button onClick={handleCopyToClipboard}>
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  Usage Statistics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-emerald-400">
                      {generatedToken.usage.requests.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Requests Made
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {generatedToken.usage.limit.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Monthly Limit
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400">
                      {Math.round(
                        (generatedToken.usage.requests /
                          generatedToken.usage.limit) *
                          100
                      )}
                      %
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Usage</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span>
                      Limit resets on{" "}
                      {new Date(
                        generatedToken.usage.resetDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* JSON Response */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-500" />
                    API Response Example
                  </h3>
                  <Button
                    onClick={handleCopyToClipboard}
                    size="sm"
                    className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" />
                    Copy JSON
                  </Button>
                </div>

                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                    {JSON.stringify(
                      {
                        success: true,
                        data: {
                          flags: [
                            {
                              _id: "flag_123",
                              name: "New User Dashboard",
                              description: "Enable new dashboard design",
                              status: "active",
                              project: selectedProjectData?.name || "Web App",
                              createdAt: "2024-01-15T10:30:00.000Z",
                              updatedAt: "2024-01-15T10:30:00.000Z",
                            },
                            {
                              _id: "flag_456",
                              name: "Payment Gateway V2",
                              description: "Enable new payment processing",
                              status: "inactive",
                              project: selectedProjectData?.name || "Web App",
                              createdAt: "2024-01-10T15:45:00.000Z",
                              updatedAt: "2024-01-10T15:45:00.000Z",
                            },
                          ],
                          pagination: {
                            page: 1,
                            limit: 10,
                            total: 2,
                            totalPages: 1,
                          },
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-12 text-center">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Token Generated
              </h3>
              <p className="text-gray-400 text-sm">
                Select a project and click &quot;Generate API Token&quot; to
                create an access token for your application.
              </p>
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-500" />
            How to Use
          </h3>

          <div className="space-y-3">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <h4 className="text-emerald-400 text-sm font-medium mb-2">
                Authentication
              </h4>
              <code className="block text-xs text-gray-300 font-mono">
                Authorization: Bearer YOUR_TOKEN
              </code>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-3">
              <h4 className="text-emerald-400 text-sm font-medium mb-2">
                Example Request
              </h4>
              <code className="block text-xs text-gray-300 font-mono whitespace-pre-wrap">
                {`curl -X GET https://api.killswitch.com/v1/flags \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`}
              </code>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-3">
              <h4 className="text-emerald-400 text-sm font-medium mb-2">
                JavaScript Example
              </h4>
              <code className="block text-xs text-gray-300 font-mono whitespace-pre-wrap">
                {`const response = await fetch('https://api.killswitch.com/v1/flags', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});

const flags = await response.json();`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
