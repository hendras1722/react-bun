import { isValidURL } from "@/utils/helpers";
import { ofetch, type FetchOptions } from "ofetch";

type HTTPMethod = 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE';

export interface RequestOptions extends Omit<FetchOptions, 'headers' | 'method' | 'body' | 'query'> {
  headers?: HeadersInit;
  method?: Readonly<HTTPMethod | Lowercase<HTTPMethod>>;
  body?: Record<string, any>;
  query?: Record<string, any>;
}

/**
 * useRequest is an async helper that works on both server and client.
 * For SSR, it should be called inside getServerSide() / loader.
 */
export async function useRequest<T>(baseUrl: string, options: RequestOptions = {}) {
  const API_URL = Bun.env.BUN_PUBLIC_API_URL;

  const instance = ofetch.create({
    baseURL: isValidURL(API_URL ?? '') ? API_URL : undefined,
    method: 'GET',
    timeout: 30000,
    retry: false,
    async onRequest({ options }) {
      if (typeof window === "undefined") {
        try {
          const { serverContext } = await import("@/server/context");
          const store = serverContext.getStore();
          if (store && store.req) {
            const cookie = store.req.headers.get("cookie");
            if (cookie) {
              options.headers = new Headers(options.headers || {});
              options.headers.set("cookie", cookie);
            }
          }
        } catch (e) { }
      }
    },
    async onResponseError({ response }) {
      if (response?.status === 409) {
        return;
      }
    },
  });

  const response = await instance.raw(baseUrl, options);

  return {
    raw: response,
    res: response._data as T
  };
}