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
import { Legislator } from "@/interfaces/legislator";
import LegislatorDrawer from "../components/legislator-drawer";

export default function Legislators() {
  const {
    isFetching,
    data: legislators = [],
    error,
  } = useQuery({
    queryKey: ["legislators"],
    queryFn: async () => await api<Legislator[]>("legislators").json(),
  });
  const [legislatorDrawerProps, setLegislatorDrawerProps] = useState<{
    open: boolean;
    legislator: Legislator | null;
  }>({ open: false, legislator: null });
  const [search, setSearch] = useState<string | null>(null);
  const filteredLegislators = useMemo(() => {
    if (!search || isFetching) {
      return legislators;
    }

    return legislators.filter((legislator) =>
      legislator.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [legislators, search, isFetching]);

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Stack spacing={2} height="100%">
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setLegislatorDrawerProps({
              open: true,
              legislator: null,
            });
          }}
        >
          Add Legislator
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
        rows={filteredLegislators}
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
            valueGetter: (_, legislator) =>
              new Date(legislator.updatedAt).toLocaleString(),
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
                    setLegislatorDrawerProps({
                      open: true,
                      legislator: params.row,
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
      <LegislatorDrawer
        open={legislatorDrawerProps.open}
        onClose={() =>
          setLegislatorDrawerProps({ open: false, legislator: null })
        }
        legislator={legislatorDrawerProps.legislator}
      />
    </Stack>
  );
}
