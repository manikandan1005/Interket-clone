"use client";
import React from 'react'
import ChatList from "@/app/inbox/ChatList";
import ChatDetail from "@/app/inbox/ChatDetail";
import { useInboxStore } from "@/lib/store";
import { Avatar,InputGroup,Input, Box, Button, Flex, HStack, IconButton, Menu, Text } from "@chakra-ui/react";
// import { Avatar, Box, Button, Flex, HStack, IconButton, Menu, Text } from "@chakra-ui/react";
import CustomerInfo from '../CustomerInfo';
import { LuSearch } from "react-icons/lu"


export default function chat() {
  const selectedChatId = useInboxStore((s) => s.selectedChatId);
  return (
    <div className='max-h-screen  overflow-hidden flex w-full'>

      <Box
        w={{ base: selectedChatId ? "0%" : "100%", md: "30%", lg: "20%" }}
        display={{ base: selectedChatId ? "none" : "block", md: "block" }}
        borderRightWidth={{ base: "0", md: "1px" }}
        bg="canvas"
        minW={{ md: "320px" }}
      >

        <Box>
          {/* <InputGroup flex="1" startElement={<LuSearch />} >
            <Input placeholder="Search contacts" />
          </InputGroup> */}
          <ChatList />
        </Box>
      </Box>

      <Box
        w={{ base: "100%", md: "50%" }} h={{ lg: "90vh" }}
        display={{ base: selectedChatId ? "block" : "none", md: "block" }}
        bg="canvas"
      >
        <ChatDetail />
      </Box >
      <Box w={{ base: "30%" }} h={{ lg: "90vh" }}
        display={{ base: selectedChatId ? "block" : "none", md: "block" }}
        bg="canvas" className='!hidden lg:!block'>
        <CustomerInfo />
      </Box>
    </div>
  )
}
