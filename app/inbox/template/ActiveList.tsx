"use client";

import useAxios from "@/lib/http/useAxios";
import {
  Badge,
  Button,
  Card,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GoSync, GoPencil } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";

const PAGE_SIZE = 5;

const ActiveList = () => {
  const [request] = useAxios<any>({ endpoint: "TEMPLATE" });
  const [syncData,res] = useAxios<any>({ endpoint: "SYNCTEMPLATE", 
    successCb:(()=>{
      getTemplate();
    })
  });
  const [template, setTemplate] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [call,setCall]=useState<boolean>(true);
  async function getTemplate() {
    setLoading(true);
    try {
      const res = await request();
      const data = res.templates.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        language: item.language || "English",
        status: item.status,
      }));
      setTemplate(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    getTemplate();
  }, []);

  function sync(i:any) {
    const {id,status}=i;
    console.log(`/${id}/status`)
    syncData({ path: `${id}/status` })

    // setCall(!call)
  }
  function remove() {
    console.log("delete");
  }
  function edit() {
    console.log("edit");
  }

  const totalPages = Math.ceil(template.length / PAGE_SIZE);
  const paginated = template.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card.Root mt={3} borderRadius="lg">
      <Card.Header pb={2}>
        <Heading size="md">Active Templates</Heading>
      </Card.Header>

      <Card.Body pt={0} overflowX="auto">
        {loading ? (
          <Stack direction="row" justify="center" align="center" py={10}>
            <Spinner />
            <Text color="gray.500">Loading templates...</Text>
          </Stack>
        ) : (
          <>
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader>SNO</Table.ColumnHeader>
                  <Table.ColumnHeader>Template Name</Table.ColumnHeader>
                  <Table.ColumnHeader className="hidden lg:table-cell">Category</Table.ColumnHeader>
                  <Table.ColumnHeader className="hidden lg:table-cell">Language</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader className="text-center!">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginated.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={6}
                      textAlign="center"
                      py={8}
                      color="gray.400"
                    >
                      No templates found
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginated.map((i, index) => (
                    <Table.Row key={i.id}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>
                        <Text
                          // color="blue.500"
                          fontWeight="medium"
                          cursor="pointer"
                          // _hover={{ textDecoration: "underline" }}
                        >
                          {i.name}
                        </Text>
                      </Table.Cell>
                      <Table.Cell className="hidden lg:table-cell">{i.category}</Table.Cell>
                      <Table.Cell className="hidden lg:table-cell">{i.language}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          colorPalette={
                            i.status === "APPROVED" ? "green" : i.status === "PENDING" ? "blue" : "red"
                          }
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {i.status?.toUpperCase()}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Stack direction="row" gap={2}>
                          <IconButton
                          className="hover:bg-white! text-green-500! border-2 hover:border-green-500!"
                            aria-label="Sync"
                            size="sm"
                            p="4"
                            colorPalette="green"
                          onClick={()=>sync(i)}
                          >
                            <GoSync />
                          </IconButton>
                          <IconButton
                            aria-label="Delete"
                            size="sm"
                            p="4"
                            colorPalette="red"
                            onClick={remove}
                          >
                            <MdDeleteForever />
                          </IconButton>
                          <IconButton
                            aria-label="Edit"
                            size="sm"
                            p="4"
                            colorPalette="blue"
                            onClick={edit}
                          >
                            <GoPencil />
                          </IconButton>
                        </Stack>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>

            {totalPages > 1 && (
              <Stack direction="row" justify="flex-end" mt={4} gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === page ? "solid" : "outline"}
                      colorPalette={p === page ? "blue" : "gray"}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  )
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </Stack>
            )}
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default ActiveList;