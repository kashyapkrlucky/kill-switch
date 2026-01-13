import axiosInstance from "@/core/lib/axios";
import { IFlag, IProjectToken } from "@/core/types/app.types";
import { create } from "zustand";

interface TokenState {
  loading: boolean;
  error: string | null;
  tokens: IProjectToken[];
  response: {data: IFlag[]}
  getTokens: (projectId: string) => Promise<void>;
  generateToken: (projectId: string) => Promise<void>;
  deleteToken: (tokenId: string) => Promise<void>;
  getApiResponse: (token: string) => Promise<void>;
}

export const useTokenStore = create<TokenState>((set) => ({
  loading: false,
  error: null,
  tokens: [],
  response: {data: []},
  getTokens: async (projectId: string) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axiosInstance.get(`/access/token?projectId=${projectId}`);
      set({ tokens: data });
    } catch (error) {
      set({ error: "Failed to fetch tokens" });
    } finally {
      set({ loading: false });
    }
  },
  generateToken: async (projectId: string) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axiosInstance.post(`/access/token`, { projectId });
      set((state) => ({ tokens: [...state.tokens, data] }));
    } catch (error) {
      set({ error: "Failed to fetch tokens" });
    } finally {
      set({ loading: false });
    }
  },
  deleteToken: async (tokenId: string) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axiosInstance.delete(`/access/token/${tokenId}`);
      set({ tokens: data });
    } catch (error) {
      set({ error: "Failed to delete token" });
    } finally {
      set({ loading: false });
    }
  },
  getApiResponse: async (token:string) => {
    try {
      set({ loading: true });
      const {
        data,
      } = await axiosInstance.get(`/access/flags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ response: data });
    } catch (error) {
      set({ error: "Failed to fetch flags" });
    } finally {
      set({ loading: false });
    }
  },
}));
