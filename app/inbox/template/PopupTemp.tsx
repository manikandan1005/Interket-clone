"use client"
import React, { useEffect, useState } from 'react'
import { LuSearch } from "react-icons/lu"
import {
    Box, Flex, Input, InputGroup,
    Button, Checkbox,
    Table,
    Text,
} from "@chakra-ui/react";
import useAxios from '@/lib/http/useAxios';
import { useLogin } from '@/lib/loginStore';
import TempFieldSelector from '../TempFieldSelector';

export default function PopupTemp({ 
    template, 
    onClose, 
    templateId  // ✅ added
}: { 
    template?: any, 
    onClose?: () => void,
    templateId?: string  // ✅ added
}) {
    const [request, res] = useAxios<any>({ endpoint: "GETCUSTOMER" });
    const [selectedIds, setSelectedIds] = useState<any[]>([]);

    const handleCheckboxChange = (id: any, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((item) => item !== id));
        }
    };
    const [sendTempalte,data]=useAxios<any>({endpoint:"SENDTEMPLATEMESSAGE"})

    const [showFieldSelector, setShowFieldSelector] = useState(false);
    const templateObj = useLogin((i) =>
        i.approvedTemplates?.find((t: any) => t.id === templateId)
    );

    const handleSetShowFieldSelector = (val: React.SetStateAction<boolean>) => {
        setShowFieldSelector(val);
        if (val === false) {
            onClose?.();
        }
    };

    function sendTemp() {
        const content = templateObj?.content || "";
        const hasVariables = /\{\{\d+\}\}/.test(content);

        if (hasVariables) {
            setShowFieldSelector(true);
        } else {
            const payload = {
                templateId: templateId,
                customerIds: selectedIds,
            };
            sendTempalte({data:payload})
            console.log("Payload to send:", payload);
            onClose?.();
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await request();
            if (data) {
                console.log("res for contact ", data);
            }
        };
        fetchData();
    }, []);

    return (
        <Flex direction="column" gap="10px" w="full" height="100%">
            <Box w='full'>
                <InputGroup w="250px" flex="1" startElement={<LuSearch />}>
                    <Input placeholder="Search contacts" />
                </InputGroup>
            </Box>
            <Box w="100%">
                <Table.ScrollArea borderWidth="1px" rounded="md" maxHeight="260px">
                    <Table.Root size="sm" stickyHeader>
                        <Table.Header>
                            <Table.Row bg="bg.subtle">
                                <Table.ColumnHeader></Table.ColumnHeader>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Contact no</Table.ColumnHeader>
                                <Table.ColumnHeader>Email</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {res?.map((item: any) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>
                                        <Checkbox.Root
                                            variant="solid"
                                            colorPalette="green"
                                            checked={selectedIds.includes(item.id)}
                                            onCheckedChange={(e) =>
                                                handleCheckboxChange(item.id, e.checked == true)
                                            }
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                        </Checkbox.Root>
                                    </Table.Cell>
                                    <Table.Cell>{item.contactName}</Table.Cell>
                                    <Table.Cell>{item.phoneNumber}</Table.Cell>
                                    <Table.Cell>{item.email}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            </Box>
            <Flex justifyContent="flex-end">
                <Button onClick={sendTemp}>Submit</Button>
            </Flex>

            {showFieldSelector && (
                <TempFieldSelector
                    setShowTemplateConfig={handleSetShowFieldSelector}
                    templateId={templateId!}
                    customerIds={selectedIds}
                />
            )}
        </Flex>
    )
}