"use client";
import React, { useState } from 'react'
import { LuSearch } from "react-icons/lu"
import { Box, InputGroup, Input, Flex, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { fetchChatIdsPage } from "@/lib/inboxService";
import { useInboxStore } from "@/lib/store";
import ChatCard from "@/app/inbox/ChatCard";
import { FaSearchPlus } from "react-icons/fa";

const PAGE_SIZE = 12;

export default function ChatList() {
  const filters = useInboxStore((s) => s.filters);
  const selectedChatId = useInboxStore((s) => s.selectedChatId);
  const selectChat = useInboxStore((s) => s.actions.selectChat);
  const chats = useInboxStore((s) => s.chats);

  //console.log("data from api", chats)

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const query = useInfiniteQuery({
    queryKey: ["chatIds", filtersKey, chats.length],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchChatIdsPage({ filters, cursor: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

  const ids = query.data?.pages.flatMap((p) => p.ids) ?? [];
  const countText = `${ids.length}/${chats.length}`;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
          }
        }
      },
      { root: el.parentElement, rootMargin: "240px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [query]);

  function focusMove(delta: number) {
    if (ids.length === 0) return;
    const idx = selectedChatId ? ids.indexOf(selectedChatId) : -1;
    const next = idx === -1 ? 0 : Math.max(0, Math.min(ids.length - 1, idx + delta));
    selectChat(ids[next]!);
  }

  const [search, setSearc] = useState<string>("");
  async function searchContact(text: string) {
    let search = text.toLowerCase();
    console.log(search)

  }

  return (
    <Flex direction="column" height="100%">

      <HStack
        justify="space-between"
        px="4"
        py="3"
        borderBottomWidth="1px"
        bg="panel"
      >
        <Text fontWeight="600">Chats</Text>
        <Text fontSize="sm" color="muted">
          {countText}
        </Text>
        {/* <Flex align="center" justify="center" gap="5px">
          <FaSearchPlus  />
          <Text fontSize="sm" color="muted">
            {countText}
          </Text>
        </Flex> */}
      </HStack>

      <Box
        role="listbox"
        aria-label="Chat list"
        tabIndex={0}
        outline="none"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            focusMove(1);
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            focusMove(-1);
          }
          if (e.key === "Enter" && selectedChatId) {
            e.preventDefault();
            selectChat(selectedChatId);
          }
        }}
        overflow="auto"
        flex="1"
        minH="0"
      >
        <InputGroup flex="1" startElement={<LuSearch />} >
          <Input onChange={(event) => {
            const text = event?.target.value;
            searchContact(text)
          }} placeholder="Search contacts" />
        </InputGroup>

        {query.isLoading ? (
          <Stack p="4" gap="3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} height="86px" borderRadius="md" />
            ))}
          </Stack>
        ) : ids.length === 0 ? (
          <Box p="6">
            <Text fontWeight="600">No chats found</Text>
            <Text color="muted" fontSize="sm">
              Try adjusting your filters.
            </Text>
          </Box>
        ) : (
          <Stack p="2" gap="2">
            {ids.map((id) => (
              <ChatCard key={id} chatId={id} />
            ))}

            <Box ref={sentinelRef} h="1px" />

            {query.isFetchingNextPage && (
              <Box px="2" pb="4">
                <Skeleton height="86px" borderRadius="md" />
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Flex>
  );
}
