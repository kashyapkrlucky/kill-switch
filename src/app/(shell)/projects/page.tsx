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
        description="Organize applications, ownership, and release-control boundaries."
        icon={<FolderOpen className="h-5 w-5 text-emerald-300" />}
        actionButton={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        }
      />

      {/* Projects Table */}
      {projects.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/70">
          {/* Table Header */}
          <div className="grid min-w-[860px] grid-cols-12 gap-3 border-b border-slate-800 bg-slate-950/50 p-3">
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
          <div className="min-w-[860px] divide-y divide-slate-800">
            {projects.map((project) => (
              <div
                key={project._id}
                className="grid grid-cols-12 gap-3 p-3 transition-colors duration-150 hover:bg-slate-800/60"
              >
                <div className="col-span-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-emerald-500/15">
                    <FolderOpen className="h-3.5 w-3.5 text-emerald-300" />
                  </div>
                  <h3 className="truncate text-sm font-medium text-white">
                    {project.name}
                  </h3>
                </div>

                <div className="col-span-4 flex items-center gap-2 text-xs text-slate-400">
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
                   
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {project.members.length} member
                      {project.members.length !== 1 ? "s" : ""}
                    </span>
                  
                </div>

                <div className="col-span-1">
                  <div className="flex gap-1.5 justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Edit ${project.name}`}
                      onClick={() => handleEdit(project)}
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      aria-label={`Delete ${project.name}`}
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
        >
            <Plus className="h-4 w-4" />
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
