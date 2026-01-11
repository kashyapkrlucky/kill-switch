import { IFlag } from "@/core/types/app.types";
import { create } from "zustand";
import axios from "@/core/lib/axios";

interface FlagStore {
  loading: boolean;
  error: string | null;
  flags: IFlag[];
  getFlags: (project: string) => Promise<void>;
  createFlag: (flag: IFlag) => Promise<void>;
  updateFlag: (flag: IFlag) => Promise<void>;
  deleteFlag: (flagId: string) => Promise<void>;
}

export const useFlagStore = create<FlagStore>((set) => ({
  loading: false,
  error: null,
  flags: [],
  getFlags: async (project) => {
    try {
      set({ loading: true, error: null });
      const {
        data: { data },
      } = await axios.get(`/flags?project=${project}`);
      set({ flags: data });
    } catch (error) {
      console.error("Error fetching flags:", error);
      set({ error: "Failed to fetch flags" });
    } finally {
      set({ loading: false });
    }
  },
  createFlag: async (flag) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post("/flags", flag);
      set((state) => ({ flags: [...state.flags, data] }));
    } catch (error) {
      console.error("Error creating flag:", error);
      set({ error: "Failed to create flag" });
    } finally {
      set({ loading: false });
    }
  },
  updateFlag: async (flag) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(`/flags/${flag._id}`, flag);
      set((state) => ({
        flags: state.flags.map((f) => (f._id === flag._id ? response.data : f)),
      }));
    } catch (error) {
      console.error("Error updating flag:", error);
      set({ error: "Failed to update flag" });
    } finally {
      set({ loading: false });
    }
  },
  deleteFlag: async (flagId) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`/flags/${flagId}`);
      set((state) => ({ flags: state.flags.filter((f) => f._id !== flagId) }));
    } catch (error) {
      console.error("Error deleting flag:", error);
      set({ error: "Failed to delete flag" });
    } finally {
      set({ loading: false });
    }
  },
}));
