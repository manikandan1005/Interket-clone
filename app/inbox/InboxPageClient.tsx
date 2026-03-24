"use client";

import { Avatar, Box, Button, Flex, HStack, IconButton, Menu, Text } from "@chakra-ui/react";
import { HamburgerMenuIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import React, { useEffect, useMemo, useState } from "react";
import { useInboxStore } from "@/lib/store";
import FiltersPanel from "@/app/inbox/FiltersPanel";
import { Drawer } from "@chakra-ui/react";
import { logout } from "@/lib/auth";
import { routes } from "@/lib/routes";
import SideBar from "./SideBar";
import Sidetestbar from "./Sidetestbar";
import { CiSettings } from "react-icons/ci";
import Link from "next/link";
import { MdOutlineSettingsAccessibility,MdSupportAgent,MdSettings } from "react-icons/md";


export default function InboxPageClient({ children, }: { children: React.ReactNode }) {
  const init = useInboxStore((s) => s.actions.init);
  const selectedChatId = useInboxStore((s) => s.selectedChatId);
  const [createContact, setCreateContact] = useState(false)
  const [listContact, setListContact] = useState<boolean>(false);

  //this is for after create new contact to all api again
  const [contactedAdded, SetContactedAdded] = useState<boolean>(false)
  useEffect(() => {
    init();
  }, [init]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [userName] = useState(() => {
    try {
      return typeof window !== "undefined" ? window.localStorage.getItem("userName") || "User" : "User";
    } catch {
      return "User";
    }
  });

  return (
    <>

      {/* <FormPopup createContact={createContact} setCreateContact={setCreateContact} contactedAdded={contactedAdded} SetContactedAdded={SetContactedAdded} /> */}
      <Flex direction="column" height="100vh" bg="canvas">
        <HStack className="fixed z-10 top-0 left-0 right-0"
          px="4"
          py="3"
          borderBottomWidth="1px"
          bg="panel"
          justify="space-between"
        >
          <HStack gap="2">
            {/* <Box display={{ base: "block", md: "none" }}>
              <IconButton
                aria-label="Open filters"
                size="sm"
                variant="outline"
                onClick={() => setFiltersOpen(true)}
              >
                <HamburgerMenuIcon />
              </IconButton>
            </Box> */}
            <Text fontWeight="600">Interakt AI</Text>
            <Text
              color="muted"
              fontSize="sm"
              display={{ base: "none", md: "block" }}
            >
              WhatsApp / Instagram shared team inbox
            </Text>
          </HStack>

          <HStack gap="3">
            <IconButton
              aria-label="Toggle dark mode"
              size="sm"
              variant="outline"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </IconButton>
            {/* setting btn */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="sm" variant="outline">
                  <CiSettings style={{ marginLeft: "6px" }} />
                </Button>
              </Menu.Trigger>

              <Menu.Positioner>
                <Menu.Content className="grid grid-cols-2 p-3 gap-3">
                  <Menu.Item
                    _hover={{ bg: "gray.100", scale:"1.1"  }}
                    value="home"
                    className="shadow" >
                    <MdOutlineSettingsAccessibility />
                    <Link href="/inbox/">Home</Link>
                  </Menu.Item>

                  <Menu.Item
                    _hover={{ bg: "gray.100", scale:"1.1" }}
                    value="agentsetting"
                    className="shadow" >
                    <MdSupportAgent />

                    <Link href="/inbox/agent">Agent setting</Link>
                  </Menu.Item>
                  <Menu.Item
                    _hover={{ bg: "gray.100", scale:"1.1" }}
                    value="setting"
                    className="shadow" >
                    <MdSettings />
                    <Link href="/inbox/agent-setting">setting</Link>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="ghost" size="sm" px="2">
                  <HStack gap="2">
                    <Avatar.Root>
                      <Avatar.Fallback name={userName} />
                    </Avatar.Root>
                    <Text display={{ base: "none", md: "block" }}>{userName}</Text>
                  </HStack>
                </Button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value="logout"
                    onClick={() => {
                      logout();
                      window.location.href = routes.login;
                      localStorage.clear();
                      // sessionStorage.clear();
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </HStack>
        </HStack>

        <Drawer.Root
          placement="start"
          open={filtersOpen}
          onOpenChange={(e) => setFiltersOpen(e.open)}
        >
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="360px">
              <Drawer.Header>
                <Drawer.Title>Filters</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <FiltersPanel setCreateContact={setCreateContact} setListContact={setListContact} />
              </Drawer.Body>
              <Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <IconButton aria-label="Close filters" variant="outline">
                    Close
                  </IconButton>
                </Drawer.CloseTrigger>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>

        <Flex flex="1" minH="0">
          <Box
          >
            <SideBar />
          </Box>

          <Box className="!mt-16 !ml-18 flex-1 min-w-0">
            <div className="h-full w-full">
              {children}
            </div>
          </Box>

          {/*           
          {listContact && <Box className="!w-full !max-h-screen ">
            <ContactList setListContact={setListContact}
              listContact={listContact}
              contactedAdded={contactedAdded}
            />
          </Box>

          }


          {!listContact && <Box
            w={{ base: selectedChatId ? "0%" : "100%", md: "30%" }}
            display={{ base: selectedChatId ? "none" : "block", md: "block" }}
            borderRightWidth={{ base: "0", md: "1px" }}
            bg="canvas"
            minW={{ md: "320px" }}
          >
            <ChatList />
          </Box>
          }
          {!listContact && <Box
            w={{ base: "100%", md: "50%" }}
            display={{ base: selectedChatId ? "block" : "none", md: "block" }}
            bg="canvas"
          >
            <ChatDetail />
          </Box>} */}
        </Flex>
      </Flex>
    </>
  );
}
