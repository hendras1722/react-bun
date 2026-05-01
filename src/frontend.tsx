import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { hydrate } from "@tanstack/react-router/ssr/client";
import { router } from "./router";
import { ThemeProvider } from "./components/ThemeProvider";
import { SeoProvider } from "./hooks/useSeoMeta";
import "./tailwind.css";

// Hydrate the router state from the server
// The script injected by the server will have already populated window.$_TSR
hydrate(router);

const app = (
  <ThemeProvider defaultTheme="dark" storageKey="bun-admin-theme">
    <SeoProvider>
      <RouterProvider router={router} />
    </SeoProvider>
  </ThemeProvider>
);

const elem = document.getElementById("root")!;

// Hydrate instead of render for SSR
hydrateRoot(elem, app);
