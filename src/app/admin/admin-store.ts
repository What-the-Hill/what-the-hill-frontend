import { create } from "zustand";

interface SnackbarProps {
  open: boolean;
  type: "success" | "error";
  content: string;
}

interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  accessToken: string;
}

interface AdminState {
  snackbarProps: SnackbarProps;
  tab: number;
  user: User | null;
  setSnackbarProps: (snackbarProps: SnackbarProps) => void;
  setTab: (tab: number) => void;
  setUser: (user: User) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  snackbarProps: {
    open: false,
    type: "success",
    content: "",
  },
  tab: 0,
  user: null,
  setSnackbarProps: (snackbarProps: SnackbarProps) =>
    set(() => ({ snackbarProps })),
  setTab: (tab: number) => set(() => ({ tab })),
  setUser: (user: User) => set(() => ({ user })),
}));
