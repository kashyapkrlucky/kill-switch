import { IProject } from "@/core/types/app.types";
import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { FolderOpenIcon } from "lucide-react";
import { ButtonOutline } from "../ui/ButtonOutline";
import { Button } from "../ui/Button";
interface Props {
  editingProject: Partial<IProject> | null;
  closeModal: () => void;
}
export default function CreateProjectForm({
  editingProject,
  closeModal,
}: Props) {
  const [formData, setFormData] = useState(editingProject);
  const { createProject, updateProject } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(formData as IProject);
      } else {
        await createProject(formData as IProject);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500/20 rounded-md flex items-center justify-center">
            <FolderOpenIcon className="w-3 h-3 text-emerald-500" />
          </div>
          {editingProject ? "Edit Project" : "Create New Project"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              required
              value={formData?.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 text-sm"
              placeholder="Enter project name..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none text-sm"
              rows={3}
              placeholder="Describe your project..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Status
            </label>
            <select
              value={formData?.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "active" | "inactive" | "completed",
                })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-all duration-200 text-sm"
            >
              <option value="active" className="bg-slate-700">
                Active
              </option>
              <option value="inactive" className="bg-slate-700">
                Inactive
              </option>
              <option value="completed" className="bg-slate-700">
                Completed
              </option>
            </select>
          </div>

          <div className="flex justify-end items-center gap-4 pt-2">
            <ButtonOutline
              type="button"
              onClick={() => {
                closeModal();
                setFormData({
                  name: "",
                  description: "",
                  status: "active",
                });
              }}
            >
              Cancel
            </ButtonOutline>
            <Button type="submit">
              {editingProject ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
