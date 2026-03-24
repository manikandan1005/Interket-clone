"use client"
import useAxios from '@/lib/http/useAxios';
import { Flex, Checkbox, Table, Button, Input, Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { MdOutlineAddReaction, MdCancel } from "react-icons/md";
import React, { useState } from 'react'
import { boolean } from 'zod';
import { useLogin } from '@/lib/loginStore';


function page() {
  const actions: string[] = ["SNO", "screenStatus", "view", "edit", "create", "delete",]
  const router = useRouter()
  const [request] = useAxios({ endpoint: "CREATEROLE" })
  const screenMasterData = useLogin((s) => s.screenmaster);
  // const screenMasterData = data.screens;

  const mani = screenMasterData.map((screen) => ({
    screenName: screen.name,
    create: screen?.permissions.create,
    edit: screen?.permissions.edit,
    delete: screen?.permissions.delete,
    view: screen?.permissions.view,
    screenStatus: screen.status === true,
  }));
  console.log("hiiii")
  console.log("data-=====", mani)
  const temp = {
    name: "",
    permissions: [
      {
        screenName: "Inbox",
        create: true,
        edit: true,
        delete: true,
        view: true,
        screenStatus: true
      },
      {
        screenName: "Template",
        create: false,
        edit: false,
        delete: false,
        view: false,
        screenStatus: false
      },
      {
        screenName: "AgentSetting",
        create: false,
        edit: false,
        delete: false,
        view: false,
        screenStatus: false
      },
      {
        screenName: "Contact",
        create: false,
        edit: false,
        delete: false,
        view: false,
        screenStatus: false
      },
      {
        screenName: "Role Mapping",
        create: false,
        edit: false,
        delete: false,
        view: false,
        screenStatus: false
      }
    ]
  }
  // const updatedTemp: any = {
  //   ...temp,
  //   permissions: screenMasterData.map(
  //     ({ name, status, permissions: { create, edit, delete: del, view } }) => ({
  //       screenName: name,
  //       create,
  //       edit,
  //       delete: del,
  //       view,
  //       screenStatus: status === "true"
  //     })
  //   )
  // };

  // console.log(updatedTemp);
  const [role, setRole] = useState(temp);
  function check(data: any) {
    console.log("check data: ", data)
    if (data.create || data.delete || data.edit || data.view)
      return true
    else return false
  }

  const [payloade, setPayloade] = useState<any>({ name: "", permissions: [] });

function handleChanges(index: number, field: string, value: boolean) {
  const newData = [...role.permissions];
  newData[index] = { ...newData[index], [field]: value };
  newData[index].screenStatus = check(newData[index]);

  setRole({ ...role, permissions: newData });

  const activePermissions = newData.filter(
    (item) => item.create || item.edit || item.delete || item.view
  );

  const newPayload = {
    name: role.name,
    permissions: activePermissions,
  };

  setPayloade(newPayload);
  console.log("payload ======", newPayload);
}
  const onSubmit = async (data: any) => {
    // setCreateContact(false)
    console.log("Sent successfully", data)
    try {
      const response = await request({
        method: "POST",
        data: data
      });
      console.log("Backend response:", response);
      //   SetContactedAdded(true);



    } catch (err) {
      alert(err)
      console.error("Error sending data", err)
    }
    //reset
    // reset()
  }
  function sendData() {
    // alert("hiii")
    // setRole()
    onSubmit(role)
    console.log("send deat ======",payloade)

  }
  return (
    <div>
      <Flex direction="column" gap="25px" m="15px">
        <Flex justifyContent="space-between">
          <Flex w='300px' direction="column" gap="10px">
            <label>Create Role<span className="text-red-600">*</span></label>
            <Input
              type="text"
              value={role.name}
              onChange={(event) =>
                setRole((prevRole) => ({
                  ...prevRole,
                  name: event.target.value
                }))
              }
            />
          </Flex>
          <Button
            colorScheme="blue"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Flex>
        <Table.Root>

          <Table.Header>
            <Table.Row>
              {actions.map((tital, index) => (
                <Table.Cell>{tital}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {mani.map((items, index) => (
              <Table.Row key={index}>
                {/* all */}
                {/* <Table.Cell>{<input type='checkbox'></input>}</Table.Cell> */}
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell >{items.screenName}</Table.Cell>
                {/*  */}
                <Table.Cell>
                  {/* view */}
                  {items.view ?
                    <Checkbox.Root
                      variant="solid"
                      colorPalette="green"
                      onCheckedChange={(details) => {

                        handleChanges(index, "view", details.checked === true)
                      }
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                    : "-"
                  }
                </Table.Cell>
                <Table.Cell>
                  {/* edit */}
                  {items.edit ?
                    <Checkbox.Root
                      variant="solid"
                      colorPalette="green"
                      // checked={items.edit}
                      onCheckedChange={(details) => {
                        handleChanges(index, "edit", details.checked === true)
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                    : "-"

                  }
                </Table.Cell>
                {/* create */}
                <Table.Cell>{items.create ?
                  <Checkbox.Root
                    variant="solid"
                    colorPalette="green"
                    // checked={items.create}
                    onCheckedChange={(details) => {
                      handleChanges(index, "create", details.checked === true)
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                  : "-"

                }
                </Table.Cell>
                {/* delete */}
                <Table.Cell>{items.delete ?
                  <Checkbox.Root
                    variant="solid"
                    colorPalette="green"
                    // checked={items.delete}
                    onCheckedChange={(details) => {
                      handleChanges(index, "delete", details.checked === true)
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                  : "-"

                }</Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>

        </Table.Root>
        <Flex gap="10px" justify="Center" alignItems="center">
          <Button variant="subtle" colorPalette="green" className=' text-white' onClick={() => { sendData() }}><MdOutlineAddReaction />
            Create</Button>
          <Button variant="subtle" colorPalette="red" className=' text-white' onClick={() => {
            setRole(temp);
            // router.back()
          }}><MdCancel />
            Cancel</Button>
        </Flex>
      </Flex>
    </div>
  )
}

export default page