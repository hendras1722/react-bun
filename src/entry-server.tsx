import { renderToReadableStream } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { getRouterConfig } from "./router";

export async function render(request: Request) {
  const routes = getRouterConfig();
  const handler = createStaticHandler(routes);
  const fetchRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
  });
  
  const context = await handler.query(fetchRequest);

  // If the handler returned a redirect response, we should throw it so the server can handle it
  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  return await renderToReadableStream(
    <StaticRouterProvider router={router} context={context} />
  );
}
