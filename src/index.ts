import { serve, plugin, type BunRequest } from "bun";
import { readFileSync, watch as fsWatch } from "fs";
import { join } from "path";
import { handleProxyRequest } from "./server/proxy";
import { renderHeadToString } from "./hooks/useSeoMeta";
import { serverContext } from "./server/context";

// ── Tailwind CSS ──────────────────────────────────────────────────────────────
// Build Tailwind once (synchronously) so the CSS is ready before the server
// starts. Then spawn the watcher in the background so new classes are picked
// up automatically on save without any extra npm script.
const tailwindArgs = [
  "npx", "@tailwindcss/cli",
  "-i", "./src/index.css",
  "-o", "./src/tailwind.css",
];

console.log("🎨 Building Tailwind CSS...");
const twBuild = Bun.spawnSync(tailwindArgs, { stderr: "inherit" });
if (twBuild.exitCode !== 0) {
  console.warn("⚠️  Tailwind build exited with code", twBuild.exitCode);
}

if (process.env.NODE_ENV !== "production") {
  // Watch in background — do not await, let it run alongside the server
  Bun.spawn([...tailwindArgs, "--watch"], { stderr: "pipe", stdout: "pipe" });
  console.log("👀 Tailwind watching for changes...");
}
// ─────────────────────────────────────────────────────────────────────────────

// 1. Build Client Bundle FIRST (before registering the SSR assets plugin)
// This ensures Bun.build uses its native asset loader to emit actual files.
console.log("🚀 Building client bundle...");
const clientBuild = await Bun.build({
  entrypoints: ["./src/frontend.tsx"],
  target: "browser",
  sourcemap: "inline",
  minify: process.env.NODE_ENV === "production",
  publicPath: "/",
  naming: {
    asset: "assets/[name].[ext]",
  },
  define: {
    "process.env": JSON.stringify(process.env),
    "Bun.env": JSON.stringify(process.env),
  },
});

if (!clientBuild.success) {
  console.error("Build failed:", clientBuild.logs);
  process.exit(1);
}

const buildOutputs = new Map<string, Blob>();
for (const output of clientBuild.outputs) {
  const path = output.path.replace(/^\./, "");
  buildOutputs.set(path, output);
}

console.log("📦 Build outputs:", Array.from(buildOutputs.keys()));

// 2. NOW register the SSR assets plugin for the Server Runtime
plugin({
  name: "ssr-assets",
  setup(build) {
    build.onLoad({ filter: /\.(svg|png|jpg|jpeg|gif|webp|ico)$/ }, (args) => {
      const fileName = args.path.split("/").pop();
      return {
        contents: `export default "/assets/${fileName}";`,
        loader: "js",
      };
    });
  },
});

// 3. Import server entry point AFTER plugin registration
const { render } = await import("./entry-server.tsx");
const { generate } = await import("../scripts/generate-routes");

// 4. Watcher for route generation (Development only)
if (process.env.NODE_ENV !== "production") {
  const watchOptions = { recursive: true };
  const handleWatch = (event: string, filename: string | null) => {
    if (filename && (filename.endsWith(".tsx") || filename.endsWith(".jsx"))) {
      console.log(`File ${filename} changed (${event}), regenerating routes...`);
      generate();
    }
  };

  fsWatch(join(process.cwd(), "src", "pages"), watchOptions, handleWatch);
  fsWatch(join(process.cwd(), "src", "layouts"), watchOptions, handleWatch);
}

let indexHtml = readFileSync("./src/index.html", "utf-8");
const splitPoint = '<div id="root"></div>';
let [htmlStart, htmlEnd] = indexHtml.split(splitPoint);

// Function to get latest HTML in dev
function getHtmlTemplate() {
  if (process.env.NODE_ENV !== "production") {
    indexHtml = readFileSync("./src/index.html", "utf-8");
    [htmlStart, htmlEnd] = indexHtml.split(splitPoint);
  }
}

// Always inject tailwind.css directly (served fresh from disk) + bundled JS CSS
const twLink = '<link rel="stylesheet" href="/tailwind.css" />';
const bundleLink = buildOutputs.has("/frontend.css") ? '<link rel="stylesheet" href="/frontend.css" />' : '';
const themeScript = `
<script>
  (function() {
    try {
      var theme = localStorage.getItem('bun-admin-theme') || 'dark';
      var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
      if (theme === 'system') theme = supportDarkMode ? 'dark' : 'light';
      document.documentElement.classList.add(theme);
    } catch (e) {}
  })();
</script>
`;
// We will inject these dynamically in the fetch handler now

