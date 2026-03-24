import { create } from "zustand";
import { MdOutlineDashboard } from "react-icons/md";
import { MdSupervisedUserCircle } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { FaPeopleArrows } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { IoIosContacts } from "react-icons/io";
import { callApi } from "./api";
import { FaRobot } from "react-icons/fa6";
import { MdOutlineScreenSearchDesktop } from "react-icons/md";

export type MenuItem = {
  label: string;
  path?: string;
  icon: any;
  screenName: string;
  children?: MenuItem[];
};

export type Template = {
  id: string;
  name: string;
  category: string;
  language: string;
  status: string;
  headerType: string | null;
  headerText: string | null;
  headerHandle: string | null;
  footer: string | null;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  contactBy: string;
  variableCount: number | null;
  buttons: {
    id: string;
    type: string;
    text: string;
    value: string;
    templateId: string;
  }[];
  approval: {
    id: string;
    templateId: string;
    meta_template_id: string | null;
    status: string;
    rejection_reason: string | null;
    updated_at: string;
  } | null;
};

export type Permission = {
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
};


export type ScreenData = {
  id: string;
  name: string;
  description: string;
  priority: number;
  permissions: Permission;
  status?:boolean
};

const menu: MenuItem[] = [
  { screenName: "Inbox", icon: BsChatDots, label: "Inbox", path: "/inbox/chat" },
  { screenName: "Contact", icon: IoIosContacts, label: "Contact", path: "/inbox/contact-list" },
  { screenName: "Template", icon: MdOutlineDashboard, label: "Template", path: "/inbox/template" },
  {
    screenName: "Role Mapping Parent",
    icon: MdSupervisedUserCircle,
    label: "User Management",
    children: [
      { screenName: "Role Mapping", icon: FaPeopleArrows, label: "Role Mapping", path: "/inbox/role-mapping" },
      { screenName: "ScreenMaster", icon: MdOutlineScreenSearchDesktop, label: "Screen Master", path: "/inbox/screen-master" },
      { screenName: "AgentSetting", icon: CiSettings, label: "Agent Setting", path: "/inbox/agent-setting" },
    ],
  },
  { screenName: "Type bot", icon: FaRobot, label: "Type Bot", path: "/inbox/typr-bot" },
];

type LoginStore = {
  //share agent list to chat customer info
  agents: any[];
  screenmaster: ScreenData[];
  //side bar based on role based screen 
  fetchMenu: () => MenuItem[];
  fetchAgent: () => Promise<void>;
  //role update 
  getRoleData:any[]
  getRoleForUpdate:(data:any)=>void;
  //scree master data
  getScreeMaster: () => Promise<ScreenData[]>;
  selectedScreenId: string | null;
  setSelectedScreenId: (id: string) => void;
  //template data
  templates: Template[];
  approvedTemplates: Template[];
  fetchTemplates: () => Promise<void>;
  //mock data for temp
  dummyTempId: number;
  setDummyTempId: (id: number) => void;
};

export const useLogin = create<LoginStore>((set, get) => ({
  agents: [],getRoleData:[],
  dummyTempId: 1,
  setDummyTempId: (id: number) => {
    set({ dummyTempId: id });
  },
  selectedScreenId: null,
  screenmaster: [],

  fetchMenu: () => {
    return menu;
  },
getRoleForUpdate:(data:any)=>{
  console.log(data)
},
  getScreeMaster: async () => {
    try {
      const res = await callApi<any>("GETSCREEN");
      const data: ScreenData[] = res.screens || [];
      set({ screenmaster: data });
      console.log("screen data ====",data)
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  setSelectedScreenId: (id: string) => {
    set({ selectedScreenId: id });
  },

  fetchAgent: async () => {
    try {
      const res = await callApi<any>("AGENTLIST");
      const agentList: any = (res || []).map((item: any) => ({
        name: item.firstName + " " + item.lastName,
        id: item.id,
      }));
      set({ agents: agentList });
    } catch (error) {
      console.log(error);
    }
  },

  templates: [],
  approvedTemplates: [],
  fetchTemplates: async () => {
    try {
      const res = await callApi<any>("TEMPLATE");
      const data: Template[] = (res?.templates || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        language: item.language || "en",
        status: item.status,
        headerType: item.headerType ?? null,
        headerText: item.headerText ?? null,
        headerHandle: item.headerHandle ?? null,
        footer: item.footer ?? null,
        content: item.content,
        createdBy: item.createdBy,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        contactBy: item.contactBy,
        variableCount: item.variableCount ?? null,
        buttons: item.buttons || [],
        approval: item.approval ?? null,
      }));
      const approvedTemplates = data.filter((i) => i.status === "APPROVED");
      set({ templates: data, approvedTemplates });
    } catch (error) {
      console.log(error);
    }
  },
}));