"use client"
import axios from "axios";
import useAxios from '@/lib/http/useAxios'
import { useInboxStore } from '@/lib/store'
import React, { useEffect } from 'react'
import { Avatar, Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useLogin } from '@/lib/loginStore';

export default function CustomerInfo() {
    const [request,res] = useAxios({ endpoint: "ASSIGNAGENT" })
    const selectedChatId = useInboxStore((s) => s.selectedChatId);
    const chat = useInboxStore((s) => selectedChatId ? s.userInfo.find((c) => c.chatID === selectedChatId) : undefined)
    const agentData = useLogin((s) => s.agents)
    const fetchAgent = useLogin((s) => s.fetchAgent)

    useEffect(() => {
        fetchAgent()
    }, [fetchAgent])

    const assignAgent=async(AgentId:string,id:string)=>{
        console.log("test:",id , AgentId)
        const payload ={
            accountOwnerId :AgentId
        }
        try{
            await request({
                 path:`${id}`,
                 data:payload
            })
            console.log(res);
            
        }
        catch(error){}
    }


    return chat ? (
        <Box className='!p-1 !bg-gray-200 !w-full h-full'>
            <Flex className='!mt-7'>
                <Text fontSize="2xl">Contact Details</Text>
            </Flex>
            <Box
                rounded="md" m="5" p="5"
                className='!pb-16 !mx-[10px]'
                shadow="subtle" border="1px solid"
                borderColor="border" background="white"
            >
                <Flex w="full" justify="space-between" align="center" p="4">
                    <HStack gap="5">
                        <Avatar.Root size="lg">
                            <Avatar.Fallback name={chat?.contactName} />
                            <Avatar.Image src={""} />
                        </Avatar.Root>
                        <Text fontWeight="bold">
                            {chat?.contactName ?? "Unknown"}
                        </Text>
                    </HStack>
                    <Button bg="whatsapp.600" color="white" px="4">View Details</Button>
                </Flex>

                <div className='flex flex-col gap-6'>
                    <Flex direction="column" gap="5px">
                        <Text fontWeight="bold">Contact:</Text>
                        <Text>{chat?.phoneNumber ?? "-"}</Text>
                    </Flex>

                    <Flex direction="column" gap="5px">
                        <Text>Email:</Text>
                        <Text>{chat?.email ?? "-"}</Text>
                    </Flex>

                    <Flex direction="column" gap="5px">
                        <Text>Account Owner</Text>
                        <select
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        assignAgent(e.target.value, chat.id)  // ✅ e.target.value = agent.id, chat.id from store
    }
                           
                            style={{
                                width: "200px",
                                padding: "8px",
                                border: "2px solid #CBD5E0",
                                borderRadius: "6px",
                            }}
                        >
                            <option value={chat?.AccountOwner}>{chat?.AccountOwner ? chat?.AccountOwner:"--select--"}</option>
                            {agentData.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                    {agent.name}
                                </option>
                            ))}
                        </select>
                    </Flex>

                    <Flex direction="column" gap="5px">
                        <Text>WhatsApp Opted:</Text>
                        <Text>{chat.whatsapp_opted ? "Yes" : "No"}</Text>
                    </Flex>
                </div>
            </Box>
        </Box>
    ) : null
}