"use client";

import { useEffect, useState } from "react";
import { useFlagStore } from "@/store/useFlagStore";
import { useProjectStore } from "@/store/useProjectStore";
import { IFlag } from "@/core/types/app.types";
import { Button } from "@/components/ui/Button";
import LabeledSelectField from "@/components/ui/LabeledSelectField";
import { FolderIcon, Plus, Settings, Trash2, Flag } from "lucide-react";

export default function FlagsPage() {
  const {
    flags,
    getFlags,
    createFlag,
    updateFlag,
    deleteFlag,
    loading,
    error,
  } = useFlagStore();
  const { projects, getProjects } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<IFlag | null>(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive",
    project: "",
  });

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    if (projectId) {
      getFlags(projectId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const flagData = {
        ...formData,
        project: selectedProject,
        _id: "",
      };

      if (editingFlag) {
        await updateFlag({ ...editingFlag, ...flagData });
      } else {
        await createFlag(flagData);
      }
      setIsCreateModalOpen(false);
      setEditingFlag(null);
      setFormData({ name: "", description: "", status: "active", project: "" });
    } catch (error) {
      console.error("Error saving flag:", error);
    }
  };

  const handleEdit = (flag: IFlag) => {
    setEditingFlag(flag);
    setFormData({
      name: flag.name,
      description: flag.description || "",
      status: flag.status,
      project: flag.project,
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (flagId: string) => {
    if (confirm("Are you sure you want to delete this flag?")) {
      await deleteFlag(flagId);
    }
  };

  
  return (
    <div className="w-full">
       
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Flag className="w-8 h-8 text-emerald-500" />
                Feature Flags
              </h1>
              <p className="text-gray-400">Manage feature flags for your projects</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-center">
              <div className="relative">
                <LabeledSelectField
                  label=""
                  icon={<FolderIcon className="w-4 h-4 text-gray-400" />}
                  value={selectedProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  options={[
                    { value: "", label: "Choose project..." },
                    ...projects.map((project) => ({
                      value: project._id,
                      label: project.name,
                    })),
                  ]}
                  className="pl-10 pr-10 appearance-none bg-slate-800 border-slate-700 text-white"
                />
                {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}
              </div>
              
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!selectedProject}
                className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
              >
                <Plus className="w-4 h-4" />
                New Flag
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {selectedProject && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Flags</p>
                  <p className="text-3xl font-bold text-white mt-1">{flags.length}</p>
                </div>
                <div className="bg-emerald-500/20 p-3 rounded-lg">
                  <Flag className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Flags</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {flags.filter(f => f.status === 'active').length}
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Inactive Flags</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {flags.filter(f => f.status === 'inactive').length}
                  </p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-lg">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}


      

      {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Loading flags...</p>
          </div>
        ) : (
          <>
            {/* Flags Table */}
            {flags.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-slate-900/50 border-b border-slate-700">
                  <div className="col-span-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Flag Name</h4>
                  </div>
                  <div className="col-span-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Description</h4>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</h4>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</h4>
                  </div>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-slate-700">
                  {flags.map((flag) => (
                    <div
                      key={flag._id}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-700/30 transition-colors duration-150"
                    >
                      <div className="col-span-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Flag className="w-4 h-4 text-emerald-500" />
                          </div>
                          <h3 className="text-white font-medium">{flag.name}</h3>
                        </div>
                      </div>
                      
                      <div className="col-span-4">
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {flag.description || "No description provided"}
                        </p>
                      </div>
                      
                      <div className="col-span-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            flag.status === 'active' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {flag.status === 'active' ? '● Active' : '● Inactive'}
                        </span>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => handleEdit(flag)}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleDelete(flag._id)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm border border-red-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
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
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Flag className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No flags found</h3>
                <p className="text-gray-400 mb-8 max-w-md">
                  This project doesn&apos;t have any feature flags yet. Create your first flag to get started.
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                >
                  <Plus className="w-5 h-5" />
                  Create your first flag
                </Button>
              </div>
            )}

            {/* Empty State - No Project Selected */}
            {!selectedProject && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <FolderIcon className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Select a project</h3>
                <p className="text-gray-400 max-w-md">
                  Choose a project from the dropdown above to view and manage its feature flags.
                </p>
              </div>
            )}
          </>
        )}

      {/* Modal */}
        {(isCreateModalOpen || editingFlag) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Flag className="w-4 h-4 text-emerald-500" />
                </div>
                {editingFlag ? "Edit Flag" : "Create New Flag"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Enter flag name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Describe what this flag does..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-all duration-200"
                  >
                    <option value="active" className="bg-slate-700">Active</option>
                    <option value="inactive" className="bg-slate-700">Inactive</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingFlag(null);
                      setFormData({
                        name: "",
                        description: "",
                        status: "active",
                        project: "",
                      });
                    }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                  >
                    {editingFlag ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
       
    </div>
  );
}
