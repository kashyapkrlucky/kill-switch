import { IFlag } from "@/core/types/app.types";
import { useFlagStore } from "@/store/useFlagStore";
import { Flag } from "lucide-react";
import { useState } from "react";
import { ButtonOutline } from "../ui/ButtonOutline";
import { Button } from "../ui/Button";
import CustomToast from "../ui/CustomToast";
interface Props {
  editingFlag: Partial<IFlag> | null;
  closeModal: () => void;
}
export default function CreateFlagForm({ editingFlag, closeModal }: Props) {
  const { createFlag, updateFlag, error } = useFlagStore();

  const [formData, setFormData] = useState(editingFlag || { name: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFlag && editingFlag._id) {
        await updateFlag(editingFlag._id, formData as IFlag);
      } else {
        await createFlag(formData as IFlag);
      }
      closeModal();
      setFormData({ name: "", description: "" });
    } catch (error) {
      CustomToast("error", "Error in modifying flag");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500/20 rounded-md flex items-center justify-center">
            <Flag className="w-3 h-3 text-emerald-500" />
          </div>
          {editingFlag ? "Edit Flag" : "Create New Flag"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 text-sm"
              placeholder="Enter flag name..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none text-sm"
              rows={3}
              placeholder="Describe what this flag does..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
        </form>
      </div>
    </div>
  );
}
