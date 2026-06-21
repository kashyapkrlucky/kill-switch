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
    <div className="w-full">
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
        <div className="glass-panel overflow-x-auto rounded-xl">
          {/* Table Header */}
          <div className="grid min-w-[900px] grid-cols-12 gap-3 border-b border-slate-800/90 bg-slate-950/60 p-4">
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
          <div className="min-w-[900px] divide-y divide-slate-800/80">
            {projects.map((project) => (
              <div
                key={project._id}
                className="grid grid-cols-12 gap-3 p-4 transition-colors duration-150 hover:bg-slate-900/80"
              >
                <div className="col-span-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-500/15">
                    <FolderOpen className="h-4 w-4 text-sky-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white">
                      {project.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {project.code}
                    </p>
                  </div>
                </div>

                <div className="col-span-4 flex items-center gap-2 text-xs leading-5 text-slate-400">
                  {project.description || "No description provided"}
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      project.status === "active"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : project.status === "inactive"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
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
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl py-14 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60">
            <FolderOpen className="h-7 w-7 text-slate-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            No projects found
          </h3>
          <p className="mb-5 max-w-md text-sm text-slate-400">
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
