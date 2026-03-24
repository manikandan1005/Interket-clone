import { AUTH_COOKIE_KEY } from "@/lib/config";
import { setCookie, deleteCookie } from "@/lib/cookies";
import { callApi } from "@/lib/api";

export type LoginPayload = { email: string; password: string };

export async function login(payload: LoginPayload) {
  const data = await callApi<unknown>("LOGIN", payload);
  const value = typeof data === "string" ? data : JSON.stringify(data ?? "");
  setCookie(AUTH_COOKIE_KEY, value);
  return data;
}

export async function register(payload: any) {
  return callApi<unknown>("REGISTER", payload);
}

export function logout() {
  deleteCookie(AUTH_COOKIE_KEY);
}
