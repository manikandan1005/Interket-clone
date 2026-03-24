"use client";

import { Avatar, Badge, Box, Button, Flex, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { Menu } from "@chakra-ui/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useInboxStore } from "@/lib/store";
import MessageBubble from "@/app/inbox/MessageBubble";
import Composer from "@/app/inbox/Composer";
import CustomerCard from "@/app/inbox/CustomerCard";

export default function ChatDetail() {
  const selectedChatId = useInboxStore((s) => s.selectedChatId);
  const chat = useInboxStore((s) =>
    selectedChatId ? s.chats.find((c) => c.id === selectedChatId) : undefined,
  );
  console.log("chat from chatdetials:",chat)
  const team = useInboxStore((s) => s.team);
  const typing = useInboxStore((s) =>
    selectedChatId ? Boolean(s.typingByChatId[selectedChatId]) : false,
  );
  console.log("chat from chatdetials: ", chat)

  const { clearSelection, assignChat, toggleClosed, setStatus } = useInboxStore(
    (s) => s.actions,
  );

  const assigneeLabel = useMemo(() => {
    if (!chat?.assignee) return "Unassigned";
    return chat.assignee.name;
  }, [chat?.assignee]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length, typing]);

  if (!chat) {
    return (
      <Flex height="100%" align="center" justify="center">
        <Box textAlign="center" px="6">
          <Text fontWeight="700" fontSize="lg">
            Select a chat
          </Text>
          <Text color="muted" fontSize="sm">
            Choose a conversation to view messages and reply.
          </Text>
        </Box>
      </Flex>
    );
  }

  console.log("ChatDetail - messages length:", chat.messages.length);
  return (
    <Flex direction="column" height="100%">
      <HStack
        px="4"
        py="3"
        borderBottomWidth="1px"
        bg="panel"
        justify="space-between"
      >
        <HStack gap="3" minW="0">
          <Box display={{ base: "block", md: "none" }}>
            <IconButton
              aria-label="Back to chat list"
              size="sm"
              variant="outline"
              onClick={clearSelection}
            >
              <ArrowLeft size={16} />
            </IconButton>
          </Box>
          <Avatar.Root>
            <Avatar.Fallback name={chat.contact.name} />
            {chat.contact.avatar && <Avatar.Image src={chat.contact.avatar} alt={chat.contact.name} />}
          </Avatar.Root>
          <Box minW="0">
            <Text fontWeight="700" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {chat.contact.name}{" "}
              <Text as="span" fontWeight="500" color="muted">
                ({chat.contact.phone})
              </Text>
            </Text>
            <HStack gap="2">
              <Badge variant="subtle">{chat.channel}</Badge>
              <Badge
                colorPalette={
                  chat.status === "Open"
                    ? "brand"
                    : chat.status === "Resolved"
                      ? "green"
                      : "gray"
                }
                variant="subtle"
              >
                {chat.status}
              </Badge>
              {typing && (
                <Text fontSize="xs" color="muted">
                  typing…
                </Text>
              )}
            </HStack>
          </Box>
        </HStack>

        <HStack gap="2">
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button size="sm" variant="outline" aria-label="Assign chat">
                {assigneeLabel} <ChevronDownIcon />
              </Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="Unassigned" onClick={() => assignChat(chat.id, "Unassigned")}>
                  Unassigned
                </Menu.Item>
                <Menu.Separator />
                {team.map((m) => (
                  <Menu.Item key={m.id} value={m.id} onClick={() => assignChat(chat.id, m.id)}>
                    {m.name}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton aria-label="Change status" variant="outline" size="sm">
                {chat.status === "Resolved" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}
              </IconButton>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="Open" onClick={() => setStatus(chat.id, "Open")}>
                  Open
                </Menu.Item>
                <Menu.Item value="Closed" onClick={() => setStatus(chat.id, "Closed")}>
                  Closed
                </Menu.Item>
                <Menu.Item value="Resolved" onClick={() => setStatus(chat.id, "Resolved")}>
                  Resolved
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          <IconButton
            aria-label={chat.status === "Closed" ? "Reopen chat" : "Close chat"}
            variant="outline"
            size="sm"
            onClick={() => toggleClosed(chat.id)}
          >
            <XCircle size={16} />
          </IconButton>
        </HStack>
      </HStack>

      <Box flex="1" minH="0" overflow="auto">
        <Box p="4">
          <CustomerCard chatId={chat.id} />
        </Box>

        <Stack px="4" pb="6" gap="3">
          {chat.messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {typing && (
            <Box maxW="70%">
              <Box
                bg="gray.100"
                _dark={{ bg: "gray.800" }}
                borderRadius="lg"
                px="3"
                py="2"
              >
                <Text fontSize="sm" color="muted">
                  Typing…
                </Text>
              </Box>
            </Box>
          )}
          <Box ref={bottomRef} />
        </Stack>
      </Box>

      <Box borderTopWidth="1px" bg="panel">
        <Composer chatId={chat.id} />
      </Box>
    </Flex>
  );
}

