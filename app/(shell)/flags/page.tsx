"use client";

import { useEffect, useState } from "react";
import { useFlagStore } from "@/store/useFlagStore";
import { Button } from "@/components/ui/Button";
import { Plus, Flag } from "lucide-react";
import CreateFlagForm from "@/components/flags/CreateFlagForm";
import FlagList from "@/components/flags/FlagList";

export default function FlagsPage() {
  const { flags, getFlags } = useFlagStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    getFlags();
  }, [getFlags]);

  return (
    <div className="w-full p-2 relative">
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
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 text-xs"
            >
              <Plus className="w-3 h-3" />
              New Flag
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      <FlagList flags={flags} />

      {/* Modal */}
      {isCreateModalOpen && (
        <CreateFlagForm closeModal={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
