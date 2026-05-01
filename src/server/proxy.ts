import type { BunRequest } from "bun";
import { ofetch } from "ofetch";

export async function handleProxyRequest(req: BunRequest<'/api/*'>) {
  const API_URL = process.env.API_URL ?? "https://jsonplaceholder.typicode.com"
  const url = new URL(req.url);
  const apiPath = url.pathname.replace(/^\/api\//, "");
  const targetUrl = `${API_URL}/${apiPath}`;
  const query = Object.fromEntries(url.searchParams.entries());

  const newHeaders = new Headers(req.headers);
  newHeaders.delete("host");


  try {
    const response = await ofetch.raw(targetUrl, {
      method: req.method,
      headers: newHeaders,
      query,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.blob() : undefined,
      ignoreResponseError: true,
    });

    const resHeaders = new Headers(response.headers);
    resHeaders.delete("content-encoding");
    resHeaders.delete("content-length");

    resHeaders.set("Access-Control-Allow-Origin", "*");

    const data = typeof response._data === "object"
      ? JSON.stringify(response._data)
      : response._data;

    return new Response(data, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Proxy Error", message: String(error) }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
}
