"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { Clear, Edit } from "@mui/icons-material";
import { Status } from "@/interfaces/status";
import StatusDrawer from "../components/status-drawer";

export default function Statuses() {
  const {
    isFetching,
    data: statuses = [],
    error,
  } = useQuery({
    queryKey: ["statuses"],
    queryFn: async () => await api<Status[]>("statuses").json(),
  });
  const [statusDrawerProps, setStatusDrawerProps] = useState<{
    open: boolean;
    status: Status | null;
  }>({ open: false, status: null });
  const [search, setSearch] = useState<string | null>(null);
  const filteredStatuses = useMemo(() => {
    if (!search || isFetching) {
      return statuses;
    }

    return statuses.filter((status) =>
      status.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [statuses, search, isFetching]);

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Stack spacing={2} height="100%">
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setStatusDrawerProps({
              open: true,
              status: null,
            });
          }}
        >
          Add Status
        </Button>
        <TextField
          name="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          value={search || ""}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearch(null)}
                    disabled={!search}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
      <DataGrid
        rows={filteredStatuses}
        columns={[
          {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 200,
          },
          {
            field: "_count",
            headerName: "# of Bills",
            minWidth: 100,
            valueGetter: (_, status) => status._count.Bill,
          },
          {
            field: "color",
            headerName: "Color",
            width: 100,
            renderCell: (params) => (
              <Stack height="100%" justifyContent="center">
                <Box
                  sx={{
                    bgcolor: params.row.color,
                    height: "50%",
                    width: "75px",
                  }}
                />
              </Stack>
            ),
          },
          {
            field: "updatedAt",
            headerName: "Updated",
            valueGetter: (_, status) =>
              new Date(status.updatedAt).toLocaleString(),
            width: 175,
          },
          {
            field: "",
            maxWidth: 50,
            renderCell: (params) => (
              <Stack
                direction="row"
                height="100%"
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  onClick={() => {
                    setStatusDrawerProps({
                      open: true,
                      status: params.row,
                    });
                  }}
                >
                  <Edit />
                </IconButton>
              </Stack>
            ),
          },
        ]}
        autoPageSize
        rowSelection={false}
        disableColumnMenu
        disableColumnResize
        loading={isFetching}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "linear-progress",
          },
        }}
      />
      <StatusDrawer
        open={statusDrawerProps.open}
        onClose={() => setStatusDrawerProps({ open: false, status: null })}
        status={statusDrawerProps.status}
      />
    </Stack>
  );
}
