import { IProject } from "@/core/types/app.types";
import { create } from "zustand";
import axios from "@/core/lib/axios";

interface ProjectStore {
  projects: IProject[];
  getProjects: () => Promise<void>;
  createProject: (project: IProject) => Promise<void>;
  updateProject: (project: IProject) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  getProjects: async () => {
    try {
      const {
        data: { data },
      } = await axios.get("/projects");
      set({ projects: data || [] });
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  },
  createProject: async (project) => {
    try {
      const {
        data: { data },
      } = await axios.post("/projects", project);
      set((state) => ({ projects: [...state.projects, data] }));
    } catch (error) {
      console.error("Error creating project:", error);
    }
  },
  updateProject: async (project) => {
    try {
      const {
        data: { data },
      } = await axios.put(`/projects/${project._id}`, project);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === project._id ? data : p)),
      }));
    } catch (error) {
      console.error("Error updating project:", error);
    }
  },
  deleteProject: async (projectId) => {
    try {
      await axios.delete(`/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
      }));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  },
}));
