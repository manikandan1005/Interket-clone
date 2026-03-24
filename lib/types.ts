export type Channel = "WhatsApp" | "Instagram" | "Facebook";

export type ChatStatus = "Open" | "Closed" | "Resolved";

// Added 'audio' and 'sticker' types to match the user's API responses.
export type MessageType = "text" | "image" | "document" | "audio" | "sticker" | "video" | "template";

export type MessageSender = "customer" | "agent";

export type MessageDeliveryStatus = "sent" | "delivered" | "read";

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface CustomerOrder {
  id: string;
  total: number;
  createdAt: string; // ISO
  status: "paid" | "shipped" | "delivered" | "cancelled";
}

export interface CustomerProfile {
  orders: CustomerOrder[];
  totalSpend: number;
  lifetimeValue: number;
}

export interface Message {
  id: string;
  chatId: string;
  text?: string;
  type: MessageType;
  sender: MessageSender;
  time: string; // ISO
  status?: MessageDeliveryStatus;
  fileUrl?: string;
  fileName?: string;
  message:any;
}

export interface Chat {
  id: string;
  contact: { name: string; phone: string; avatar?: string };
  channel: Channel;
  status: ChatStatus;
  assignee?: TeamMember;
  labels: string[];
  tags: string[];
  unread: number;
  lastActivity: string; // ISO
  lastMessage: { text: string; time: string; isMine: boolean };
  messages: Message[];
  profile?: CustomerProfile;
}

// Root or Main Response
export interface CustomerResponse {
  customer: Customer[];
  count: number;
}

// Customer Object
export interface Customer {
  id: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  last_message: string;
  status: boolean;
  customerinfo: CustomerInfo;
}

// Customer Info Object
export interface CustomerInfo {
  id: string;
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
  ContactDealValue: string | null;
  AppointmentTime: string | null;
  userId: string;
}

export type SortField = "lastActivity" | "name" | "status" | "assignee";
export type SortDirection = "asc" | "desc";

export interface FiltersState {
  search: string;
  status: ChatStatus | "All";
  channels: Channel[];
  assigneeId: string | "All" | "Unassigned";
  labels: string[];
  tags: string[];
  sort: { field: SortField; direction: SortDirection };
}

// Added MessageResponse and RawMessage interfaces to correctly type the API's JSON output.
export interface MessageResponse {
  messages: RawMessage[];
  count: number;
}

export interface RawMessage {
  id: string;
  chatId: string;
  message: string;
  direction: "inbound" | "outbound";
  createdAt: string;
  message_type: "text" | "image" | "audio" | "document" | "sticker" | "template";
}
