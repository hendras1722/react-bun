import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getRouterConfig } from "./router";

import { ThemeProvider } from "./components/ThemeProvider";

const router = createBrowserRouter(getRouterConfig());

const app = (
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="bun-admin-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);

const elem = document.getElementById("root")!;

// Hydrate instead of render for SSR
hydrateRoot(elem, app);
