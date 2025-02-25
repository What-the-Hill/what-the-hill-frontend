"use client";

import {
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
import { Stage } from "@/interfaces/stage";
import StageDrawer from "../components/stage-drawer";

export default function Stages() {
  const {
    isFetching,
    data: stages = [],
    error,
  } = useQuery({
    queryKey: ["stages"],
    queryFn: async () => await api<Stage[]>("stages").json(),
  });
  const [stageDrawerProps, setStageDrawerProps] = useState<{
    open: boolean;
    stage: Stage | null;
  }>({ open: false, stage: null });
  const [search, setSearch] = useState<string | null>(null);
  const filteredStages = useMemo(() => {
    if (!search || isFetching) {
      return stages;
    }

    return stages.filter((stage) =>
      stage.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [stages, search, isFetching]);

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Stack spacing={2} height="100%">
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setStageDrawerProps({
              open: true,
              stage: null,
            });
          }}
        >
          Add Stage
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
        rows={filteredStages}
        columns={[
          {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 200,
          },
          {
            field: "updatedAt",
            headerName: "Updated",
            valueGetter: (_, stage) =>
              new Date(stage.updatedAt).toLocaleString(),
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
                    setStageDrawerProps({
                      open: true,
                      stage: params.row,
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
      <StageDrawer
        open={stageDrawerProps.open}
        onClose={() => setStageDrawerProps({ open: false, stage: null })}
        stage={stageDrawerProps.stage}
      />
    </Stack>
  );
}
