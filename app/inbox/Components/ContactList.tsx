"use client";

import useAxios from "@/lib/http/useAxios";
import { Table, Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Datas {
    count: number,
    customer: Data[],
    created_by: Et
}
interface Et {
    id: string,
    name: string,
    role: string
}
interface Data {
    contactName: string,
    email: string,
    whatsapp_opted: boolean,
    countrycode: string,
    phoneNumber: string,
    AppointmentTime: string | null,
    ContactDealValue: string | null,
    createdOn: string,
    updatedAt: string,
    id: string,
    source: string,
    status: string | null,
    tags: string | null,
    userId: string
}

interface sendProp {
    listContact: boolean, contactedAdded: boolean
    setListContact: React.Dispatch<React.SetStateAction<boolean>>
}


export default function ContactTable({ listContact, setListContact, contactedAdded }: sendProp) {
    const [contactList, setContactList] = useState<Data[]>([])
    const Titles = ["SNO", "Name", "Number", "Email", "Tags"];
    //const [call,setCall] = useState<boolean>(false)
    const [request] = useAxios<any>({ endpoint: 'CONTACTLIST', hideErrorMsg: false });
    useEffect(() => {

        getContactList();
    }, [contactedAdded]);
    //get api
    const getContactList = async () => {
        try {
            const res = await request({ method: "GET" });
            setContactList(res || []);
            // console.log("response", res);
        } catch (err) {
            //console.error(err);
            alert(err);
        }
    };
    //console.log(contactList);
    return (
        <Box p="4">
            <div className="flex justify-end !mx-3 !mb-3">
                <Button onClick={() => { setListContact(false) }}>Back to chat</Button></div>
            {contactList && <Table.Root variant="outline" size="sm">
                <Table.Header>
                    <Table.Row>
                        {Titles.map(title => (
                            <Table.ColumnHeader>{title}</Table.ColumnHeader>
                        ))}
                        {/* <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Email</Table.ColumnHeader>
                        <Table.ColumnHeader>Contact number</Table.ColumnHeader>
                        <Table.ColumnHeader>tags</Table.ColumnHeader> 
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader> */}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        contactList.map((customer: any) => (
                            <Table.Row key={customer.id}>
                                <Table.Cell>{customer.id}</Table.Cell>
                                <Table.Cell>{customer.contactName}</Table.Cell>
                                <Table.Cell>{customer.phoneNumber}</Table.Cell>
                                <Table.Cell>{customer.email}</Table.Cell>
                                <Table.Cell>{customer.tags}</Table.Cell>
                            </Table.Row>
                        ))
                    }

                </Table.Body>
            </Table.Root>
            }

        </Box>

    );
}