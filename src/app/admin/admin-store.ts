import { create } from "zustand";

interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  accessToken: string;
}

interface AdminState {
  tab: number;
  user: User | null;
  setTab: (tab: number) => void;
  setUser: (user: User) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  tab: 0,
  user: null,
  setTab: (tab: number) => set(() => ({ tab })),
  setUser: (user: User) => set(() => ({ user })),
}));
