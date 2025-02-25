import { User } from "@/interfaces/user";
import { create } from "zustand";

interface SnackbarProps {
  open: boolean;
  type: "success" | "error";
  content: string;
}

interface LoggedInUser extends User {
  accessToken: string;
}

interface AdminState {
  snackbarProps: SnackbarProps;
  tab: number;
  user: LoggedInUser | null;
  setSnackbarProps: (snackbarProps: SnackbarProps) => void;
  setTab: (tab: number) => void;
  setUser: (user: LoggedInUser) => void;
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
  setUser: (user: LoggedInUser) => set(() => ({ user })),
}));
