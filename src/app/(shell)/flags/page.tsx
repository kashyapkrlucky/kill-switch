"use client";

import { useEffect, useState } from "react";
import { useFlagStore } from "@/store/useFlagStore";
import { Button } from "@/components/ui/Button";
import { Plus, Flag } from "lucide-react";
import CreateFlagForm from "@/components/flags/CreateFlagForm";
import FlagList from "@/components/flags/FlagList";
import PageHeader from "@/components/layout/PageHeader";

export default function FlagsPage() {
  const { flags, getFlags } = useFlagStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    getFlags();
  }, [getFlags]);

  return (
    <div className="relative w-full">
      <PageHeader
        title="Feature Flags"
        description="Manage rollout switches, project mappings, and live activation state."
        icon={<Flag className="h-5 w-5 text-emerald-300" />}
        actionButton={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Flag
          </Button>
        }
      />

      <FlagList flags={flags} />

      {/* Modal */}
      {isCreateModalOpen && (
        <CreateFlagForm closeModal={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
