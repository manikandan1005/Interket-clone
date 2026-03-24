import { create } from "zustand";
import type { Chat, FiltersState, Message, TeamMember } from "@/lib/types";
import { quickReplies, teamMembers } from "@/lib/mockData";
import { callApi } from "./api";
import { CustomerResponse } from "@/lib/types";
import { setSelectedCtid } from "./inboxService";
import { string } from "zod";
import { IoHomeOutline, IoLogoBuffer } from "react-icons/io5";
import { IoIosContacts } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { TbReportSearch } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { FaPeopleArrows } from "react-icons/fa";
import {
  MdMenuOpen, MdOutlineDashboard
} from "react-icons/md";

const DEFAULT_FILTERS: FiltersState = {
  search: "",
  status: "All",
  channels: ["WhatsApp", "Instagram"],
  assigneeId: "All",
  labels: [],
  tags: [],
  sort: { field: "lastActivity", direction: "desc" },
};
// const menuItems: any[] = [
//   { icon: BsChatDots, label: "Inbox", path: "/inbox/chat" },
//   // { icon: IoIosContacts, label: "Contact", path: "/inbox/contact-list" },
//   { icon: MdOutlineDashboard, label: "Template", path: "/inbox/template" },
//   //{ icon: FaPeopleArrows, label: "Role Mapping", path: "/inbox/role-mapping" },
//   { icon: CiSettings, label: "Agent Setting", path: "/inbox/agent-setting" },
// ];

function upsertChat(chats: Chat[], updated: Chat) {
  const idx = chats.findIndex((c) => c.id === updated.id);
  if (idx === -1) return [updated, ...chats];
  const copy = [...chats];
  copy[idx] = updated;
  return copy;
}
export interface UserInfoType {
  id: string; 
  chatID: string;
  contactName: string;
  phoneNumber: string;
  countrycode: string;
  email: string;
  createdOn: string;
  updatedAt: string;
  whatsapp_opted: boolean;
  status: boolean | null;
  source: string;
  tags: string | null;
  ContactDealValue: string | null;   // ✅ string (matches API)
  AppointmentTime: string | null;    // ✅ string (matches API)
  userId: string;
  AccountOwner?:string;
  // filteredMenuItems:any[]
}
export interface InboxStore {
  chats: Chat[];
  userInfo: UserInfoType[];
  team: TeamMember[];
  quickReplies: string[];
  filters: FiltersState;
  selectedChatId: string | null;
  typingByChatId: Record<string, boolean>;
  agentRoles: string[];
  //filteredMenuItems: any[];

  actions: {
    init: () => void;
    setFilters: (partial: Partial<FiltersState>) => void;
    clearFilters: () => void;
    selectChat: (chatId: string) => void;
    clearSelection: () => void;
    //to gat all agents and agent list
    agentRole: () => Promise<void>;
    assignChat: (chatId: string, assigneeId: string | "Unassigned") => void;
    setStatus: (chatId: string, status: Chat["status"]) => void;
    toggleClosed: (chatId: string) => void;

    addLabel: (chatId: string, label: string) => void;
    removeLabel: (chatId: string, label: string) => void;
    addTag: (chatId: string, tag: string) => void;
    removeTag: (chatId: string, tag: string) => void;
    //use to send replay message to api via api
    sendMessage: (chatId: string, message: Omit<Message, "id" | "chatId">) => void;
    setTyping: (chatId: string, isTyping: boolean) => void;
    markRead: (chatId: string) => void;
    //use to store  get message from api
    fetchMessages: (chatId: string) => Promise<void>;
    //fetchMenuItems: () => Promise<void>;
  };
}
//for call every 15 secondes chat api
let intervalApiCallMessage: any = null;
// 
let intervalApiCallChat: any = null;

