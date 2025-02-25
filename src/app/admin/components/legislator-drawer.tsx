/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Drawer,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Legislator } from "@/interfaces/legislator";
import { useEffect } from "react";
import { useAdminStore } from "../admin-store";
import { User } from "@/interfaces/user";

type Props = {
  legislator: Legislator | null;
  onClose: () => void;
  open: boolean;
};

export default function LegislatorDrawer({ legislator, onClose, open }: Props) {
  const queryClient = useQueryClient();
  const setSnackbarProps = useAdminStore((state) => state.setSnackbarProps);
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await api.get<User[]>("users").json(),
  });
  const form = useForm({
    defaultValues: {
      name: legislator?.name || "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          if (legislator) {
            await api.patch(`legislators/${legislator.id}`, {
              json: { ...value },
            });
            setSnackbarProps({
              open: true,
              type: "success",
              content: "Legislator updated!",
            });
          } else {
            await api.post("legislators", { json: { ...value } });
            setSnackbarProps({
              open: true,
              type: "success",
              content: "Legislator added!",
            });
          }

          queryClient.invalidateQueries({ queryKey: ["legislators"] });
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
  }, [legislator, form, open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2} minWidth={400} height="100%">
        <Stack spacing={2}>
          {legislator ? (
            <Typography variant="h6">Edit Legislator</Typography>
          ) : (
            <Typography variant="h6">New Legislator</Typography>
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
              <Button type="submit" variant="contained">
                Save
              </Button>
              {legislator && (
                <>
                  <Typography>
                    Updated at {new Date(legislator.updatedAt).toLocaleString()}{" "}
                    by{" "}
                    {users.find((user) => user.id === legislator.updatedBy)
                      ?.name || legislator.updatedBy}
                  </Typography>
                  <Typography>
                    Created at {new Date(legislator.createdAt).toLocaleString()}
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
