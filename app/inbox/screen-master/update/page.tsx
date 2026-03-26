"use client"
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flex,
  Button,
  Box,
  Stack,
  NativeSelect,
  Field,
  Input,
  Switch
} from "@chakra-ui/react";
import { useLogin } from "@/lib/loginStore";
import useAxios from "@/lib/http/useAxios";

export default function ScreenMaster() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const isViewMode = searchParams.get("mode") === "view"

  const [request] = useAxios({
    endpoint: "UPDATESCREEN",
    successCb() {
      router.back();
    },
  });

  const id = useLogin((i) => i.selectedScreenId)
  const screenData = useLogin((i) =>
    i.screenmaster.find((i) => i.id === id)
  )

  console.log("screenData", screenData)

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    priority: 0,
    status: "true",
    permissions: {
      view: false,
      create: false,
      edit: false,
      delete: false
    }
  })

  // load data into form
  useEffect(() => {
    if (screenData) {
      setFormData({
        ...screenData,
        status: screenData.status === true || String(screenData.status) === "true" ? "true" : "false"
      })
    }
  }, [screenData])

  // permission toggle
  const handlePermission = (key: string, value: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: value
      }
    })
  }

  const handleUpdate = () => {
    console.log(`Updated Data of ${screenData?.name}`, formData)
    request({ data: formData, path: id ?? "" })
  }

  return (

    <Flex direction="column" p="6" gap="6">

      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center">
        <h2>{isViewMode ? "Screen Master View" : "Screen Master Update"}</h2>

        <Button
          colorScheme="blue"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Flex>

      {/* Form */}
      <Box borderWidth="1px" borderRadius="md" p="6">

        <Stack gap="5">

          {/* Row 1 */}
          <Flex gap="6">



            <Field.Root flex="1">
              <Field.Label>Name</Field.Label>

              <Input
                disabled={isViewMode}
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
              />
            </Field.Root>

            <Field.Root flex="1">
              <Field.Label>Status</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  disabled={isViewMode}
                  value={String(formData.status)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value
                    })
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">In-active</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

          </Flex>

          {/* Row 2 */}
          <Flex gap="6">

            <Field.Root flex="1">
              <Field.Label>Description</Field.Label>

              <Input
                disabled={isViewMode}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
              />
            </Field.Root>

            <Field.Root flex="1">
              <Field.Label>Priority</Field.Label>

              <Input
                disabled={isViewMode}
                type="number"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: Number(e.target.value)
                  })
                }
              />
            </Field.Root>

          </Flex>

          {/* Permissions */}
          <Flex gap="10" mt="4">

            <Switch.Root colorPalette="green"
              disabled={isViewMode}
              checked={formData.permissions?.view === true}
              onCheckedChange={(e) =>
                handlePermission("view", e.checked)
              }
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Read</Switch.Label>
            </Switch.Root>

            <Switch.Root colorPalette="green"
              disabled={isViewMode}
              checked={formData.permissions?.create === true}
              onCheckedChange={(e) =>
                handlePermission("create", e.checked)
              }
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Write</Switch.Label>
            </Switch.Root>

            <Switch.Root colorPalette="green"
              disabled={isViewMode}
              checked={formData.permissions?.edit === true}
              onCheckedChange={(e) =>
                handlePermission("edit", e.checked)
              }
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Edit</Switch.Label>
            </Switch.Root>

            <Switch.Root colorPalette="green"
              disabled={isViewMode}
              checked={formData.permissions?.delete === true}
              onCheckedChange={(e) =>
                handlePermission("delete", e.checked)
              }
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Delete</Switch.Label>
            </Switch.Root>

          </Flex>

        </Stack>

      </Box>

      {/* Footer */}
      {!isViewMode && (
      <Flex justifyContent="center" gap="4">

        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <Button
          colorScheme="blue"
          onClick={handleUpdate}
        >
          Update
        </Button>

      </Flex>
      )}

    </Flex>
  )
}