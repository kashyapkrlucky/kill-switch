"use client";
import { IFlag } from "@/core/types/app.types";
import { FLAG_ENVIRONMENTS, FlagStatus } from "@/core/types/app.types";
import { useFlagStore } from "@/store/useFlagStore";
import { Flag, FolderIcon, GitBranch, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { ButtonOutline } from "../ui/ButtonOutline";
import { Button } from "../ui/Button";
import CustomToast from "../ui/CustomToast";
import { useProjectStore } from "@/store/useProjectStore";
import LabeledSelectField from "../ui/LabeledSelectField";
interface Props {
  editingFlag?: Partial<IFlag> | null;
  closeModal: () => void;
}
export default function CreateFlagForm({ editingFlag, closeModal }: Props) {
  const { createFlag, updateFlag } = useFlagStore();
  const { projects, getProjects } = useProjectStore();

  const [selectedProject, setSelectedProject] = useState("");
  const [environmentState, setEnvironmentState] = useState(() => ({
    development:
      editingFlag?.environments?.development?.status || FlagStatus.ACTIVE,
    staging: editingFlag?.environments?.staging?.status || FlagStatus.INACTIVE,
    production:
      editingFlag?.environments?.production?.status || FlagStatus.INACTIVE,
  }));

  const [formData, setFormData] = useState(
    editingFlag || { name: "", description: "" }
  );

  const buildEnvironmentPayload = () => ({
    development: { status: environmentState.development },
    staging: { status: environmentState.staging },
    production: { status: environmentState.production },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFlag && editingFlag._id) {
        await updateFlag(editingFlag._id, {
          ...(formData as IFlag),
          environments: buildEnvironmentPayload(),
        });
      } else {
        await createFlag({
          ...formData,
          project: selectedProject,
          environments: buildEnvironmentPayload(),
        } as IFlag);
      }
      closeModal();
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.log(error);
      CustomToast("error", "Error in modifying flag");
    }
  };

  useEffect(() => {
    if (!projects.length) {
      getProjects();
    }
  }, [getProjects, projects.length]);

  return (
    <div className="fixed inset-0 bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl overflow-hidden rounded-xl shadow-2xl">
        <div className="border-b border-slate-800/80 p-5">
          <h2 className="flex items-center gap-3 text-lg font-semibold text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-500/15">
              <Flag className="h-4 w-4 text-emerald-300" />
            </div>
            {editingFlag ? "Edit Flag" : "Create New Flag"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Configure one feature control with independent rollout states for
            each environment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="New checkout"
              />
            </div>

            {!editingFlag && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                  Project
                </label>
                <LabeledSelectField
                  label=""
                  icon={<FolderIcon className="h-3 w-3 text-gray-400" />}
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  options={[
                    { value: "", label: "Choose project..." },
                    ...projects.map((project) => ({
                      value: project._id,
                      label: project.name,
                    })),
                  ]}
                  className="appearance-none border-slate-700 bg-slate-950/70 pl-8 pr-8 text-sm text-white"
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
              placeholder="Describe what this flag controls..."
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <GitBranch className="h-4 w-4 text-emerald-300" />
                  Environment rollout
                </label>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Keep production off until the flag has passed lower
                  environments.
                </p>
              </div>
              <div className="hidden rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400 sm:flex">
                Safe default
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FLAG_ENVIRONMENTS.map((environment) => {
                const isActive =
                  environmentState[environment.key] === FlagStatus.ACTIVE;

                return (
                  <button
                    key={environment.key}
                    type="button"
                    onClick={() =>
                      setEnvironmentState((current) => ({
                        ...current,
                        [environment.key]: isActive
                          ? FlagStatus.INACTIVE
                          : FlagStatus.ACTIVE,
                      }))
                    }
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      isActive
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
                        : "border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold">
                        {environment.shortLabel}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActive ? "bg-emerald-300" : "bg-slate-600"
                        }`}
                      />
                    </div>
                    <p className="text-[11px]">
                      {isActive ? "Enabled" : "Disabled"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Production remains isolated from dev and staging.
            </div>
            <div className="ml-auto flex justify-end gap-2">
              <ButtonOutline
                type="button"
                onClick={() => {
                  closeModal();
                  setFormData({
                    name: "",
                    description: "",
                  });
                }}
              >
                Cancel
              </ButtonOutline>
              <Button type="submit">{editingFlag ? "Update" : "Create"}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
