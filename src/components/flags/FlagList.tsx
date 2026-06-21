import { FLAG_ENVIRONMENTS, FlagStatus } from "@/core/types/app.types";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Button } from "../ui/Button";
import { FlagIcon, Layers3, PencilLineIcon, Trash2 } from "lucide-react";
import { IFlag } from "@/core/types/app.types";
import { useFlagStore } from "@/store/useFlagStore";
import { useState } from "react";
import CreateFlagForm from "./CreateFlagForm";
import InlineLoader from "../layout/InlineLoader";

interface FlagListProps {
  flags: IFlag[];
}

export default function FlagList({ flags }: FlagListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<IFlag | null>(null);
  const { deleteFlag, updateFlag, loading } = useFlagStore();

  const handleEdit = (flag: IFlag) => {
    setEditingFlag(flag);
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingFlag(null);
  };

  const handleDelete = async (flagId: string) => {
    if (confirm("Are you sure you want to delete this flag?")) {
      await deleteFlag(flagId);
    }
  };

  const handleToggleEnvironment = async (
    id: string,
    flag: IFlag,
    environment: (typeof FLAG_ENVIRONMENTS)[number]["key"]
  ) => {
    const currentStatus =
      flag.environments?.[environment]?.status || FlagStatus.INACTIVE;
    const updatedFlag = {
      environment,
      status:
        currentStatus === FlagStatus.ACTIVE
          ? FlagStatus.INACTIVE
          : FlagStatus.ACTIVE,
    };
    await updateFlag(id, updatedFlag);
  };

  return (
    <>
      <div className="glass-panel overflow-x-auto rounded-xl">
        <div className="grid min-w-[1080px] grid-cols-12 gap-3 border-b border-slate-800/90 bg-slate-950/60 p-4">
          <div className="col-span-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Flag Code
            </h4>
          </div>
          <div className="col-span-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Flag Name
            </h4>
          </div>
          <div className="col-span-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Description
            </h4>
          </div>
          <div className="col-span-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Project
            </h4>
          </div>
          <div className="col-span-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Environments
            </h4>
          </div>
          <div className="col-span-1">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </h4>
          </div>
        </div>
        {!loading ? (
          <div>
            {flags.length > 0 ? (
              <div className="min-w-[1080px] divide-y divide-slate-800/80">
                {flags.map((flag) => (
                  <div
                    key={flag._id}
                    className="grid grid-cols-12 gap-3 p-4 transition-colors duration-150 hover:bg-slate-900/80"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-500/15">
                        <FlagIcon className="h-4 w-4 text-emerald-300" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-white">
                          {flag.code}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Release key
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {flag.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Feature control
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center gap-2 text-xs leading-5 text-slate-400">
                      {flag.description || "No description provided"}
                    </div>

                    <div className="col-span-2 flex items-center gap-2 text-xs text-slate-400">
                      <Layers3 className="h-3.5 w-3.5 text-slate-500" />
                      {typeof flag.project === "object"
                        ? flag.project?.name
                        : flag.project || "No project"}
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      {FLAG_ENVIRONMENTS.map((environment) => {
                        const isActive =
                          flag.environments?.[environment.key]?.status ===
                          FlagStatus.ACTIVE;

                        return (
                          <div
                            key={environment.key}
                            className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 ${
                              isActive
                                ? "border-emerald-400/25 bg-emerald-500/12"
                                : "border-slate-800 bg-slate-950/50"
                            }`}
                          >
                            <ToggleSwitch
                              isOn={isActive}
                              onToggle={() =>
                                handleToggleEnvironment(
                                  flag._id,
                                  flag,
                                  environment.key
                                )
                              }
                              disabled={loading}
                            />
                            <span
                              className={`text-xs ${
                                isActive ? "text-emerald-200" : "text-slate-500"
                              }`}
                            >
                              {environment.shortLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="col-span-1">
                      <div className="flex gap-1.5 justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          aria-label={`Edit ${flag.name}`}
                          onClick={() => handleEdit(flag)}
                        >
                          <PencilLineIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          aria-label={`Delete ${flag.name}`}
                          onClick={() => handleDelete(flag._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60">
                  <FlagIcon className="h-6 w-6 text-slate-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  No flags found
                </h3>
                <p className="max-w-sm text-sm text-slate-500">
                  Create one flag and manage development, staging, and
                  production state from the same control.
                </p>
              </div>
            )}
          </div>
        ) : (
          <InlineLoader />
        )}
      </div>

      {/* Modal rendered outside the container */}
      {(isCreateModalOpen || editingFlag) && (
        <CreateFlagForm editingFlag={editingFlag} closeModal={closeModal} />
      )}
    </>
  );
}
