"use client";

import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { IProject } from "@/core/types/app.types";
import { Button } from "@/components/ui/Button";
import { Plus, Settings, Trash2, FolderOpen, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import CreateProjectForm from "@/components/projects/CreateProjectForm";

export default function ProjectsPage() {
  const { projects, getProjects, deleteProject } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleEdit = (project: IProject) => {
    setEditingProject(project);
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(projectId);
    }
  };

  return (
    <div className="w-full p-2">
      {/* Header Section */}
      <PageHeader
        title="Projects"
        description="Manage your projects and their settings"
        icon={<FolderOpen className="w-5 h-5 text-emerald-500" />}
        actionButton={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-3 h-3" />
            New Project
          </Button>
        }
      />

      {/* Projects Table */}
      {projects.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 p-3 bg-slate-900/50 border-b border-slate-700">
            <div className="col-span-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Project Name
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
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Members
              </h4>
            </div>
            <div className="col-span-1">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </h4>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-700">
            {projects.map((project) => (
              <div
                key={project._id}
                className="grid grid-cols-12 gap-3 p-3 hover:bg-slate-700/30 transition-colors duration-150"
              >
                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-md flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-3 h-3 text-emerald-500" />
                  </div>
                  <h3 className="text-white font-medium text-sm">
                    {project.name}
                  </h3>
                </div>

                <div className="col-span-4 flex items-center gap-2 text-gray-400 text-xs line-clamp-2">
                  {project.description || "No description provided"}
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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

                <div className="col-span-2 flex items-center gap-2">
                   
                    <Users className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400 text-xs">
                      {project.members.length} member
                      {project.members.length !== 1 ? "s" : ""}
                    </span>
                  
                </div>

                <div className="col-span-1">
                  <div className="flex gap-1.5 justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-2 py-1 rounded-md transition-colors flex items-center gap-1 text-xs"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(project._id)}
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

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-7 h-7 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-400 mb-4 max-w-md text-sm">
            You haven&apos;t created any projects yet. Create your first project
            to get started.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 text-xs"
          >
            <Plus className="w-3 h-3" />
            Create your first project
          </Button>
        </div>
      )}

      {/* Modal */}
      {(isCreateModalOpen || editingProject) && (
        <CreateProjectForm
          editingProject={editingProject}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
