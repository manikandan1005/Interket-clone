import type {
  Channel,
  Chat,
  ChatStatus,
  CustomerOrder,
  Message,
  TeamMember,
} from "@/lib/types";
// import useAxios from "./http/useAxios";
// import { methods } from "./http/endpoints";

function iso(date: Date) {
  return date.toISOString();
}

function minutesAgo(n: number) {
  return iso(new Date(Date.now() - n * 60_000));
}

function makeId(prefix: string, n: number) {
  return `${prefix}_${String(n).padStart(3, "0")}`;
}

const NAMES = [
  "John Doe",
  "Aarav Sharma",
  "Diya Patel",
  "Rohan Mehta",
  "Ananya Singh",
  "Kabir Verma",
  "Isha Kapoor",
  "Arjun Nair",
  "Meera Iyer",
  "Vihaan Gupta",
  "Saanvi Joshi",
  "Aditya Rao",
  "Nisha Kulkarni",
  "Rahul Jain",
  "Neha Bansal",
  "Karthik Reddy",
  "Pooja Chawla",
  "Aman Khanna",
  "Sneha Mukherjee",
  "Vikram Sethi",
  "Tanya Malhotra",
  "Pranav Das",
  "Ritika Arora",
  "Siddharth Bose",
  "Shruti Pillai",
];

const LABELS = ["Support", "Sales", "VIP"] as const;
const TAGS = ["High Priority", "Refund", "Billing", "Delivery", "VIP"] as const;

export const teamMembers: TeamMember[] = [
  { id: "me", name: "Me" },
  { id: "john", name: "John" },
  { id: "sarah", name: "Sarah" },
  { id: "team", name: "Team" },
];

export const quickReplies: string[] = [
  "Thanks for reaching out — checking this for you now.",
  "Could you please share your order ID?",
  "Sorry about that. We’re escalating this and will update you shortly.",
  "Can you confirm your phone number and delivery address?",
  "Resolved. Is there anything else I can help you with?",
];

function phoneFor(i: number) {
  const base = 9000000000 + i * 137_123;
  return `+91-${String(base).slice(0, 5)}-${String(base).slice(5, 10)}`;
}

function pick<T>(arr: readonly T[], idx: number) {
  return arr[idx % arr.length];
}

function sampleLabels(i: number): string[] {
  const out: string[] = [];
  if (i % 2 === 0) out.push("Support");
  if (i % 5 === 0) out.push("VIP");
  if (i % 3 === 0) out.push("Sales");
  return [...new Set(out)];
}

function sampleTags(i: number): string[] {
  const out: string[] = [];
  if (i % 4 === 0) out.push("High Priority");
  if (i % 5 === 0) out.push("VIP");
  if (i % 6 === 0) out.push("Delivery");
  return [...new Set(out)];
}

function sampleOrders(i: number): CustomerOrder[] {
  const count = 1 + (i % 5);
  const orders: CustomerOrder[] = [];
  for (let k = 0; k < count; k++) {
    const id = `#${1200 + i * 3 + k}`;
    const total = 499 + ((i + k) % 9) * 250;
    const createdAt = minutesAgo(60 * 24 * (2 + ((i + k) % 12)));
    const status = pick(
      ["paid", "shipped", "delivered", "cancelled"] as const,
      i + k,
    );
    orders.push({ id, total, createdAt, status });
  }
  return orders;
}

function makeMessages(i: number): Message[] {
  const chatId = makeId("chat", i);
  const t1 = minutesAgo(180 - i * 3);
  const t2 = minutesAgo(175 - i * 3);
  const t3 = minutesAgo(170 - i * 3);
  const base: Message[] = [
    {
      id: `${chatId}_m1`,
      type: "text",
      sender: "customer",
      time: t1,
      text: `Hi team, my order #${1200 + i} is delayed. Can you help?`,
    },
    {
      id: `${chatId}_m2`,
      type: "text",
      sender: "agent",
      time: t2,
      status: "delivered",
      text: "Sure — checking this for you right now.",
    },
  ];

  if (i % 7 === 0) {
    base.push({
      id: `${chatId}_m3`,
      type: "image",
      sender: "customer",
      time: t3,
      fileUrl: "/sample-issue.png",
      text: "Here’s the issue (photo).",
    });
  } else {
    base.push({
      id: `${chatId}_m3`,
      type: "text",
      sender: "customer",
      time: t3,
      text: "Also, can you confirm the expected delivery date?",
    });
  }

  return base;
}

function sampleStatus(i: number): ChatStatus {
  if (i % 11 === 0) return "Resolved";
  if (i % 9 === 0) return "Closed";
  return "Open";
}

function sampleChannel(i: number): Channel {
  return pick(["WhatsApp", "Instagram", "Facebook"] as const, i);
}

function sampleAssignee(i: number): TeamMember | undefined {
  if (i % 4 === 0) return undefined;
  return pick(teamMembers, i + 1);
}
// const [request] =useAxios({endpoint:"CHATDATA",hideErrorMsg:false})
//const [request] = useAxios<Datas>({ endpoint: 'CONTACTLIST', hideErrorMsg: false });
    
//  const getChart=async ()=>{
//   try{
//     const response=await request({method:"GET"})
//   }
//  }

export const mockChats: Chat[] = Array.from({ length: 25 }).map((_, idx) => {
  const i = idx + 1;
  const name = pick(NAMES, i);
  const phone = phoneFor(i);
  const messages = makeMessages(i);
  const last = messages[messages.length - 1]!;

  const orders = sampleOrders(i);
  const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);

  const unread = i % 6 === 0 ? 2 : i % 8 === 0 ? 5 : i % 5 === 0 ? 1 : 0;

  return {
    id: makeId("chat", i),
    contact: { name, phone },
    channel: sampleChannel(i),
    status: sampleStatus(i),
    assignee: sampleAssignee(i),
    labels: sampleLabels(i),
    tags: sampleTags(i),
    unread,
    lastActivity: last.time,
    lastMessage: { text: last.text ?? "", time: last.time, isMine: false },
    messages,
    profile: {
      orders,
      totalSpend,
      lifetimeValue: Math.round(totalSpend * 3.2),
    },
  };
});

