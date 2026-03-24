"use client"
import React, { useEffect, useState } from "react";

import {
  Flex,
  Box,
  Button,
  Table, Badge
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/lib/loginStore";

export type Permission = {
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
};

export type ScreenData = {
  id: string;
  name: string;
  description: string;
  priority: number;
  permissions: Permission;
  status: boolean;
};

export default function ScreenMasterList() {
  const router = useRouter();
  const setId = useLogin((i) => i.setSelectedScreenId);
  const getScreeMaster = useLogin((s) => s.getScreeMaster);
  const screenmaster = useLogin((s) => s.screenmaster);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getScreeMaster();
      setLoading(false);
    };
    fetchData();
  }, []);

  const title: string[] = ["SNO", "Screen Name", "Status", "Action"];

  function edit(id: string) {
    setId(id);
    router.push("/inbox/screen-master/update");
  }

  function view(id: string) {
    setId(id);
    router.push("/inbox/screen-master/update");
  }

  return (
    <Flex direction="column" p="6" gap="6">

      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center">
        <h2>Screen Master</h2>
        <Button
          onClick={() => router.push("/inbox/screen-master/create ")}
          className="bg-green-700! text-white">Add Screen</Button>
      </Flex>

      {/* Table */}
      <Box borderWidth="1px" borderRadius="md" overflow="hidden">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              {title.map((i: string, index: number) => (
                <Table.ColumnHeader key={index}>{i}</Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={3} textAlign="center">
                  Loading...
                </Table.Cell>
              </Table.Row>
            ) : screenmaster.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={3} textAlign="center">
                  No screens found.
                </Table.Cell>
              </Table.Row>
            ) : (
              screenmaster.map((item, index: number) => (
                <Table.Row key={index}>
                  <Table.Cell>{index+1}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={item.status ? "green" : "red"}
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                    >{item.status ? "Active" : "In-active"}</Badge>

                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <Flex gap="10px" alignItems="center">
                      <Button
                        onClick={() => view(item.id)}
                        className="text-white! bg-yellow-400! pointer-coarse:"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => edit(item.id)}
                        className="text-white! bg-blue-700! pointer-coarse:"
                      >
                        Edit
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

    </Flex>
  );
}