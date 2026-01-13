"use client";

import { useEffect, useState } from "react";
import { useFlagStore } from "@/store/useFlagStore";
import { useProjectStore } from "@/store/useProjectStore";
import { IFlag, FlagStatus } from "@/core/types/app.types";
import { Button } from "@/components/ui/Button";
import LabeledSelectField from "@/components/ui/LabeledSelectField";
import { FolderIcon, Plus, Settings, Trash2, Flag } from "lucide-react";
import CreateFlagForm from "@/components/flags/CreateFlagForm";
import PageLoader from "@/components/layout/PageLoader";

// Toggle component for better organization
const ToggleSwitch = ({
  isOn,
  onToggle,
  disabled = false,
}: {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
      isOn ? "bg-emerald-500" : "bg-gray-600"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
        isOn ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

export default function FlagsPage() {
  const { flags, getFlags, deleteFlag, updateFlag, loading } = useFlagStore();
  const { projects, getProjects } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<IFlag | null>(null);
  const [selectedProject, setSelectedProject] = useState("");

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingFlag(null);
  };

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    if (projectId) {
      getFlags(projectId);
    }
  };

  const handleEdit = (flag: IFlag) => {
    setEditingFlag(flag);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (flagId: string) => {
    if (confirm("Are you sure you want to delete this flag?")) {
      await deleteFlag(flagId);
    }
  };

  const handleToggleStatus = async (id: string, flag: IFlag) => {
    const updatedFlag = {
      status:
        flag.status === FlagStatus.ACTIVE
          ? FlagStatus.INACTIVE
          : FlagStatus.ACTIVE,
    };
    await updateFlag(id, updatedFlag);
  };

  return (
    <div className="w-full p-2">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <Flag className="w-5 h-5 text-emerald-500" />
              Feature Flags
            </h1>
            <p className="text-gray-400 text-xs">
              Manage feature flags for your projects
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-center">
            <LabeledSelectField
              label=""
              icon={<FolderIcon className="w-3 h-3 text-gray-400" />}
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              options={[
                { value: "", label: "Choose project..." },
                ...projects.map((project) => ({
                  value: project._id,
                  label: project.name,
                })),
              ]}
              className="pl-8 pr-8 appearance-none bg-slate-800 border-slate-700 text-white text-sm"
            />

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!selectedProject}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 text-xs"
            >
              <Plus className="w-3 h-3" />
              New Flag
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {/* Flags Table */}
          {flags.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 p-3 bg-slate-900/50 border-b border-slate-700">
                <div className="col-span-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Flag Name
                  </h4>
                </div>
                <div className="col-span-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Description
                  </h4>
                </div>
                <div className="col-span-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </h4>
                </div>
                <div className="col-span-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </h4>
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-700">
                {flags.map((flag) => (
                  <div
                    key={flag._id}
                    className="grid grid-cols-12 gap-3 p-3 hover:bg-slate-700/30 transition-colors duration-150"
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-md flex items-center justify-center flex-shrink-0">
                        <Flag className="w-3 h-3 text-emerald-500" />
                      </div>
                      <h3 className="text-white font-medium text-sm">
                        {flag.name}
                      </h3>
                    </div>

                    <div className="col-span-4 flex items-center gap-2 text-gray-400 text-xs line-clamp-2">
                      {flag.description || "No description provided"}
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <ToggleSwitch
                        isOn={flag.status === FlagStatus.ACTIVE}
                        onToggle={() => handleToggleStatus(flag._id, flag)}
                        disabled={loading}
                      />
                      <span className="text-xs text-gray-400">
                        {flag.status === FlagStatus.ACTIVE
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <div className="flex gap-1.5 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(flag)}
                          className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-2 py-1 rounded-md transition-colors flex items-center gap-1 text-xs"
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(flag._id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium px-2 py-1 rounded-md transition-colors flex items-center gap-1 text-xs border border-red-500/30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - No Flags */}
          {flags.length === 0 && selectedProject && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Flag className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No flags found
              </h3>
              <p className="text-gray-400 mb-4 max-w-md text-sm">
                This project doesn&apos;t have any feature flags yet. Create
                your first flag to get started.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 text-xs"
              >
                <Plus className="w-3 h-3" />
                Create your first flag
              </Button>
            </div>
          )}

          {/* Empty State - No Project Selected */}
          {!selectedProject && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <FolderIcon className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Select a project
              </h3>
              <p className="text-gray-400 max-w-md text-sm">
                Choose a project from the dropdown above to view and manage its
                feature flags.
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {(isCreateModalOpen || editingFlag) && (
        <CreateFlagForm editingFlag={editingFlag} closeModal={closeModal} />
      )}
    </div>
  );
}
