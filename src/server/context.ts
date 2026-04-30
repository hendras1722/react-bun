import { AsyncLocalStorage } from "node:async_hooks";

export interface ServerContext {
  req: Request;
}

export const serverContext = new AsyncLocalStorage<ServerContext>();
