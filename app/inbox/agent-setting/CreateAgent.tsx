"use client"
import { useEffect } from "react";
import { useInboxStore } from "@/lib/store";
import {
  Button,
  Dialog,
  Portal,
  Input,
  Field,
  Stack,
  HStack, NativeSelect,
  Flex,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import axios from "axios"
import useAxios from "@/lib/http/useAxios";

interface Agent {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  countryCode: string;
  phoneNumber: string;
}

interface Props {
  createAgent: boolean,
  contactedAdded: boolean,
  setCreateAgent: React.Dispatch<React.SetStateAction<boolean>>,
  SetContactedAdded: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function CreateAgent({ createAgent, setCreateAgent, contactedAdded, SetContactedAdded }: Props) {
  const roles = useInboxStore((s) => s.agentRoles);
  const {
    register,
    handleSubmit,
    formState: { errors }, reset
  } = useForm<Agent>();
  const [request] = useAxios<Agent[]>({
    endpoint: "CREATEAGENT",
    hideErrorMsg: false,
    showSuccessMsg: true
  });
  const agentRole = useInboxStore((s) => s.actions.agentRole);

  // Load roles when component mounts
  useEffect(() => {
    agentRole();
  }, [agentRole]);
  //api call 
  const onSubmit = async (data: Agent) => {
    setCreateAgent(false)
    console.log("Sent successfully", data)
    try {
      const response = await request({
        method: "POST",
        data: data
      });
      console.log("Backend response:", response);
      SetContactedAdded(true);



    } catch (err) {
      alert(err)
      console.error("Error sending data", err)
    }
    //reset
    reset()
  }
 // console.log("roles", roles)


  return (
    <Dialog.Root open={createAgent} onOpenChange={(e) => setCreateAgent(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>

            <Dialog.Header>
              <Dialog.Title>Contact Form</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>

              {/* ✅ FORM START */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4">

                  <Flex gap="15px">
                    <Field.Root>
                      <Field.Label>First Name <span className="text-red-600">*</span></Field.Label>
                      <Input maxLength={30} {...register("firstName")} />
                    </Field.Root><Field.Root>
                      <Field.Label>Last Name <span className="text-red-600">*</span></Field.Label>
                      <Input maxLength={30} {...register("lastName")} />
                    </Field.Root>
                  </Flex>

                  <Field.Root>
                    <Field.Label>Email <span className="text-red-600">*</span></Field.Label>
                    <Input maxLength={30} type="email" {...register("email")} />
                  </Field.Root>

                  <HStack align="start">

                    {/* COUNTRY CODE */}
                    <Field.Root flex="1">
                      <Field.Label>Code</Field.Label>

                      <NativeSelect.Root>
                        <NativeSelect.Field {...register("countryCode", { required: true })}>
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+65">🇸🇬 +65</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                        </NativeSelect.Field>
                      </NativeSelect.Root>

                    </Field.Root>

                    {/* PHONE NUMBER */}
                    <Field.Root flex="3">
                      <Field.Label>Phone Number <span className="text-red-600">*</span></Field.Label>
                      <Input
                        type="tel"
                        placeholder="Enter number"
                        {...register("phoneNumber", {
                          required: true,
                          pattern: /^[0-9]+$/,
                        })}
                      />
                    </Field.Root>

                  </HStack>
                  <Field.Root>
                    <Field.Label>Select a Role for the Agent <span className="text-red-600">*</span></Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        {...register("role", {
                          required: true,
                        })}
                      >

                        <option value="">--Select--</option>
                        {roles.map((role: string, index: number) => (
                          <option key={index} value={role}>
                            {role}
                          </option>
                        ))}

                      </NativeSelect.Field>
                    </NativeSelect.Root>

                  </Field.Root>
                  {/* <Field.Root>
                    <Field.Label>AppointmentTime</Field.Label>
                    <Input {...register("AppointmentTime")} />
                  </Field.Root>
                   <Field.Root>
                    <Field.Label>ContactDealValue</Field.Label>
                    <Input {...register("ContactDealValue")} />
                  </Field.Root> */}

                  <Button type="submit">Submit</Button>

                </Stack>
              </form>
              {/* ✅ FORM END */}

            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <Button variant="outline">X</Button>
              </Dialog.CloseTrigger>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}