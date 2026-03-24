"use client";

import useAxios from "@/lib/http/useAxios";
import { Table, Box, Flex, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FormPopup from "../Components/ContactButton";
import { RiAddFill } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { BsChat } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface Et {
  id: string,
  name: string,
  role: string
}
export interface Data {
  id: string;
  contactName: string;
  phoneNumber: string;
  countrycode: string;
  email: string;
  createdOn: string;
  updatedAt: string;
  whatsapp_opted: boolean;
  status: string | null;
  source: string;
  tags: string | null;
  ContactDealValue: string;
  AppointmentTime: string;
  contactTo: string;
  userId: string;
}

interface Props {
  setCreateContact: React.Dispatch<React.SetStateAction<boolean>>
}

const dummyContacts: Data[] = [
  {
    id: "1",
    contactName: "Arjun Kumar",
    phoneNumber: "+919876543210",
    countrycode: "+91",
    email: "arjun@example.com",
    createdOn: "2024-01-10",
    updatedAt: "2024-01-15",
    whatsapp_opted: true,
    status: "active",
    source: "manual",
    tags: "vip",
    ContactDealValue: "5000",
    AppointmentTime: "2024-02-01T10:00:00",
    contactTo: "sales",
    userId: "u1",
  },
  {
    id: "2",
    contactName: "Priya Sharma",
    phoneNumber: "+919123456789",
    countrycode: "+91",
    email: "priya@example.com",
    createdOn: "2024-01-12",
    updatedAt: "2024-01-18",
    whatsapp_opted: false,
    status: "inactive",
    source: "import",
    tags: null,
    ContactDealValue: "3000",
    AppointmentTime: "2024-02-05T14:00:00",
    contactTo: "support",
    userId: "u2",
  },
  {
    id: "3",
    contactName: "Ravi Menon",
    phoneNumber: "+918765432100",
    countrycode: "+91",
    email: "ravi@example.com",
    createdOn: "2024-01-20",
    updatedAt: "2024-01-22",
    whatsapp_opted: true,
    status: null,
    source: "referral",
    tags: "lead",
    ContactDealValue: "8000",
    AppointmentTime: "2024-02-10T09:00:00",
    contactTo: "sales",
    userId: "u3",
  },
];

export default function contactList() {
  const router = useRouter()
  const [contactList, setContactList] = useState<Data[]>([])
  const name = "Contact";
  const Titles = ["SNO", "Name", "Number", "Email", "Account Owner", "whatsapp Opted", "Action", "chat"];
  const [createContact, setCreateContact] = useState(false)
  const [contactedAdded, SetContactedAdded] = useState<boolean>(false)
  // ✅ NEW
  const [editContact, setEditContact] = useState<Data | null>(null)
  const [request,res] = useAxios<Data[]>({ endpoint: 'CONTACTLIST', hideErrorMsg: false });
      const getContactList = async () => {
    try {
      const res = await request({ method: "GET" });
      if (!res || res.length <= 0) {
        setContactList(dummyContacts);
      } else {
        setContactList(res);
      }
      console.log(res)
    } catch (err) {
      console.error(err);
      setContactList(dummyContacts);
    }
  };
  useEffect(() => {

    getContactList();
    // request()
    // setContactList(res)
  }, [contactedAdded]);

  const access = { create: true, edit: true, delete: true, view: true };
  console.log("access", access)



  function remove(id: string) {
    const removedList = contactList.filter(i => i.id !== id);
    setContactList(removedList);
  }

  // ✅ NEW
  function edit(customer: Data) {
    setEditContact(customer);
    setCreateContact(true);
  }

  // ✅ NEW
  function handleLocalUpdate(updated: Data) {
    setContactList(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  function goToChat(phoneNumber: string) {
    router.push(`/inbox/chat?phone=${phoneNumber}`);
  }

  return (
    <Box p="4">
      {/* ✅ pass editContact, setEditContact, onLocalUpdate */}
      <FormPopup
        createContact={createContact}
        setCreateContact={setCreateContact}
        contactedAdded={contactedAdded}
        SetContactedAdded={SetContactedAdded}
        editContact={editContact}
        setEditContact={setEditContact}
        onLocalUpdate={handleLocalUpdate}
      />
      {
        access.create && <div className="flex w-full! justify-end mx-3! mb-3!">
          <Button className="mr-5! flex! gap-3! bg-green-600!" onClick={() => { setCreateContact(true) }}><RiAddFill /> Create contact</Button>
        </div>
      }
      {!contactList ? (
        <Flex direction="column" alignItems="center" justifyContent="center">
          <h1>No contacts Found. Please add a contact.</h1>
        </Flex>
      ) :
        (<Table.ScrollArea borderWidth="1px" rounded="md" maxH="560px">
          <Table.Root size="sm" stickyHeader variant="outline" >
            <Table.Header>
              <Table.Row bg="bg.subtle">
                {Titles.map((title, index) => (
                  <Table.ColumnHeader key={index}>{title}</Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                contactList.map((customer: any, index) => (
                  <Table.Row key={customer.id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{customer.contactName}</Table.Cell>
                    <Table.Cell>{customer.phoneNumber}</Table.Cell>
                    <Table.Cell>{customer.email}</Table.Cell>
                    <Table.Cell>{customer.AccountOwner ? customer.AccountOwner : "-"}</Table.Cell>
                    <Table.Cell>{customer.whatsapp_opted ? "Yes" : "No"}</Table.Cell>
                    <Table.Cell className="flex! gap-3! justify-center!">
                      {
                        !access.edit && !access.delete ? "-" : (
                          <>
                            {/* ✅ onClick calls edit() */}
                            {access.edit && <Button className="bg-blue-500!" onClick={() => edit(customer)}><GrEdit /></Button>}
                            {access.delete && <Button className="bg-red-500!" onClick={() => remove(customer.id)}><RiDeleteBinLine /></Button>}
                          </>
                        )
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <BsChat style={{cursor:"pointer"}} onClick={() => goToChat(customer.phoneNumber)} />
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>)
      }
    </Box>
  );
}