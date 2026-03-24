"use client"

import {
  Button,
  Dialog,
  Portal,
  Input,
  Field,
  Stack,
  HStack, NativeSelect,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useEffect } from "react" // ✅ NEW
import useAxios from "@/lib/http/useAxios";
// inside FormPopup.tsx, replace the import line with this:
interface Data {
  id: string;
  contactName: string;
  phoneNumber: string;
  countrycode: string;
  email: string;
  whatsapp_opted: boolean;
  AppointmentTime: string;
  ContactDealValue: string;
  createdOn: string;
  updatedAt: string;
  status: string | null;
  source: string;
  tags: string | null;
  contactTo: string;
  userId: string;
}
interface api {
  name: string,
  email: string,
  country_code: string
  phone_number: string,
  whatsapp_opted_in: boolean,
  AppointmentTime?: "",
  ContactDealValue?: ""
}

interface Props {
  createContact: boolean,
  contactedAdded: boolean,
  setCreateContact: React.Dispatch<React.SetStateAction<boolean>>,
  SetContactedAdded: React.Dispatch<React.SetStateAction<boolean>>,
  // ✅ NEW
  editContact: Data | null,
  setEditContact: React.Dispatch<React.SetStateAction<Data | null>>,
  onLocalUpdate: (updated: Data) => void,
}

export default function FormPopup({
  createContact,
  setCreateContact,
  contactedAdded,
  SetContactedAdded,
  editContact,       // ✅ NEW
  setEditContact,    // ✅ NEW
  onLocalUpdate,     // ✅ NEW
}: Props) {

  // ✅ NEW
  const isEditMode = !!editContact;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // ✅ NEW
  } = useForm<api>();

  const [request] = useAxios<api[]>({
    endpoint: "CREATECONTACT",
    hideErrorMsg: false,
    showSuccessMsg: true
  });

  const added: boolean = true

  // ✅ NEW — auto-fill when editContact is set, clear when null
  useEffect(() => {
    if (editContact) {
      setValue("name", editContact.contactName);
      setValue("email", editContact.email);
      setValue("country_code", editContact.countrycode);
      setValue("phone_number", editContact.phoneNumber.replace(editContact.countrycode, ""));
      setValue("whatsapp_opted_in", editContact.whatsapp_opted);
      setValue("AppointmentTime", editContact.AppointmentTime as any);
      setValue("ContactDealValue", editContact.ContactDealValue as any);
    } else {
      reset();
    }
  }, [editContact]);

  // ✅ NEW — clears editContact + closes dialog cleanly
  function handleClose() {
    setCreateContact(false);
    setEditContact(null);
    reset();
  }

  const onSubmit = async (data: api) => {

    // ✅ NEW — edit mode: update local only, no API
    if (isEditMode && editContact) {
      const updatedContact: Data = {
        ...editContact,
        contactName: data.name,
        email: data.email,
        countrycode: data.country_code,
        phoneNumber: data.country_code + data.phone_number,
        whatsapp_opted: String(data.whatsapp_opted_in) === "true",
        AppointmentTime: data.AppointmentTime || "",
        ContactDealValue: data.ContactDealValue || "",
      };
      onLocalUpdate(updatedContact);
      handleClose();
      return;
    }

    // create mode — existing logic unchanged
    setCreateContact(false)
    console.log("Sent successfully", data)
    try {
      const response = await request({
        method: "POST",
        data: data
      });
      console.log("Backend response:", response);
      SetContactedAdded(!added);
    } catch (err) {
      alert(err)
      console.error("Error sending data", err)
    }
    reset()
  }

  return (
    // ✅ onOpenChange now calls handleClose so editContact is cleared on backdrop click too
    <Dialog.Root open={createContact} onOpenChange={(e) => { if (!e.open) handleClose() }}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>

            <Dialog.Header>
              {/* ✅ title changes based on mode */}
              <Dialog.Title>{isEditMode ? "Edit Contact" : "Contact Form"}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="4">

                  <Field.Root>
                    <Field.Label>Name <span className="text-red-600">*</span></Field.Label>
                    <Input maxLength={30} {...register("name")} />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input maxLength={30} type="email" {...register("email")} />
                  </Field.Root>

                  <HStack align="start">
                    <Field.Root flex="1">
                      <Field.Label>Code</Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field {...register("country_code", { required: true })}>
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+65">🇸🇬 +65</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Field.Root>

                    <Field.Root flex="3">
                      <Field.Label>Phone Number</Field.Label>
                      <Input
                        type="tel"
                        placeholder="Enter number"
                        {...register("phone_number", {
                          required: true,
                          pattern: /^[0-9]+$/,
                        })}
                      />
                    </Field.Root>
                  </HStack>

                  <Field.Root>
                    <Field.Label>Whatsapp Opted *</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field {...register("whatsapp_opted_in", { required: true })}>
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>AppointmentTime</Field.Label>
                    <Input {...register("AppointmentTime")} />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>ContactDealValue</Field.Label>
                    <Input {...register("ContactDealValue")} />
                  </Field.Root>

                  {/* ✅ button label changes based on mode */}
                  <Button type="submit">{isEditMode ? "Update" : "Submit"}</Button>

                </Stack>
              </form>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                {/* ✅ calls handleClose so state is always cleaned up */}
                <Button variant="outline" onClick={handleClose}>X</Button>
              </Dialog.CloseTrigger>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}