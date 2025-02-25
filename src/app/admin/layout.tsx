"use client";

import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import styles from "./layout.module.css";
import Login from "./components/login";
import { useAdminStore } from "./admin-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VERSION } from "@/constants";

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAdminStore((state) => state.user);
  const tab = useAdminStore((state) => state.tab);
  const setTab = useAdminStore((state) => state.setTab);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.adminRoot}>
        <header className={styles.header}>
          <Box sx={{ bgcolor: "primary.main", p: 1, height: "100%" }}>
            <Stack direction="row" alignItems="center" height="100%">
              <Typography variant="h6">What The Hill</Typography>
              <Box sx={{ flexGrow: 1 }}>
                {user ? (
                  <nav>
                    <Tabs
                      value={tab}
                      onChange={(_, value) => setTab(value)}
                      textColor="inherit"
                      indicatorColor="secondary"
                      centered
                    >
                      <Tab label="Bills" />
                      <Tab label="Legislators" />
                      <Tab label="Stages" />
                      <Tab label="Statuses" />
                    </Tabs>
                  </nav>
                ) : undefined}
              </Box>
              <Login />
            </Stack>
          </Box>
        </header>
        <main className={styles.main}>{user ? children : undefined}</main>
        <footer className={styles.footer}>
          <Stack direction="row" justifyContent="flex-end">
            <Typography variant="subtitle1">v{VERSION}</Typography>
          </Stack>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
