import { FlagStatus } from "@/core/types/app.types";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { Button } from "../ui/Button";
import { FlagIcon, PencilLineIcon, Trash2 } from "lucide-react";
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
    <>
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="grid grid-cols-12 gap-3 p-3 bg-slate-900/50 border-b border-slate-700">
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
              Status
            </h4>
          </div>
          <div className="col-span-1">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </h4>
          </div>
        </div>
        {!loading ? (
          <div className="divide-y divide-slate-700">
            {flags.length > 0 ? (
              <div className="">
                {flags.map((flag) => (
                  <div
                    key={flag._id}
                    className="grid grid-cols-12 gap-3 p-3 hover:bg-slate-700/30 transition-colors duration-150"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-md flex items-center justify-center flex-shrink-0">
                        <FlagIcon className="w-3 h-3 text-emerald-500" />
                      </div>
                      <h3 className="text-white font-medium text-sm">
                        {flag.code}
                      </h3>
                    </div>

                    <div className="col-span-2 flex items-center gap-2 text-gray-400 text-xs line-clamp-2">
                      {flag.name}
                    </div>

                    <div className="col-span-3 flex items-center gap-2 text-gray-400 text-xs line-clamp-2">
                      {flag.description || "No description provided"}
                    </div>

                    <div className="col-span-2 flex items-center gap-2 text-gray-400 text-xs line-clamp-2">
                      {typeof flag.project === "object"
                        ? flag.project?.name
                        : flag.project || "No project"}
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

                    <div className="col-span-1">
                      <div className="flex gap-1.5 justify-end">
                        <Button size="sm" onClick={() => handleEdit(flag)}>
                          <PencilLineIcon className="w-3 h-3" />
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
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  No flags found
                </h3>
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
