"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function ScreenMaster() {

  const router = useRouter()

  const id = useLogin((i) => i.selectedScreenId)
  const screenData = useLogin((i) =>
    i.screenmaster.find((i) => i.id === id)
  )

  console.log("screenData", screenData)

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    priority: 0,
    permission: {
      view: false,
      create: false,
      edit: false,
      delete: false
    }
  })

  // load data into form
  useEffect(() => {
    if (screenData) {
      setFormData(screenData)
    }
  }, [screenData])

  // permission toggle
  const handlePermission = (key: string, value: boolean) => {
    setFormData({
      ...formData,
      permission: {
        ...formData.permission,
        [key]: value
      }
    })
  }

  const handleUpdate = () => {
    console.log(`Updated Data of ${screenData?.name}` , formData)
  }

  return (

    <Flex direction="column" p="6" gap="6">

      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center">
        <h2>Screen Master Update</h2>

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
      value={formData.status ?? ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          status: e.target.value === "true"
        })
      }
    >
      <option value={formData.status}>{formData.status?"Active":"In-active"}</option>
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
              checked={formData.permission?.view}
              onCheckedChange={(e) =>
                handlePermission("view", e.checked)
              }
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Read</Switch.Label>
            </Switch.Root>

            <Switch.Root colorPalette="green"
              checked={formData.permission?.create}
              onCheckedChange={(e) =>
                handlePermission("create", e.checked)
              }
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Write</Switch.Label>
            </Switch.Root>

            <Switch.Root colorPalette="green"
              checked={formData.permission?.edit}
              onCheckedChange={(e) =>
                handlePermission("edit", e.checked)
              }
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Edit</Switch.Label>
            </Switch.Root>

            <Switch.Root colorPalette="green"
              checked={formData.permission?.delete}
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

    </Flex>
  )
}