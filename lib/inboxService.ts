import type { FiltersState } from "@/lib/types";
import { applyFilters, sortChats } from "@/lib/utils";
import { useInboxStore } from "@/lib/store";


export let selectedctid: string | null = null;

export function setSelectedCtid(id: string | null) {
  selectedctid = id;
}

export interface ChatIdsPage {
  ids: string[];
  nextCursor: number | null;
}

export async function fetchChatIdsPage(args: {
  filters: FiltersState;
  cursor: number;
  pageSize: number;
}): Promise<ChatIdsPage> {
  const { filters, cursor, pageSize } = args;

  // Simulate network latency.
  await new Promise((r) => setTimeout(r, 180));

  const { chats } = useInboxStore.getState();
  //console.log("chats :", chats)
  const filtered = applyFilters(chats, filters);
  const sorted = sortChats(
    filtered,
    filters.sort.field,
    filters.sort.direction,
  );
  const start = cursor;
  const end = cursor + pageSize;
  const page = sorted.slice(start, end).map((c) => c.id);

  return {
    ids: page,
    nextCursor: end < sorted.length ? end : null,
  };
}