// Prepare Live Reload script for injection at the end of body
let liveReloadScript = "";
if (process.env.NODE_ENV !== "production") {
  liveReloadScript = `
    <script>
      (function() {
        let socket;
        let reconnecting = false;
        function connect() {
          const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
          socket = new WebSocket(protocol + '//' + location.host + '/live-reload');
          socket.onopen = () => {
            if (reconnecting) {
              console.log('🚀 Reconnected to dev server, reloading...');
              location.reload();
            }
          };
          socket.onmessage = (e) => {
            if (e.data === 'reload') location.reload();
          };
          socket.onclose = () => {
            reconnecting = true;
            setTimeout(connect, 500);
          };
        }
        connect();
      })();
    </script>
  `;
}

const server = serve({
  port: 3000,
  routes: {
    "/api/*": (req: BunRequest<'/api/*'>) => handleProxyRequest(req),
    // Always serve tailwind.css fresh from disk so hot-reload works without server restart
    "/tailwind.css": async () => {
      const file = Bun.file(join(process.cwd(), "src", "tailwind.css"));
      if (await file.exists()) {
        return new Response(file, { headers: { "Content-Type": "text/css", "Cache-Control": "no-cache" } });
      }
      return new Response("", { headers: { "Content-Type": "text/css" } });
    },
  },

  async fetch(req, server) {
    if (server.upgrade(req)) return;

    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname === "/live-reload") {
      if (server.upgrade(req)) return;
    }

    // Serve build outputs (JS, CSS, Assets)
    if (buildOutputs.has(pathname)) {
      // In development, we want to serve the LATEST files from disk if they exist
      // especially for tailwind.css which is updated by the Tailwind CLI
      if (process.env.NODE_ENV !== "production") {
        if (pathname === "/frontend.js") {
          // For JS, we still need the bundled version, but we should ideally rebuild it.
          // For now, let's just serve the one from memory.
        } else if (pathname === "/tailwind.css") {
          const tailwindFile = Bun.file(join(process.cwd(), "src", "tailwind.css"));
          if (await tailwindFile.exists()) {
            return new Response(tailwindFile, { headers: { "Content-Type": "text/css" } });
          }
        } else if (pathname.startsWith("/assets/") || pathname.endsWith(".svg") || pathname.endsWith(".png")) {
          const assetName = pathname.startsWith("/assets/") ? pathname.replace("/assets/", "") : pathname.replace("/", "");
          const assetPath = join(process.cwd(), "src", assetName);
          const assetFile = Bun.file(assetPath);
          if (await assetFile.exists()) {
            return new Response(assetFile);
          }
        }
      }

      const blob = buildOutputs.get(pathname)!;
      let contentType = blob.type;

      // Fix content types
      if (pathname.endsWith(".js")) contentType = "application/javascript";
      else if (pathname.endsWith(".css")) contentType = "text/css";
      else if (pathname.endsWith(".svg")) contentType = "image/svg+xml";
      else if (pathname.endsWith(".png")) contentType = "image/png";
      else if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) contentType = "image/jpeg";
      else if (pathname.endsWith(".webp")) contentType = "image/webp";
      else if (pathname.endsWith(".gif")) contentType = "image/gif";
      else if (pathname.endsWith(".ico")) contentType = "image/x-icon";

      return new Response(blob, { headers: { "Content-Type": contentType } });
    }

    // Root asset fallback (Check if file exists in src/)
    if (pathname.length > 1 && !pathname.includes("/", 1)) {
      const file = Bun.file(join(process.cwd(), "src", pathname.slice(1)));
      if (await file.exists()) {
        return new Response(file);
      }
    }

    // SSR Route
    const isFile = pathname.includes(".");
    if (!isFile || pathname.endsWith(".html")) {
      try {
        getHtmlTemplate();

        return await serverContext.run({ req }, async () => {
          const { stream, dehydratedStateScript, headContext } = await render(req);
          const stateScript = `<script>${dehydratedStateScript}</script>`;
          const dynamicHead = headContext ? renderHeadToString(headContext) : "";

          const responseStream = new ReadableStream({
            async start(controller) {
              const currentHtmlStart = htmlStart?.replace('</head>', `${dynamicHead}${twLink}${bundleLink}${themeScript}</head>`);
              controller.enqueue(new TextEncoder().encode(currentHtmlStart + stateScript + '<div id="root">'));
              const reader = stream.getReader();
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                controller.enqueue(value);
              }
              const modifiedHtmlEnd = htmlEnd?.replace('./frontend.tsx', '/frontend.js')
                .replace('</body>', `${liveReloadScript}</body>`);
              controller.enqueue(new TextEncoder().encode('</div>' + modifiedHtmlEnd));
              controller.close();
            }
          });
          return new Response(responseStream, { headers: { "Content-Type": "text/html" } });
        });
      } catch (e) {
        if (e instanceof Response) return e;
        console.error("SSR Error:", e);
        return new Response("Internal Error", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) { ws.subscribe("reload"); },
    message(ws, message) { },
  },
  development: process.env.NODE_ENV !== "production"
});

console.log(`🚀 Server running at ${server.url}`);
