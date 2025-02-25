"use client";

import { Typography } from "@mui/material";
import { useAdminStore } from "./admin-store";
import Bills from "./tabs/bills";
import Legislators from "./tabs/legislators";
import Stages from "./tabs/stages";
import Statuses from "./tabs/statuses";

export default function Page() {
  const tab = useAdminStore((state) => state.tab);

  if (tab === 0) {
    return <Bills />;
  }

  if (tab === 1) {
    return <Legislators />;
  }

  if (tab === 2) {
    return <Stages />;
  }

  if (tab === 3) {
    return <Statuses />;
  }

  return <Typography variant="h4">How did you get here?</Typography>;
}
