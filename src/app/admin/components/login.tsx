/* eslint-disable react/no-children-prop */
import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAdminStore } from "../admin-store";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";

export default function Login() {
  const user = useAdminStore((state) => state.user);
  const setUser = useAdminStore((state) => state.setUser);
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmitAsync: async ({ value: { email, password } }) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_ROOT}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email,
                password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const error = await response.json();

            return {
              form: error.message,
            };
          }

          const token = await response.json();

          setUser(token);
          return null;
        } catch {
          return {
            form: "An error occurred while attempting to sign in. Are you connected to the internet?",
          };
        }
      },
    },
  });

  if (!user) {
    return (
      <>
        <Button color="inherit" onClick={() => setDialogOpen(true)}>
          Login
        </Button>
        <Dialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
        >
          <DialogContent sx={{ width: 500 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <Stack spacing={2}>
                <form.Field
                  name="email"
                  children={({ state, handleChange, handleBlur, name }) => (
                    <TextField
                      autoFocus
                      fullWidth
                      required
                      id={name}
                      defaultValue={state.value}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      type="email"
                      label="Email"
                    />
                  )}
                />
                <form.Field
                  name="password"
                  children={({ state, handleChange, handleBlur, name }) => (
                    <TextField
                      fullWidth
                      required
                      id={name}
                      defaultValue={state.value}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      type="password"
                      label="Password"
                    />
                  )}
                />
                <form.Subscribe
                  selector={(state) => [state.errorMap]}
                  children={([errorMap]) =>
                    errorMap.onSubmit ? (
                      <Typography variant="body1" color="error">
                        {errorMap.onSubmit.form}
                      </Typography>
                    ) : undefined
                  }
                />
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <Typography variant="h6">{user.name}</Typography>;
}