export const useInboxStore = create<InboxStore>((set, get) => ({
  chats: [],
  userInfo: [],
  team: teamMembers,
  quickReplies,
  filters: DEFAULT_FILTERS,
  selectedChatId: null,
  typingByChatId: {},
  agentRoles: [],
  filteredMenuItems: [],

  //get chat data from api
  actions: {
    init: async () => {
      // console.log("[Store] init() called");
      if (get().chats.length > 0) {
        // console.log("[Store] init() - Chats already loaded");
        return;
      }
      const chatLoader = async () => {
        try {
          const res = await callApi<CustomerResponse>("CHATDATA");
          //console.log("[Store] init() - Received response:", res);
          const customerList = res?.customer || [];
          const data: UserInfoType[] = customerList.map((user) => (
            {
              ...user?.customerinfo, chatID: user.id
            }
          ))
          //console.log(`[Store] init() - Mapping ${customerList.length} customers`);

          const mappedChats: Chat[] = customerList.map((c) => ({
            id: c.id,
            contact: {
              name: c.customerinfo?.contactName || c.customerPhone || "Unknown",
              phone: c.customerPhone,
            },
            channel: "WhatsApp", // Default
            status: c.status === false ? "Closed" : "Open",
            assignee: undefined,
            labels: [],
            tags: c.customerinfo?.tags ? c.customerinfo.tags.split(",").filter(Boolean) : [],
            unread: 0,
            messages: [], // Initialize empty, fetch on select
            lastActivity: c.updatedAt || c.createdAt,
            lastMessage: {
              text: c.last_message || "",
              time: c.updatedAt || c.createdAt,
              isMine: false,
            },
          }));

          //console.log("[Store] init() - Setting chats in state", mappedChats.length);
          set({ chats: mappedChats, userInfo: data });
          // set({})
        } catch (error) {
          // console.error("[Store] init() - Failed to load chats:", error);
          set({ chats: [], userInfo: [] });

        }
      };
      chatLoader()
      // await chatLoader();
      // if(intervalApiCallChat) clearInterval(intervalApiCallChat)
      //   intervalApiCallChat=setInterval(() => {
      //     chatLoader()
      //   }, 10000);


    },

    // fetchMenuItems: async () => {
    //   try {
    //     const res = await callApi<any>("LOGIN");
    //     console.log("mrnuitemmm", res);

    //     const permissions: any[] = res.roleInfo.permissions || [];
    //     const data = menuItems.filter((menu: any) => {
    //       const permission = permissions.find(
    //         (p: any) =>
    //           p.screenName.toLowerCase() === menu.label.toLowerCase() && p.screenStatus === true

    //       );
    //       return permission


    //     });
    //     set({ filteredMenuItems: data })
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },
    agentRole: async () => {
      try {
        const res = await callApi<any>("GETROLE");

        const roles: any = [
          ...new Set(
            (Array.isArray(res) ? res : [])
              .map((item: any) => item.name)
              .filter((name: string) => name && name.trim() !== "")
          ),
        ];

        set({ agentRoles: roles });

      } catch (error) {
        console.error(error);
      }
    },



    setFilters: (partial) =>
      set((s) => ({ filters: { ...s.filters, ...partial } })),

    clearFilters: () => set({ filters: DEFAULT_FILTERS }),

    selectChat: (chatId) => {
      set({ selectedChatId: chatId });
      const user = get().userInfo.find((u) => u.chatID === chatId);
      setSelectedCtid(user?.id || chatId);
      get().actions.markRead(chatId);
      get().actions.fetchMessages(chatId);
      //setinterval for fetchmessage to every 15 seconds
      if (intervalApiCallMessage) clearInterval(intervalApiCallMessage);
      intervalApiCallMessage = setInterval(() => {
        get().actions.fetchMessages(chatId)
      }, 3000);
    },

    clearSelection: () => {
      if (intervalApiCallMessage) {
        clearInterval(intervalApiCallMessage);
        intervalApiCallMessage = null;
      }
      setSelectedCtid(null);
      set({ selectedChatId: null })
    },

    assignChat: (chatId, assigneeId) => {
      const { chats, team } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      const assignee =
        assigneeId === "Unassigned"
          ? undefined
          : team.find((t) => t.id === assigneeId) ?? undefined;

      const updated: Chat = {
        ...chat,
        assignee,
        lastActivity: new Date().toISOString(),
      };
      set({ chats: upsertChat(chats, updated) });
    },

    setStatus: (chatId, status) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      const updated: Chat = {
        ...chat,
        status,
        lastActivity: new Date().toISOString(),
      };
      set({ chats: upsertChat(chats, updated) });
    },

    toggleClosed: (chatId) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      const updated: Chat = {
        ...chat,
        status: chat.status === "Closed" ? "Open" : "Closed",
        lastActivity: new Date().toISOString(),
      };
      set({ chats: upsertChat(chats, updated) });
    },

    addLabel: (chatId, label) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      if (chat.labels.includes(label)) return;
      const updated: Chat = {
        ...chat,
        labels: [...chat.labels, label],
        lastActivity: new Date().toISOString(),
      };
      set({ chats: upsertChat(chats, updated) });
    },

    removeLabel: (chatId, label) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      const updated: Chat = {
        ...chat,
        labels: chat.labels.filter((l) => l !== label),
        lastActivity: new Date().toISOString(),
      };
      set({ chats: upsertChat(chats, updated) });
    },

    addTag: (chatId, tag) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      if (chat.tags.includes(tag)) return;
      const updated: Chat = {
        ...chat,
        tags: [...chat.tags, tag],
        lastActivity: new Date().toISOString(),
      };
      set({ chats: upsertChat(chats, updated) });
    },

    removeTag: (chatId, tag) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      const updated: Chat = {
        ...chat,
        tags: chat.tags.filter((t) => t !== tag),
        lastActivity: new Date().toISOString(),
      };
      set({ chats: upsertChat(chats, updated) });
    },

    sendMessage: (chatId, message) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      const id = `${chatId}_m_${Math.random().toString(16).slice(2)}`;
      const msg: Message = { ...message, id, chatId };
      const messages = [...chat.messages, msg];
      const updated: Chat = {
        ...chat,
        messages,
        lastActivity: msg.time,
        lastMessage: {
          text: msg.text ?? (msg.type === "image" ? "Image" : "File"),
          time: msg.time,
          isMine: msg.sender === "agent",
        },
      };
      set({ chats: upsertChat(chats, updated) });
    },

    setTyping: (chatId, isTyping) =>
      set((s) => ({
        typingByChatId: { ...s.typingByChatId, [chatId]: isTyping },
      })),

    markRead: (chatId) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;
      if (chat.unread === 0) return;
      const updated: Chat = { ...chat, unread: 0 };
      set({ chats: upsertChat(chats, updated) });
    },
    // get chat message from api
    // Added fetchMessages to retrieve chat history from the API and map it to our UI Message type.
    fetchMessages: async (chatId) => {
      const { chats } = get();
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;

      try {
        // Corrected callApi arguments: 'undefined' for payload (GET request) 
        // and passed 'path' in the init object for dynamic URL generation.
        const res = await callApi<any>("CHATHISTORY", undefined, { path: `/${chatId}` });
        const rawMessages = res?.messages || [];

        const mappedMessages: Message[] = rawMessages.map((m: any) => {
          let parsedMessage = m.message;
          if (m.message_type === "template") {
            try {
              parsedMessage = JSON.parse(m.message);
            } catch (e) {
              // Not a JSON string, keep as is
            }
          }

          return {
            id: m.id,
            chatId: m.chatId || chatId,
            text: (m.message_type === "text" || m.message_type === "template") ? (typeof parsedMessage === 'string' ? parsedMessage : parsedMessage?.bodyText || parsedMessage?.bodyTex || "") : undefined,
            type: m.message_type === "document" ? "document" : m.message_type === "image" ? "image" : m.message_type === "video" ? "video" : m.message_type === "audio" ? "audio" : m.message_type === "template" ? "template" : "text",
            sender: m.direction === "outbound" ? "agent" : "customer",
            time: m.createdAt,
            fileUrl: (m.message_type !== "text" && m.message_type !== "template") ? m.message : (m.message_type === "template" ? parsedMessage?.headerHandle : undefined),
            fileName: m.message_type === "document" ? "File" : undefined,
            message: parsedMessage,
          };
        });

        const updated: Chat = { ...chat, messages: mappedMessages };
        set({ chats: upsertChat(chats, updated) });
      } catch (error) {
        console.error("[Store] fetchMessages() failed:", error);
      }
    },
  },
}));

