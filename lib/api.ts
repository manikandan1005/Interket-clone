import { API_BASE_URL, AUTH_COOKIE_KEY } from "@/lib/config";
import { getCookie } from "@/lib/cookies";
import { resolveEndpoint, type EndpointKey } from "@/lib/endpoints";

type Json = Record<string, unknown> | undefined;

type ApiError = Error & { status: number; data: unknown };

export async function callApi<T = unknown>(key: EndpointKey, payload?: Json, init?: RequestInit & { path?: string }): Promise<T> {
  const ep = resolveEndpoint(key);
  const base = API_BASE_URL;
  if (!base) throw new Error("Missing API base URL");

  // Added support for a 'path' suffix in 'init' to allow for dynamic URLs 
  // like /v1/getMessageHistory/${chatId} without modifying the base endpoint.
  const pathSuffix = init?.path || "";
  const url = new URL(ep.path + pathSuffix, base).toString();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (ep.auth !== false) {
    const token = getCookie(AUTH_COOKIE_KEY || "");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const finalUrl = url;
  const body: BodyInit | undefined = payload ? JSON.stringify(payload) : undefined;

  const res = await fetch(finalUrl, {
    method: ep.method,
    headers,
    body,
    ...init,
  });

  console.log(`[API] ${ep.method} ${finalUrl} - Status: ${res.status}`);

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    console.error(`[API Error] ${finalUrl}`, data);
    const e = new Error("Request failed") as ApiError;
    e.status = res.status;
    e.data = data;
    throw e;
  }

  return data as T;
}
