export enum methods {
  get = "get",
  post = "post",
  put = "put",
  delete = "delete",
  patch = "patch",
}

export type endpointType = {
  url: string;
  method: methods;
  baseURL?: string;
  withCredentials?: boolean;
};

export const endpoints = {
  LOGIN: {
    url: "/v1/login",
    method: methods.post,
  },
  REGISTER: {
    url: "/v1/register",
    method: methods.post,
  },
  INSERTCUSTOMER: {
    url: "/v1/insertCustomer",
    method: methods.post
  },
  GETCUSTOMER: {
    url: "/v1/getCustomer",
    method: methods.get
  },
  WEBHOOK_RECIVE_MSG: {
    url: "/v1/webhooks",
    method: methods.post
  },
  GETCHAT: {
    url: "/v1/getchat",
    method: methods.get
  },
  SENDMSG: {
    url: "/v1/sendMessage",
    method: methods.post
  },
  GETMESSAGE: {
    url: "/v1/getmessage",
    method: methods.get
  },
  //create new contact abt the customer
  CREATECONTACT:
  {
    url: "/v1/insertCustomer",
    method: methods.post
  },
  //list for show the all customer dt in talbe
  CONTACTLIST:
  {
    url: "/v1/getCustomer",
    method: methods.post
  },
  //to get coustomer chat dt
  CHATDATA:
  {
    url: "/v1/getchat",
    method: methods.get
  },
  CHATHISTORY: {
    url: "/v1/getMessageHistory",
    method: methods.get
  },
  SENDMESSAGE: {
    url: "/v1/sendMessage",
    method: methods.post
  },
  CREATEAGENT: {
    url: "/v1/createAgent",
    method: methods.post
  },
  AGENTLIST: {
    url: "/v1/getAgents",
    method: methods.get
  },
  //role
  CREATEROLE: {
    url: "/v1/createRole", method: methods.post
  },
  GETROLE: {
    url: "/v1/getRoles", method: methods.get
  },
  UPDATEROLE: {
    url: "/v1/updateRole", method: methods.put
  },
  ASSIGNAGENT: {
    url: "/v1/assignAgent", method: methods.post
  }
  ,
  TEMPLATE: {
    url: "/v1/templates", method: methods.get
  }
  ,
SYNCTEMPLATE: {
  url: "/v1/templates/", method: methods.get  // 👈 trailing slash, id comes from path
}
  ,
  CREATETEMPLATE: {
    url: "/v1/createTemplate", method: methods.post
  }
  ,
  SENDTEMPLATEMESSAGE: {
    url: "/v1/sendTemplateMessage", method: methods.post
  }
  //screen master
  ,
  GETSCREEN: {
    url: "/v1/getScreens", method: methods.get
  },
   CREATESCREEN: {
    url: "/v1/importScreen", method: methods.post
  },

} as const;

export type endpointsType = keyof typeof endpoints;
