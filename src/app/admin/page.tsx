"use client";

import { Typography } from "@mui/material";
import { useAdminStore } from "./admin-store";

export default function Page() {
  const tab = useAdminStore((state) => state.tab);

  if (tab === 0) {
    return <Typography variant="h4">Bills</Typography>;
  }

  if (tab === 1) {
    return <Typography variant="h4">Legislators</Typography>;
  }

  if (tab === 2) {
    return <Typography variant="h4">Stages</Typography>;
  }

  if (tab === 3) {
    return <Typography variant="h4">Statuses</Typography>;
  }

  return <Typography variant="h4">How did you get here?</Typography>;
}
