import type { Chat, FiltersState, SortDirection, SortField } from "@/lib/types";
import { format } from "date-fns";

export function formatShortTime(isoTime: string) {
  try {
    return format(new Date(isoTime), "HH:mm");
  } catch {
    return "";
  }
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function toggleDirection(direction: SortDirection): SortDirection {
  return direction === "asc" ? "desc" : "asc";
}

export function matchesSearch(chat: Chat, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    chat.contact.name.toLowerCase().includes(q) ||
    chat.contact.phone.toLowerCase().includes(q) ||
    chat.lastMessage.text.toLowerCase().includes(q) ||
    chat.labels.some((l) => l.toLowerCase().includes(q)) ||
    chat.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function applyFilters(chats: Chat[], filters: FiltersState) {
  return chats.filter((c) => {
    if (filters.status !== "All" && c.status !== filters.status) return false;
    if (filters.channels.length > 0 && !filters.channels.includes(c.channel))
      return false;
    if (filters.assigneeId === "Unassigned" && c.assignee) return false;
    if (
      filters.assigneeId !== "All" &&
      filters.assigneeId !== "Unassigned" &&
      c.assignee?.id !== filters.assigneeId
    )
      return false;
    if (filters.labels.length > 0) {
      for (const l of filters.labels) if (!c.labels.includes(l)) return false;
    }
    if (filters.tags.length > 0) {
      for (const t of filters.tags) if (!c.tags.includes(t)) return false;
    }
    if (!matchesSearch(c, filters.search)) return false;
    return true;
  });
}

export function sortChats(chats: Chat[], field: SortField, dir: SortDirection) {
  const mult = dir === "asc" ? 1 : -1;
  const sorted = [...chats].sort((a, b) => {
    if (field === "lastActivity") {
      return (
        mult *
        (new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime())
      );
    }
    if (field === "name") {
      return mult * a.contact.name.localeCompare(b.contact.name);
    }
    if (field === "status") {
      return mult * a.status.localeCompare(b.status);
    }
    // assignee
    const an = a.assignee?.name ?? "";
    const bn = b.assignee?.name ?? "";
    return mult * an.localeCompare(bn);
  });
  return sorted;
}

