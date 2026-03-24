"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Table, Badge, Input } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useAxios from "@/lib/http/useAxios";
import { MdOutlineSave, MdCancel } from "react-icons/md";
import { error } from "console";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Permission {
  screenName: string;
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
  screenStatus: boolean;
}

interface RoleData {
  id: string;
  name: string;
  permissions: Permission[] | "FULL_ACCESS";
  status: "ACTIVE" | "INACTIVE";
}

// ─── Update Component ────────────────────────────────────────────────────────

const actions = ["SNO", "Screen Name", "Screen Status", "View", "Edit", "Create", "Delete"];

const defaultPermissions: Permission[] = [
  { screenName: "Inbox",        create: true,  edit: true,  delete: true,  view: true,  screenStatus: true  },
  { screenName: "Template",     create: false, edit: false, delete: false, view: false, screenStatus: false },
  { screenName: "AgentSetting", create: false, edit: false, delete: false, view: false, screenStatus: false },
  { screenName: "Contact",      create: false, edit: false, delete: false, view: false, screenStatus: false },
  { screenName: "Role Mapping", create: false, edit: false, delete: false, view: false, screenStatus: false },
];

interface UpdateProps {
  roleData: RoleData;
  mode: "view" | "edit";
  onClose: () => void;
}

function UpdateRole({ roleData, mode, onClose }: UpdateProps) {
  const isView = mode === "view";

  const normalizePermissions = (permissions: Permission[] | "FULL_ACCESS"): Permission[] => {
    if (permissions === "FULL_ACCESS") {
      return defaultPermissions.map((p) => ({
        ...p, create: true, edit: true, delete: true, view: true, screenStatus: true,
      }));
    }
    return permissions;
  };

  const [role, setRole] = useState<RoleData>({
    ...roleData,
    permissions: normalizePermissions(roleData.permissions),
  });

  const [updateRequest] = useAxios<RoleData>({ endpoint: "UPDATEROLE" });

  function checkScreenStatus(data: Permission): boolean {
    return data.create || data.delete || data.edit || data.view;
  }

  function handleChanges(index: number, field: string, value: boolean) {
    const newPermissions = [...(role.permissions as Permission[])];
    newPermissions[index] = { ...newPermissions[index], [field]: value };
    newPermissions[index].screenStatus = checkScreenStatus(newPermissions[index]);
    setRole({ ...role, permissions: newPermissions });
  }

  const handleSubmit = async () => {
    try {
      await updateRequest({
        method: "PUT",
        url: `/v1/updateRole/${role.id}`,
        data: {
          name: role.name,
          permissions: role.permissions,
          status: role.status,
        },
      });
      alert("Role updated successfully!");
      onClose();
    } catch (err) {
      alert("Error updating role: " + err);
      console.error(err);
    }
  };

  const isFullAccess = roleData.permissions === "FULL_ACCESS";

  return (
    <Box p="4">
      <Flex justifyContent="space-between" mb="4" alignItems="center">
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
          {isView ? "View Role" : "Edit Role"}
        </h2>
        <Button variant="subtle" colorPalette="gray" onClick={onClose}>
          Back
        </Button>
      </Flex>

      <Flex direction="column" gap="20px" m="10px">

        <Flex gap="20px" alignItems="flex-end" flexWrap="wrap">
          <Flex direction="column" gap="6px" w="280px">
            <label style={{ fontWeight: 500 }}>
              Role Name <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              value={role.name}
              disabled={isView}
              onChange={(e) => setRole({ ...role, name: e.target.value })}
              bg={isView ? "gray.50" : "white"}
            />
          </Flex>

          <Flex direction="column" gap="6px">
            <label style={{ fontWeight: 500 }}>Status</label>
            {isView ? (
              <Badge
                colorPalette={role.status === "ACTIVE" ? "green" : "red"}
                px="3" py="1" borderRadius="md" fontSize="sm"
              >
                {role.status}
              </Badge>
            ) : (
              <Flex gap="10px">
                {(["ACTIVE", "INACTIVE"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={role.status === s ? "solid" : "outline"}
                    colorPalette={s === "ACTIVE" ? "green" : "red"}
                    onClick={() => setRole({ ...role, status: s })}
                  >
                    {s}
                  </Button>
                ))}
              </Flex>
            )}
          </Flex>
        </Flex>

        {isFullAccess && (
          <Flex
            bg="blue.50" border="1px solid" borderColor="blue.200"
            borderRadius="md" p="3" alignItems="center" gap="2"
          >
            <Badge colorPalette="blue" fontSize="sm">FULL ACCESS</Badge>
            <span style={{ fontSize: "14px", color: "#2b6cb0" }}>
              This role has full access to all screens and actions.
              {!isView && " You can still modify the status above."}
            </span>
          </Flex>
        )}

        {!isFullAccess && (
          <Table.ScrollArea borderWidth="1px" rounded="md" maxH="420px">
            <Table.Root size="sm" stickyHeader variant="outline">
              <Table.Header bg="gray.100">
                <Table.Row>
                  {actions.map((title, idx) => (
                    <Table.ColumnHeader key={idx}>{title}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(role.permissions as Permission[]).map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell fontWeight="500">{item.screenName}</Table.Cell>

                    <Table.Cell>
                      <Badge colorPalette={item.screenStatus ? "green" : "gray"} fontSize="xs">
                        {item.screenStatus ? "Enabled" : "Disabled"}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell>
                      <Checkbox.Root
                        checked={item.view}
                        disabled={isView}
                        onCheckedChange={(d) => handleChanges(index, "view", d.checked === true)}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.Cell>

                    <Table.Cell>
                      {item.screenName === "Inbox" ? "—" : (
                        <Checkbox.Root
                          checked={item.edit}
                          disabled={isView}
                          onCheckedChange={(d) => handleChanges(index, "edit", d.checked === true)}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      {item.screenName === "Inbox" ? "—" : (
                        <Checkbox.Root
                          checked={item.create}
                          disabled={isView}
                          onCheckedChange={(d) => handleChanges(index, "create", d.checked === true)}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      {item.screenName === "Inbox" ? "—" : (
                        <Checkbox.Root
                          checked={item.delete}
                          disabled={isView}
                          onCheckedChange={(d) => handleChanges(index, "delete", d.checked === true)}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}

        {!isView && (
          <Flex gap="10px" justify="center">
            <Button onClick={handleSubmit}>
              <MdOutlineSave /> Update
            </Button>
            <Button onClick={onClose}>
              <MdCancel /> Cancel
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function RoleMappingPage() {
  const router = useRouter();

  // const dummyRoles: RoleData[] = [
  //   { id: "1", name: "Admin", status: "ACTIVE", permissions: "FULL_ACCESS" },
  //   { id: "2", name: "Editor", status: "ACTIVE", permissions: [] },
  //   { id: "3", name: "Viewer", status: "INACTIVE", permissions: [] },
  // ];

  const name = "Role Mapping";

  const [permission, setPermission] = useState<Permission[] | "FULL_ACCESS" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("permission");
      setPermission(data ? JSON.parse(data) : null);
    }
  }, []);

  const access =
    permission === "FULL_ACCESS"
      ? { create: true, edit: true, delete: true, view: true }
      : (permission as Permission[])?.find((i) => i.screenName === name);

  const titles = ["SNO", "Role", "Status", "Action"];
  const [data, setData] = useState<RoleData[]>([]);
  const [request,response] = useAxios<RoleData[]>({ endpoint: "GETROLE" });

  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    request();
    setData(response)
    // const fetchRoles = async () => {
    //   try {
    //     const res = await request();
    //     setData(res?.length ? res : []);
    //   } catch(err) {
    //     // setData(dummyRoles);
    //     console.log(err)
    //   }
    // };
    // fetchRoles();
  }, []);

  function viewData(item: RoleData) {
    setSelectedRole(item);
    setMode("view");
    setShowUpdate(true);
  }

  function editData(item: RoleData) {
    setSelectedRole(item);
    setMode("edit");
    setShowUpdate(true);
  }

  function handleClose() {
    setShowUpdate(false);
    setSelectedRole(null);
  }

  if (showUpdate && selectedRole) {
    return <UpdateRole roleData={selectedRole} mode={mode} onClose={handleClose} />;
  }

  return (
    <Box p="4">
      <Flex justifyContent="space-between" mb="4">
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Role Management</h1>
        {/* {access?.create && ( */}
          <Button onClick={() => router.push("role-mapping/create-role")}>
            Create Role
          </Button>
        {/* )} */}
      </Flex>

      <Box m="7">
        <Table.ScrollArea borderWidth="1px" rounded="md" maxH="560px">
          <Table.Root size="sm" stickyHeader variant="outline">
            <Table.Header>
              <Table.Row>
                {titles.map((title, idx) => (
                  <Table.ColumnHeader key={idx}>{title}</Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.map((items, index) => (
                <Table.Row key={items.id || index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{items.name}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={items.status === "ACTIVE" ? "green" : "red"}>
                      {items.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="10px">
                      {access?.view && (
                        <Button size="sm" onClick={() => viewData(items)}>View</Button>
                      )}
                      {items.name?.toLowerCase() !== "admin" && access?.edit && (
                        <Button size="sm" onClick={() => editData(items)}>Edit</Button>
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Box>
  );
}