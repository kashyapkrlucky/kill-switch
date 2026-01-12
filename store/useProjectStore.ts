import { IProject } from "@/core/types/app.types";
import { create } from "zustand";
import axios from "@/core/lib/axios";

interface ProjectStore {
  loading: boolean;
  error: string | null;
  projects: IProject[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getProjects: () => Promise<void>;
  createProject: (project: IProject) => Promise<void>;
  updateProject: (project: IProject) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  loading: false,
  error: null,
  projects: [],
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  getProjects: async () => {
      try {
        set({ loading: true });
      const {
        data: { data },
      } = await axios.get("/projects");
      set({ projects: data || [] });
    } catch (error) {
      console.error("Error fetching projects:", error);
      set({ error: "Failed to fetch projects" });
    } finally {
      set({ loading: false });
    }
  },
  createProject: async (project) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.post("/projects", project);
      set((state) => ({ projects: [...state.projects, data] }));
    } catch (error) {
      console.error("Error creating project:", error);
      set({ error: "Failed to create project" });
    } finally {
      set({ loading: false });
    }
  },
  updateProject: async (project) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.put(`/projects/${project._id}`, project);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === project._id ? data : p)),
      }));
    } catch (error) {
      console.error("Error updating project:", error);
      set({ error: "Failed to update project" });
    } finally {
      set({ loading: false });
    }
  },
  deleteProject: async (projectId) => {
    try {
      set({ loading: true });
      await axios.delete(`/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
      }));
    } catch (error) {
      console.error("Error deleting project:", error);
      set({ error: "Failed to delete project" });
    } finally {
      set({ loading: false });
    }
  },
}));
