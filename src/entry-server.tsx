import { renderToReadableStream } from "react-dom/server";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { attachRouterServerSsrUtils } from "@tanstack/react-router/ssr/server";
import { router } from "./router";
import { ThemeProvider } from "./components/ThemeProvider";

export async function render(request: Request) {
  const url = new URL(request.url);
  const memoryHistory = createMemoryHistory({
    initialEntries: [url.pathname + url.search],
  });

  router.update({
    history: memoryHistory,
  });

  // Attach SSR utils
  attachRouterServerSsrUtils({ router });

  // Wait for all loaders to resolve
  await router.load();

  // Dehydrate the router state (this will buffer scripts)
  await (router as any).serverSsr.dehydrate();
  
  // Take the buffered scripts which contain the dehydrated state
  const scripts = (router as any).serverSsr.takeBufferedScripts();
  const dehydratedStateScript = scripts.children;

  const stream = await renderToReadableStream(
    <ThemeProvider defaultTheme="dark" storageKey="bun-admin-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );

  return { stream, dehydratedStateScript };
}
