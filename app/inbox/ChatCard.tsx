"use client";

import { Avatar, Badge, Box, Button, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { Menu } from "@chakra-ui/react";
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Instagram, MessageCircle, Facebook } from "lucide-react";
import { useEffect,useState, useMemo } from "react";
import { useInboxStore } from "@/lib/store";
import { formatShortTime } from "@/lib/utils";
import type { Channel } from "@/lib/types";
import useAxios from "@/lib/http/useAxios";

// Root or Main Response
// export interface CustomerResponse {
//   customer: Customer[];
//   count: number;
// }

// // Customer Object
//  export interface Customer {
//   id: string;
//   customerPhone: string;
//   createdAt: string;
//   updatedAt: string;
//   userId: string;
//   last_message: string;
//   status: boolean;
//   customerinfo: CustomerInfo;
// }

// // Customer Info Object
// interface CustomerInfo {
//   id: string;
//   contactName: string;
//   phoneNumber: string;
//   countrycode: string;
//   email: string;
//   createdOn: string;
//   updatedAt: string;
//   whatsapp_opted: boolean;
//   status: boolean | null;
//   source: string;
//   tags: string | null;
//   ContactDealValue: number | null;
//   AppointmentTime: string | null;
//   userId: string;
// }

function ChannelIcon(props: { channel: Channel }) {
  const { channel } = props;
  if (channel === "Instagram") return <Instagram size={16} aria-label="Instagram" />;
  if (channel === "Facebook") return <Facebook size={16} aria-label="Facebook" />;
  return <MessageCircle size={16} aria-label="WhatsApp" />;
}

export default function ChatCard(props: { chatId: string }) {
  
  const { chatId } = props;
  //console.log("chatID:",chatId)
  const chat = useInboxStore((s) => s.chats.find((c) => c.id === chatId));
  //console.log("chat ",chat)
  const selectedChatId = useInboxStore((s) => s.selectedChatId);
  const team = useInboxStore((s) => s.team);
  const { selectChat, assignChat, toggleClosed } = useInboxStore((s) => s.actions);
//
  //  const [request,data,loading]=useAxios<CustomerResponse>({ endpoint: "CHATDATA", hideErrorMsg: false })
//  useEffect(()=>{
//    //console.log("data from api for caht box",data)
//  },[])
// const t=true;
// const[chats,setChats]=useState<Customer[]>([])
//   const getData=async ()=> {
//     try {
//       const res= await request({method:'GET'} )
//       setChats(res?.customer ||[])
//       //console.log(res?.customer)
//     }
//     catch(err){
//       //console.log(err)
//       alert(err)
//     }
//   }

//   useEffect(()=>{
//     getData()
//   },[t])

  const isSelected = selectedChatId === chatId;

  const assigneeLabel = useMemo(() => {
    if (!chat?.assignee) return "Unassigned";
    return chat.assignee.name;
  }, [chat?.assignee]);
 // useEffect(()=>console.log("if chatid change :?",selectChat),[chatId])
  
  if (!chat) return null;

  return (
    <Box 
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      borderWidth="1px"
      borderRadius="md"
      px="3"
      py="3"
      cursor="pointer"
      bg={isSelected ? "brand.50" : "canvas"}
      borderColor={isSelected ? "brand.300" : "border"}
      _hover={{ bg: isSelected ? "brand.50" : "gray.50" }}
      className="transition-colors"
      onClick={() => selectChat(chatId)}
    >
      <HStack justify="space-between" align="start" gap="3">
        <HStack align="start" gap="3" minW="0">
          <Avatar.Root>
            <Avatar.Fallback name={chat.contact.name} />
            {chat.contact.avatar && <Avatar.Image src={chat.contact.avatar} alt={chat.contact.name} />}
          </Avatar.Root>
          <Stack gap="0" minW="0">
            <HStack gap="2" align="center" minW="0">
              <Text fontWeight={chat.unread > 0 ? "700" : "600"} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {chat.contact.name}
              </Text>
              {chat.unread > 0 && (
                <Box
                  w="6px"
                  h="6px"
                  borderRadius="full"
                  bg="brand.500"
                  aria-label="Unread"
                />
              )}
            </HStack>
            <Text fontSize="xs" color="muted" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {chat.contact.phone}
            </Text>
          </Stack>
        </HStack>

        <Stack align="end" gap="1">
          <Text fontSize="xs" color="muted">
            {formatShortTime(chat.lastActivity)}
          </Text>
          {chat.unread > 0 && (
            <Badge
              colorPalette="brand"
              variant="solid"
              borderRadius="full"
              px="2"
              fontSize="xs"
            >
              {chat.unread}
            </Badge>
          )}
        </Stack>
      </HStack>

      <HStack justify="space-between" mt="2" gap="3">
        <Text fontSize="sm" color="muted" flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {chat.lastMessage.text}
        </Text>
        <Box color="muted">
          <ChannelIcon channel={chat.channel} />
        </Box>
      </HStack>

      <HStack justify="space-between" mt="3" gap="3">
        <HStack wrap="wrap" gap="1.5" minW="0">
          {chat.labels.slice(0, 2).map((l) => (
            <Badge key={l} variant="subtle" colorPalette={l === "VIP" ? "purple" : "gray"}>
              {l}
            </Badge>
          ))}
          {chat.labels.length > 2 && (
            <Badge variant="outline">+{chat.labels.length - 2}</Badge>
          )}
        </HStack>

        <HStack gap="2" className="opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                size="xs"
                variant="outline"
                aria-label="Assign chat"
              >
                {assigneeLabel} <ChevronDownIcon />
              </Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="Unassigned" onClick={() => assignChat(chatId, "Unassigned")}>
                  Unassigned
                </Menu.Item>
                <Menu.Separator />
                {team.map((m) => (
                  <Menu.Item key={m.id} value={m.id} onClick={() => assignChat(chatId, m.id)}>
                    {m.name}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          <IconButton
            size="xs"
            variant="outline"
            aria-label={chat.status === "Closed" ? "Reopen chat" : "Close chat"}
            onClick={(e) => {
              e.stopPropagation();
              toggleClosed(chatId);
            }}
          >
            <Cross2Icon />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}

