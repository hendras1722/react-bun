import { serve, plugin } from "bun";
import { render } from "./entry-server.tsx";
import { readFileSync } from "fs";

// 1. Plugin to normalize asset imports in the SERVER runtime
plugin({
  name: "ssr-assets",
  setup(build) {
    build.onLoad({ filter: /\.(svg|png|jpg|jpeg|gif|webp)$/ }, (args) => {
      const fileName = args.path.split("/").pop();
      return {
        contents: `export default "/assets/${fileName}";`,
        loader: "js",
      };
    });
  },
});

console.log("🚀 Building client bundle...");
const clientBuild = await Bun.build({
  entrypoints: ["./src/frontend.tsx"],
  target: "browser",
  sourcemap: "inline",
  minify: process.env.NODE_ENV === "production",
  publicPath: "/", // CRITICAL: Makes asset paths root-relative (e.g. /assets/logo.svg)
  naming: {
    asset: "assets/[name].[ext]",
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

const indexHtml = readFileSync("./src/index.html", "utf-8");
const splitPoint = '<div id="root"></div>';
let [htmlStart, htmlEnd] = indexHtml.split(splitPoint);

if (buildOutputs.has("/frontend.css")) {
  htmlStart = htmlStart?.replace('</head>', '<link rel="stylesheet" href="/frontend.css" /></head>');
}

const server = serve({
  port: 3000,
  async fetch(req, server) {
    if (server.upgrade(req)) return;

    const url = new URL(req.url);

    // Serve build outputs
    if (buildOutputs.has(url.pathname)) {
      const blob = buildOutputs.get(url.pathname)!;
      let contentType = blob.type;
      if (url.pathname.endsWith(".svg")) contentType = "image/svg+xml";
      if (url.pathname.endsWith(".js")) contentType = "application/javascript";
      if (url.pathname.endsWith(".css")) contentType = "text/css";

      return new Response(blob, { headers: { "Content-Type": contentType } });
    }

    // SSR Route
    const isFile = url.pathname.includes(".");
    if (!isFile || url.pathname.endsWith(".html")) {
      try {
        const stream = await render(req);
        const responseStream = new ReadableStream({
          async start(controller) {
            controller.enqueue(new TextEncoder().encode(htmlStart + '<div id="root">'));
            const reader = stream.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
            const modifiedHtmlEnd = htmlEnd?.replace('./frontend.tsx', '/frontend.js');
            controller.enqueue(new TextEncoder().encode('</div>' + modifiedHtmlEnd));
            controller.close();
          }
        });
        return new Response(responseStream, { headers: { "Content-Type": "text/html" } });
      } catch (e) {
        if (e instanceof Response) return e;
        console.error("SSR Error:", e);
        return new Response("Internal Error", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    message(ws, message) { },
  },
  development: process.env.NODE_ENV !== "production"
});

console.log(`🚀 Server running at ${server.url}`);
