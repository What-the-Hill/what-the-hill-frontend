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
import { Bill } from "@/interfaces/bill";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { Clear, Edit } from "@mui/icons-material";
import BillDrawer from "../components/bill-drawer";

export default function Bills() {
  const {
    isFetching,
    data: bills = [],
    error,
  } = useQuery({
    queryKey: ["bills"],
    queryFn: async () => await api<Bill[]>("bills").json(),
  });
  const [billDrawerProps, setBillDrawerProps] = useState<{
    open: boolean;
    bill: Bill | null;
  }>({ open: false, bill: null });
  const [search, setSearch] = useState<string | null>(null);
  const filteredBills = useMemo(() => {
    if (!search || isFetching) {
      return bills;
    }

    return bills.filter(
      (bill) =>
        bill.number.toLowerCase().includes(search.toLowerCase()) ||
        bill.title.toLowerCase().includes(search.toLowerCase()) ||
        bill.sponsor.name.toLowerCase().includes(search.toLowerCase()) ||
        bill.status.name.toLowerCase().includes(search.toLowerCase()) ||
        bill.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [bills, search, isFetching]);

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Stack spacing={2} height="100%">
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setBillDrawerProps({
              open: true,
              bill: null,
            });
          }}
        >
          Add Bill
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
        rows={filteredBills}
        columns={[
          {
            field: "number",
            headerName: "Number",
            width: 100,
          },
          {
            field: "title",
            headerName: "Title",
            flex: 1,
          },
          {
            field: "sponsor",
            headerName: "Sponsor",
            valueGetter: (_, bill) => bill.sponsor.name,
            width: 200,
          },
          {
            field: "stage",
            headerName: "Stage",
            valueGetter: (_, bill) => bill.stage.name,
            width: 200,
          },
          {
            field: "status",
            headerName: "Status",
            valueGetter: (_, bill) => bill.status.name,
            renderCell: (params) => (
              <Typography
                sx={{
                  color: params.row.status.color,
                }}
                height="100%"
                alignContent="center"
              >
                {params.value}
              </Typography>
            ),
            width: 200,
          },
          {
            field: "name",
            headerName: "Name",
            flex: 0.75,
            minWidth: 200,
          },
          {
            field: "ranking",
            headerName: "⭐",
            width: 50,
          },
          {
            field: "updatedAt",
            headerName: "Updated",
            valueGetter: (_, bill) => new Date(bill.updatedAt).toLocaleString(),
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
                    setBillDrawerProps({ open: true, bill: params.row });
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
      <BillDrawer
        open={billDrawerProps.open}
        onClose={() => setBillDrawerProps({ open: false, bill: null })}
        bill={billDrawerProps.bill}
      />
    </Stack>
  );
}
