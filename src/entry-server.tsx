import { renderToReadableStream } from "react-dom/server";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { attachRouterServerSsrUtils } from "@tanstack/react-router/ssr/server";
import { router } from "./router";
import { ThemeProvider } from "./components/ThemeProvider";
import { SeoProvider } from "./hooks/useSeoMeta";

export async function render(request: Request) {
  const url = new URL(request.url);
  const memoryHistory = createMemoryHistory({
    initialEntries: [url.pathname + url.search],
  });

  router.update({
    history: memoryHistory,
  });

  // Attach SSR utils
  attachRouterServerSsrUtils({ router, manifest: undefined });

  // Wait for all loaders to resolve
  await router.load();

  const serverContext: any = { head: {} };

  // Dehydrate the router state (this will buffer scripts)
  await (router as any).serverSsr.dehydrate();
  
  // Take the buffered scripts which contain the dehydrated state
  const scripts = (router as any).serverSsr.takeBufferedScripts();
  const dehydratedStateScript = scripts.children;

  const stream = await renderToReadableStream(
    <ThemeProvider defaultTheme="dark" storageKey="bun-admin-theme">
      <SeoProvider serverContext={serverContext}>
        <RouterProvider router={router} />
      </SeoProvider>
    </ThemeProvider>
  );

  return { stream, dehydratedStateScript, headContext: serverContext.head };
}
