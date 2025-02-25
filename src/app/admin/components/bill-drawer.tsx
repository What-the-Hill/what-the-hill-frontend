/* eslint-disable react/no-children-prop */
import { Bill } from "@/interfaces/bill";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Legislator } from "@/interfaces/legislator";
import { Status } from "@/interfaces/status";
import { Stage } from "@/interfaces/stage";
import { useEffect } from "react";
import { useAdminStore } from "../admin-store";
import { User } from "@/interfaces/user";

type Props = {
  bill: Bill | null;
  onClose: () => void;
  open: boolean;
};

export default function BillDrawer({ bill, onClose, open }: Props) {
  const queryClient = useQueryClient();
  const setSnackbarProps = useAdminStore((state) => state.setSnackbarProps);
  const { data: legislators = [] } = useQuery({
    queryKey: ["legislators"],
    queryFn: async () => await api.get<Legislator[]>("legislators").json(),
  });
  const { data: statuses = [] } = useQuery({
    queryKey: ["statuses"],
    queryFn: async () => await api.get<Status[]>("statuses").json(),
  });
  const { data: stages = [] } = useQuery({
    queryKey: ["stages"],
    queryFn: async () => await api.get<Stage[]>("stages").json(),
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await api.get<User[]>("users").json(),
  });
  const form = useForm({
    defaultValues: {
      title: bill?.title || "",
      number: bill?.number || "",
      name: bill?.name || undefined,
      ranking: bill?.ranking || 0,
      sponsorId: bill?.sponsorId || "",
      stageId: bill?.stageId || "",
      statusId: bill?.statusId || "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          if (bill) {
            await api.patch(`bills/${bill.id}`, { json: { ...value } });
            setSnackbarProps({
              open: true,
              type: "success",
              content: "Bill updated!",
            });
          } else {
            await api.post("bills", { json: { ...value } });
            setSnackbarProps({
              open: true,
              type: "success",
              content: "Bill added!",
            });
          }

          queryClient.invalidateQueries({ queryKey: ["bills"] });
          onClose();
        } catch {
          return {
            form: "An error occurred, check your fields and internet connection!",
          };
        }

        return null;
      },
    },
  });

  useEffect(() => {
    form.reset();
  }, [bill, form, open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2} minWidth={400} height="100%">
        <Stack spacing={2}>
          {bill ? (
            <Typography variant="h6">Edit Bill</Typography>
          ) : (
            <Typography variant="h6">New Bill</Typography>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Stack spacing={2}>
              <form.Field
                name="title"
                children={({ state, handleChange, handleBlur, name }) => (
                  <TextField
                    autoFocus
                    fullWidth
                    required
                    id={name}
                    defaultValue={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    label="Title"
                  />
                )}
              />
              <form.Field
                name="number"
                children={({ state, handleChange, handleBlur, name }) => (
                  <TextField
                    autoFocus
                    fullWidth
                    required
                    id={name}
                    defaultValue={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    label="Number"
                  />
                )}
              />
              <form.Field
                name="name"
                children={({ state, handleChange, handleBlur, name }) => (
                  <TextField
                    autoFocus
                    fullWidth
                    id={name}
                    defaultValue={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    label="Name"
                  />
                )}
              />
              <form.Field
                name="ranking"
                children={({ state, handleChange, name }) => (
                  <Stack>
                    <Typography>Ranking (⭐)</Typography>
                    <Slider
                      aria-label="Ranking"
                      id={name}
                      defaultValue={state.value}
                      value={state.value}
                      valueLabelDisplay="auto"
                      step={1}
                      min={-5}
                      max={5}
                      onChange={(_, value) => handleChange(value as number)}
                      marks={[
                        { value: 0, label: "0" },
                        { value: -5, label: "-5" },
                        { value: 5, label: "5" },
                      ]}
                    />
                  </Stack>
                )}
              />
              <form.Field
                name="sponsorId"
                children={({ state, handleChange, handleBlur, name }) => (
                  <FormControl fullWidth required>
                    <InputLabel id={`${name}-label`}>Sponsor</InputLabel>
                    <Select
                      labelId={`${name}-label`}
                      id={name}
                      value={state.value}
                      label="Sponsor"
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      required
                    >
                      {legislators.map((legislator) => (
                        <MenuItem key={legislator.id} value={legislator.id}>
                          {legislator.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <form.Field
                name="stageId"
                children={({ state, handleChange, handleBlur, name }) => (
                  <FormControl fullWidth required>
                    <InputLabel id={`${name}-label`}>Stage</InputLabel>
                    <Select
                      labelId={`${name}-label`}
                      id={name}
                      value={state.value}
                      label="Stage"
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      required
                    >
                      {stages.map((stage) => (
                        <MenuItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <form.Field
                name="statusId"
                children={({ state, handleChange, handleBlur, name }) => (
                  <FormControl fullWidth required>
                    <InputLabel id={`${name}-label`}>Status</InputLabel>
                    <Select
                      labelId={`${name}-label`}
                      id={name}
                      value={state.value}
                      label="Status"
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      required
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {status.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Button type="submit" variant="contained">
                Save
              </Button>
              {bill && (
                <>
                  <Typography>
                    Updated at {new Date(bill.updatedAt).toLocaleString()} by{" "}
                    {users.find((user) => user.id === bill.updatedBy)?.name ||
                      bill.updatedBy}
                  </Typography>
                  <Typography>
                    Created at {new Date(bill.createdAt).toLocaleString()}
                  </Typography>
                </>
              )}
            </Stack>
          </form>
        </Stack>
      </Box>
    </Drawer>
  );
}
