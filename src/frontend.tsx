import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getRouterConfig } from "./router";
import "./index.css";

const router = createBrowserRouter(getRouterConfig());

const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

const elem = document.getElementById("root")!;

// Hydrate instead of render for SSR
hydrateRoot(elem, app);
