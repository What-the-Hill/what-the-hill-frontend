/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { useEffect } from "react";
import { useAdminStore } from "../admin-store";
import { User } from "@/interfaces/user";
import { Status } from "@/interfaces/status";

type Props = {
  status: Status | null;
  onClose: () => void;
  open: boolean;
};

const COLORS = ["black", "red", "green", "blue", "orange", "purple", "teal"];

export default function StatusDrawer({ status, onClose, open }: Props) {
  const queryClient = useQueryClient();
  const setSnackbarProps = useAdminStore((state) => state.setSnackbarProps);
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await api.get<User[]>("users").json(),
  });
  const form = useForm({
    defaultValues: {
      color: status?.color || "",
      name: status?.name || "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          if (status) {
            await api.patch(`statuses/${status.id}`, {
              json: { ...value },
            });
            setSnackbarProps({
              open: true,
              type: "success",
              content: "Status updated!",
            });
          } else {
            await api.post("statuses", { json: { ...value } });
            setSnackbarProps({
              open: true,
              type: "success",
              content: "Status added!",
            });
          }

          queryClient.invalidateQueries({ queryKey: ["statuses"] });
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
  }, [status, form, open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2} minWidth={400} height="100%">
        <Stack spacing={2}>
          {status ? (
            <Typography variant="h6">Edit Status</Typography>
          ) : (
            <Typography variant="h6">New Status</Typography>
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
                name="name"
                children={({ state, handleChange, handleBlur, name }) => (
                  <TextField
                    autoFocus
                    fullWidth
                    required
                    id={name}
                    defaultValue={state.value}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    label="Name"
                  />
                )}
              />
              <form.Field
                name="color"
                children={({ state, handleChange, handleBlur, name }) => (
                  <FormControl fullWidth required>
                    <InputLabel id={`${name}-label`}>Color</InputLabel>
                    <Select
                      labelId={`${name}-label`}
                      id={name}
                      value={state.value}
                      label="Color"
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      required
                    >
                      {COLORS.map((color) => (
                        <MenuItem key={color} value={color}>
                          <Box
                            sx={{
                              bgcolor: color,
                              height: "20px",
                              width: "100%",
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Button type="submit" variant="contained">
                Save
              </Button>
              {status && (
                <>
                  <Typography>
                    Updated at {new Date(status.updatedAt).toLocaleString()} by{" "}
                    {users.find((user) => user.id === status.updatedBy)?.name ||
                      status.updatedBy}
                  </Typography>
                  <Typography>
                    Created at {new Date(status.createdAt).toLocaleString()}
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
