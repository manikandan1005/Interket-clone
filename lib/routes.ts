export const routes = {
  login: "/login",
  register: "/register",
  inbox: "/inbox",
} as const;

export type RouteKey = keyof typeof routes;

export function getRoute(key: RouteKey) {
  return routes[key];
}
