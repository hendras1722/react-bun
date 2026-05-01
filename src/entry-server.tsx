import ReactDOMServer from "react-dom/server";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { attachRouterServerSsrUtils } from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router";
import { ThemeProvider } from "./components/ThemeProvider";
import { SeoProvider } from "./hooks/useSeoMeta";

export async function render(request: Request) {
  const url = new URL(request.url);
  const memoryHistory = createMemoryHistory({
    initialEntries: [url.pathname + url.search],
  });

  const router = createRouter(memoryHistory);

  // Attach SSR utils BEFORE load
  attachRouterServerSsrUtils({ router, manifest: undefined });

  // Wait for all loaders to resolve
  await router.load();

  // Instruct TanStack Router to dehydrate the state
  await (router as any).serverSsr?.dehydrate();

  const serverContext: any = { head: {} };

  // Render to string (synchronous, non-streaming)
  // This is required so TanStack Router can inject dehydration scripts into the HTML
  let html = ReactDOMServer.renderToString(
    <ThemeProvider defaultTheme="dark" storageKey="bun-admin-theme">
      <SeoProvider serverContext={serverContext}>
        <RouterProvider router={router} />
      </SeoProvider>
    </ThemeProvider>
  );

  // Signal that render is finished so TanStack Router can finalize dehydration
  (router as any).serverSsr.setRenderFinished();

  // Take the buffered HTML - this contains the dehydration scripts (with matches data)
  // TanStack Router injects these at the end of the body
  const injectedHtml = (router as any).serverSsr.takeBufferedHtml() || "";

  // Take buffered scripts (stream barrier initialization)
  const bufferedScripts = (router as any).serverSsr.takeBufferedScripts();
  let headScript = "";
  if (Array.isArray(bufferedScripts)) {
    headScript = bufferedScripts.map((s: any) => {
      if (s.tag && s.attrs) {
        const attrs = Object.entries(s.attrs)
          .filter(([k]) => k !== "nonce")
          .map(([k, v]) => `${k}="${v}"`)
          .join(" ");
        return `<${s.tag}${attrs ? " " + attrs : ""}>${s.children || ""}</${s.tag}>`;
      }
      return "";
    }).join("\n");
  } else if (bufferedScripts && (bufferedScripts as any).tag) {
    const s = bufferedScripts as any;
    const attrs = Object.entries(s.attrs)
      .filter(([k]) => k !== "nonce")
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ");
    headScript = `<${s.tag}${attrs ? " " + attrs : ""}>${s.children || ""}</${s.tag}>`;
  }

  // Cleanup router SSR state
  (router as any).serverSsr?.cleanup?.();

  return {
    html,           // rendered body HTML
    headScript,     // stream barrier init script (goes in <head>)
    injectedHtml,   // dehydration scripts with router data (goes before </body>)
    headContext: serverContext.head,
  };
}
