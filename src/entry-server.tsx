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
  
  // Manually render the scripts because they are plain objects, not React elements
  let dehydratedStateScript = "";
  if (Array.isArray(scripts)) {
    dehydratedStateScript = scripts.map(s => {
      if (s.tag && s.attrs) {
        const attrs = Object.entries(s.attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
        return `<${s.tag} ${attrs}>${s.children || ""}</${s.tag}>`;
      }
      return "";
    }).join("\n");
  } else if (scripts && (scripts as any).tag) {
    const s = scripts as any;
    const attrs = Object.entries(s.attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
    dehydratedStateScript = `<${s.tag} ${attrs}>${s.children || ""}</${s.tag}>`;
  }

  const stream = await renderToReadableStream(
    <ThemeProvider defaultTheme="dark" storageKey="bun-admin-theme">
      <SeoProvider serverContext={serverContext}>
        <RouterProvider router={router} />
      </SeoProvider>
    </ThemeProvider>
  );

  return { stream, dehydratedStateScript, headContext: serverContext.head };
}
