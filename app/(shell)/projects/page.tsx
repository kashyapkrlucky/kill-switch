"use client";

import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { IProject } from "@/core/types/app.types";
import { Button } from "@/components/ui/Button";
import { Plus, Settings, Trash2, FolderOpen, Users } from "lucide-react";
import { ButtonOutline } from "@/components/ui/ButtonOutline";

export default function ProjectsPage() {
  const {
    projects,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive" | "completed",
  });

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject({ ...editingProject, ...formData });
      } else {
        await createProject({
          ...formData,
          _id: "",
          owner: "",
          members: [],
        });
      }
      setIsCreateModalOpen(false);
      setEditingProject(null);
      setFormData({ name: "", description: "", status: "active" });
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleEdit = (project: IProject) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status,
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(projectId);
    }
  };


  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-emerald-500" />
              Projects
            </h1>
            <p className="text-gray-400">
              Manage your projects and their settings
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">
                Total Projects
              </p>
              <p className="text-3xl font-bold text-white mt-1">
                {projects.length}
              </p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <FolderOpen className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-white mt-1">
                {projects.filter((p) => p.status === "active").length}
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
              <p className="text-gray-400 text-sm font-medium">Inactive</p>
              <p className="text-3xl font-bold text-white mt-1">
                {projects.filter((p) => p.status === "inactive").length}
              </p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-white mt-1">
                {projects.filter((p) => p.status === "completed").length}
              </p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      {projects.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-900/50 border-b border-slate-700">
            <div className="col-span-3">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Project Name
              </h4>
            </div>
            <div className="col-span-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Description
              </h4>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </h4>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Members
              </h4>
            </div>
            <div className="col-span-1">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </h4>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-700">
            {projects.map((project) => (
              <div
                key={project._id}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-700/30 transition-colors duration-150"
              >
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h3 className="text-white font-medium">{project.name}</h3>
                  </div>
                </div>

                <div className="col-span-4">
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {project.description || "No description provided"}
                  </p>
                </div>

                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "active"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : project.status === "inactive"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {project.status === "active"
                      ? "● Active"
                      : project.status === "inactive"
                      ? "● Inactive"
                      : "● Completed"}
                  </span>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">
                      {project.members.length} member
                      {project.members.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(project._id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm border border-red-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            No projects found
          </h3>
          <p className="text-gray-400 mb-8 max-w-md">
            You haven&apos;t created any projects yet. Create your first project
            to get started.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
          >
            <Plus className="w-5 h-5" />
            Create your first project
          </Button>
        </div>
      )}

      {/* Modal */}
      {(isCreateModalOpen || editingProject) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-emerald-500" />
              </div>
              {editingProject ? "Edit Project" : "Create New Project"}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter project name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "active"
                        | "inactive"
                        | "completed",
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-all duration-200"
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

              <div className="flex gap-3 pt-4">
                <ButtonOutline
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingProject(null);
                    setFormData({
                      name: "",
                      description: "",
                      status: "active",
                    });
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Cancel
                </ButtonOutline>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                >
                  {editingProject ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
