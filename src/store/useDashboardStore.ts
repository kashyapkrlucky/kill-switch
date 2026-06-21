import { IFlag } from "@/core/types/app.types";
import { create } from "zustand";
import axiosInstance from "@/core/lib/axios";

interface DashboardState {
  loading: boolean;
  error: string | null;
  stats: {
    projects: number;
    activeFlags: number;
    totalFlags: number;
    apiTokens: number;
  };
  usage: {
    totalTokens: number;
    limit: number;
    percentage: number;
  };
  recentFlags: IFlag[];
  getStats: () => Promise<void>;
  getRecentFlags: () => Promise<void>;
  getUsage: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  loading: false,
  error: null,
  stats: {
    projects: 0,
    activeFlags: 0,
    totalFlags: 0,
    apiTokens: 0,
  },
  usage: {
    totalTokens: 0,
    limit: 0,
    percentage: 0,
  },
  recentFlags: [],
  getStats: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axiosInstance.get("/dashboard/stats");
      set({ stats: data || {} });
    } catch (error) {
      console.error("Error fetching projects:", error);
      set({ error: "Failed to fetch projects" });
    } finally {
      set({ loading: false });
    }
  },
  getRecentFlags: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axiosInstance.get("/dashboard/recent");
      set({ recentFlags: data || [] });
    } catch (error) {
      console.error("Error fetching recent flags:", error);
      set({ error: "Failed to fetch recent flags" });
    } finally {
      set({ loading: false });
    }
  },
  getUsage: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axiosInstance.get("/dashboard/usage");
      set({ usage: data || {} });
    } catch (error) {
      console.error("Error fetching usage:", error);
      set({ error: "Failed to fetch usage" });
    } finally {
      set({ loading: false });
    }
  },
}));

