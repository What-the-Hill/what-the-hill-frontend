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
import { useEffect } from "react";
import { useAdminStore } from "../admin-store";
import { User } from "@/interfaces/user";
import { Stage } from "@/interfaces/stage";

type Props = {
  stage: Stage | null;
  onClose: () => void;
  open: boolean;
};

export default function StageDrawer({ stage, onClose, open }: Props) {
  const queryClient = useQueryClient();
  const setSnackbarProps = useAdminStore((state) => state.setSnackbarProps);
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await api.get<User[]>("users").json(),
  });
  const form = useForm({
    defaultValues: {
      name: stage?.name || "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          if (stage) {
            await api.patch(`stages/${stage.id}`, {
              json: { ...value },
            });
            setSnackbarProps({
              open: true,
              type: "success",
              content: "Stage updated!",
            });
          } else {
            await api.post("stages", { json: { ...value } });
            setSnackbarProps({
              open: true,
              type: "success",
              content: "Stage added!",
            });
          }

          queryClient.invalidateQueries({ queryKey: ["stages"] });
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
  }, [stage, form, open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2} minWidth={400} height="100%">
        <Stack spacing={2}>
          {stage ? (
            <Typography variant="h6">Edit Stage</Typography>
          ) : (
            <Typography variant="h6">New Stage</Typography>
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
              {stage && (
                <>
                  <Typography>
                    Updated at {new Date(stage.updatedAt).toLocaleString()} by{" "}
                    {users.find((user) => user.id === stage.updatedBy)?.name ||
                      stage.updatedBy}
                  </Typography>
                  <Typography>
                    Created at {new Date(stage.createdAt).toLocaleString()}
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
