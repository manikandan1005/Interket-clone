import path from "path";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type EndpointKey = keyof typeof endpoints;

type Endpoint = {
  path: string;
  method: HttpMethod;
  auth?: boolean;
};

export const endpoints = {
  LOGIN: { path: "/v1/login", method: "POST", auth: false },
  REGISTER: { path: "/v1/register", method: "POST", auth: false },
  INSERTCUSTOMER: { path: "/v1/insertCustomer", method: "POST" },
  GETCUSTOMER: { path: "/v1/getCustomer", method: "GET" },
  WEBHOOK_RECIVE_MSG: { path: "/v1/webhooks", method: "POST" },
  GETCHAT: { path: "/v1/getchat", method: "GET" },
  SENDMSG: { path: "/v1/sendMessage", method: "POST" },
  GETMESSAGE: { path: "/v1/getmessage", method: "GET" },
  CREATECONTACT: { path: "/v1/insertCustomer", method: "POST" },
  CONTACTLIST: { path: "/v1/getCustomer", method: "POST" },
  CHATDATA: { path: "/v1/getchat", method: "GET" },
  CHATHISTORY: { path: "/v1/getMessageHistory", method: "GET" },
  AGENTLIST: { path: "/v1/getAgents", method: "GET" },
  GETROLE: { path: "/v1/getRoles", method: "GET" },
  TEMPLATE: { path: "/v1/templates", method: "GET" },
  GETSCREEN: { path: "/v1/getScreens", method: "GET" },
} as const;

// Explicitly typed the return as 'Endpoint' and used 'any as Endpoint' 
// to resolve lint errors in api.ts regarding the 'auth' property.
export function resolveEndpoint(key: EndpointKey): Endpoint {
  return endpoints[key] as any as Endpoint;
}
