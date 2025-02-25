"use client";

import ky from "ky";
import { useAdminStore } from "./admin-store";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_ROOT + "/",
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set(
          "Authorization",
          `Bearer ${useAdminStore.getState().user?.accessToken}`
        );
      },
    ],
  },
});
