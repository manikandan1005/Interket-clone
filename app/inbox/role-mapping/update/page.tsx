"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  Badge,
} from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useAxios from "@/lib/http/useAxios";
import { MdOutlineSave, MdCancel } from "react-icons/md";

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

interface UpdateProps {
  roleData: RoleData;
  mode: "view" | "edit";
  onClose?: () => void;
}

const defaultPermissions: Permission[] = [
  { screenName: "Inbox", create: true, edit: true, delete: true, view: true, screenStatus: true },
  { screenName: "Template", create: false, edit: false, delete: false, view: false, screenStatus: false },
  { screenName: "AgentSetting", create: false, edit: false, delete: false, view: false, screenStatus: false },
  { screenName: "Contact", create: false, edit: false, delete: false, view: false, screenStatus: false },
  { screenName: "Role Mapping", create: false, edit: false, delete: false, view: false, screenStatus: false },
];

const actions = ["SNO", "Screen Name", "Screen Status", "View", "Edit", "Create", "Delete"];

export default function Update({ roleData, mode, onClose }: UpdateProps) {
  const router = useRouter();
  const isView = mode === "view";

  const normalizePermissions = (permissions: Permission[] | "FULL_ACCESS"): Permission[] => {
    if (permissions === "FULL_ACCESS") {
      return defaultPermissions.map((p) => ({
        ...p,
        create: true,
        edit: true,
        delete: true,
        view: true,
        screenStatus: true,
      }));
    }
    return permissions;
  };

  const [role, setRole] = useState<RoleData>({
    ...roleData,
    permissions: normalizePermissions(roleData.permissions),
  });

  const [updateRequest] = useAxios<any>({ endpoint: "UPDATEROLE" });

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
      onClose ? onClose() : router.back();
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
        <Button variant="subtle" colorPalette="gray" onClick={() => (onClose ? onClose() : router.back())}>
          Back
        </Button>
      </Flex>

      <Flex direction="column" gap="20px" m="10px">
        {/* Role Name */}
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

          {/* Status Selection */}
          <Flex direction="column" gap="6px">
            <label style={{ fontWeight: 500 }}>Status</label>
            {isView ? (
              <Badge
                colorPalette={role.status === "ACTIVE" ? "green" : "red"}
                px="3"
                py="1"
                borderRadius="md"
                fontSize="sm"
              >
                {role.status}
              </Badge>
            ) : (
              <Flex gap="10px">
                {["ACTIVE", "INACTIVE"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={role.status === s ? "solid" : "outline"}
                    colorPalette={s === "ACTIVE" ? "green" : "red"}
                    onClick={() => setRole({ ...role, status: s as "ACTIVE" | "INACTIVE" })}
                  >
                    {s}
                  </Button>
                ))}
              </Flex>
            )}
          </Flex>
        </Flex>

        {/* FULL_ACCESS badge */}
        {isFullAccess && (
          <Flex
            bg="blue.50"
            border="1px solid"
            borderColor="blue.200"
            borderRadius="md"
            p="3"
            alignItems="center"
            gap="2"
          >
            <Badge colorPalette="blue" fontSize="sm">FULL ACCESS</Badge>
            <span style={{ fontSize: "14px", color: "#2b6cb0" }}>
              This role has full access to all screens and actions.
              {!isView && " You can still modify the status above."}
            </span>
          </Flex>
        )}

        {/* Permissions Table */}
        {!isFullAccess && (
          <Table.ScrollArea borderWidth="1px" rounded="md" maxH="420px">
            <Table.Root size="sm" stickyHeader variant="outline">
              <Table.Header bg="gray.100">
                <Table.Row>
                  {actions.map((title, idx) => (
                    <Table.ColumnHeader key={idx} fontWeight="bold">
                      {title}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(role.permissions as Permission[]).map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell fontWeight="500">{item.screenName}</Table.Cell>

                    {/* Screen Status */}
                    <Table.Cell>
                      <Badge
                        colorPalette={item.screenStatus ? "green" : "gray"}
                        fontSize="xs"
                      >
                        {item.screenStatus ? "Enabled" : "Disabled"}
                      </Badge>
                    </Table.Cell>

                    {/* View */}
                    <Table.Cell>
                      <Checkbox.Root
                        variant="solid"
                        colorPalette="green"
                        checked={item.view}
                        disabled={isView}
                        onCheckedChange={(details) =>
                          handleChanges(index, "view", details.checked === true)
                        }
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.Cell>

                    {/* Edit */}
                    <Table.Cell>
                      {item.screenName === "Inbox" ? (
                        <span style={{ color: "gray" }}>—</span>
                      ) : (
                        <Checkbox.Root
                          variant="solid"
                          colorPalette="green"
                          checked={item.edit}
                          disabled={isView}
                          onCheckedChange={(details) =>
                            handleChanges(index, "edit", details.checked === true)
                          }
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      )}
                    </Table.Cell>

                    {/* Create */}
                    <Table.Cell>
                      {item.screenName === "Inbox" ? (
                        <span style={{ color: "gray" }}>—</span>
                      ) : (
                        <Checkbox.Root
                          variant="solid"
                          colorPalette="green"
                          checked={item.create}
                          disabled={isView}
                          onCheckedChange={(details) =>
                            handleChanges(index, "create", details.checked === true)
                          }
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      )}
                    </Table.Cell>

                    {/* Delete */}
                    <Table.Cell>
                      {item.screenName === "Inbox" ? (
                        <span style={{ color: "gray" }}>—</span>
                      ) : (
                        <Checkbox.Root
                          variant="solid"
                          colorPalette="green"
                          checked={item.delete}
                          disabled={isView}
                          onCheckedChange={(details) =>
                            handleChanges(index, "delete", details.checked === true)
                          }
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

        {/* Action Buttons */}
        {!isView && (
          <Flex gap="10px" justify="center" alignItems="center">
            <Button
              variant="subtle"
              colorPalette="green"
              onClick={handleSubmit}
            >
              <MdOutlineSave />
              Update
            </Button>
            <Button
              variant="subtle"
              colorPalette="red"
              onClick={() => (onClose ? onClose() : router.back())}
            >
              <MdCancel />
              Cancel
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}