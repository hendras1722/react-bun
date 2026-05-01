import { serve, plugin, type BunRequest } from "bun";
console.log("🚀 Server starting...");
import { readFileSync, watch as fsWatch } from "fs";
import { join } from "path";
import { handleProxyRequest } from "./server/proxy";
import { renderHeadToString } from "./hooks/useSeoMeta";
import { serverContext } from "./server/context";

// ── Tailwind CSS ──────────────────────────────────────────────────────────────
const tailwindArgs = [
  "bunx", "@tailwindcss/cli",
  "-i", "./src/index.css",
  "-o", "./src/tailwind.css",
];

const tailwindFile = Bun.file(join(import.meta.dir, "tailwind.css"));
const tailwindExists = await tailwindFile.exists();

if (process.env.NODE_ENV !== "production" || !tailwindExists) {
  console.log("🎨 Building Tailwind CSS...");
  try {
    const twBuild = Bun.spawnSync(tailwindArgs, { stderr: "inherit" });
    if (twBuild.exitCode !== 0) {
      console.warn("⚠️  Tailwind build exited with code", twBuild.exitCode);
    }
  } catch (e) {
    console.error("❌ Failed to build Tailwind:", e);
  }
}

if (process.env.NODE_ENV !== "production") {
  Bun.spawn([...tailwindArgs, "--watch"], { stderr: "pipe", stdout: "pipe" });
  console.log("👀 Tailwind watching for changes...");
}
// ─────────────────────────────────────────────────────────────────────────────

// 1. Build Client Bundle
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

// 2. SSR assets plugin
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

// 3. Import server entry
const { render } = await import("./entry-server.tsx");
const { generate } = await import("../scripts/generate-routes");

// 4. Watcher (Dev only)
if (process.env.NODE_ENV !== "production") {
  const watchOptions = { recursive: true };
  const handleWatch = (event: string, filename: string | null) => {
    if (filename && (filename.endsWith(".tsx") || filename.endsWith(".jsx"))) {
      console.log(`File ${filename} changed (${event}), regenerating routes...`);
      generate();
      server?.publish("reload", "reload");
    }
  };
  fsWatch(join(process.cwd(), "src", "pages"), watchOptions, handleWatch);
  fsWatch(join(process.cwd(), "src", "layouts"), watchOptions, handleWatch);
}

let indexHtml = readFileSync(join(import.meta.dir, "index.html"), "utf-8");
const splitPoint = '<div id="root"></div>';
let [htmlStart, htmlEnd] = indexHtml.split(splitPoint);

function getHtmlTemplate() {
  if (process.env.NODE_ENV !== "production") {
    indexHtml = readFileSync(join(import.meta.dir, "index.html"), "utf-8");
    [htmlStart, htmlEnd] = indexHtml.split(splitPoint);
  }
}

const twLink = process.env.NODE_ENV !== "production" ? '<link rel="stylesheet" href="/tailwind.css" />' : '';
const bundleLink = buildOutputs.has("/frontend.css") ? '<link rel="stylesheet" href="/frontend.css" />' : (process.env.NODE_ENV === "production" ? '<link rel="stylesheet" href="/tailwind.css" />' : '');
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
          socket.onopen = () => { if (reconnecting) location.reload(); };
          socket.onmessage = (e) => { if (e.data === 'reload') location.reload(); };
          socket.onclose = () => { reconnecting = true; setTimeout(connect, 500); };
        }
        connect();
      })();
    </script>
  `;
}

let server: any;
server = serve({
  port: 3000,
  async fetch(req, server) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    
    if (process.env.NODE_ENV === "production") {
      console.log(`[SSR] Request: ${pathname}`);
    }

    // 1. WebSockets / Live Reload
    if (pathname === "/live-reload") {
      if (process.env.NODE_ENV !== "production" && server.upgrade(req)) return;
    }

    // 2. API Routes
    if (pathname.startsWith("/api/")) {
      return handleProxyRequest(req as any);
    }

    // 3. Build Outputs (JS, CSS, Assets)
    if (buildOutputs.has(pathname)) {
      const artifact = buildOutputs.get(pathname)!;
      return new Response(artifact, { headers: { "Content-Type": artifact.type } });
    }

    // 4. Known Static Assets fallback
    if (pathname === "/favicon.ico") return new Response(null, { status: 204 });
    if (pathname === "/tailwind.css") {
      const file = Bun.file(join(import.meta.dir, "tailwind.css"));
      if (await file.exists()) return new Response(file, { headers: { "Content-Type": "text/css" } });
    }

    // 5. Assets directory fallback
    if (pathname.startsWith("/assets/")) {
      const fileName = pathname.replace("/assets/", "");
      const file = Bun.file(join(import.meta.dir, fileName));
      if (await file.exists()) return new Response(file);
    }

    // 6. SSR for everything else that isn't a file
    const hasDot = pathname.includes(".");
    if (!hasDot || pathname.endsWith(".html")) {
      try {
        getHtmlTemplate();
        return await serverContext.run({ req }, async () => {
          const { html, headScript, injectedHtml, headContext } = await render(req);
          const dynamicHead = headContext ? renderHeadToString(headContext) : "";
          const headInjection = `${dynamicHead}${twLink}${bundleLink}${themeScript}${headScript}`;
          const fullHead = (htmlStart || '').replace(/<\/head>/i, headInjection + '</head>');
          const rootDiv = `<div id="root">${html}</div>`;
          const endSection = (htmlEnd || '')
            .replace('./frontend.tsx', '/frontend.js')
            .replace('</body>', `${injectedHtml}${liveReloadScript}</body>`);
          return new Response(fullHead + rootDiv + endSection, { headers: { "Content-Type": "text/html" } });
        });
      } catch (e) {
        if (e instanceof Response) return e;
        console.error("SSR Error:", e);
        return new Response("Internal Error", { status: 500 });
      }
    }

    // 7. Last resort: check if file exists on disk
    if (pathname.length > 1) {
      const file = Bun.file(join(import.meta.dir, pathname.slice(1)));
      if (await file.exists() && file.size > 0) return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) { ws.subscribe("reload"); },
    message() { },
  },
  development: process.env.NODE_ENV !== "production"
});

console.log(`🚀 Server running at ${server.url}`);
