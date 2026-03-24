"use client";

import {
  Box,
  Button,
  HStack,
  IconButton,
  Portal,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Menu } from "@chakra-ui/react";
import {
  ChevronDownIcon,
  FaceIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { FiPaperclip } from "react-icons/fi";
import { useMemo, useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInboxStore } from "@/lib/store";
import useAxios from "@/lib/http/useAxios";
import { useLogin } from "@/lib/loginStore";
import { MessageType } from "@/lib/types";
import TempFieldSelector from "@/app/inbox/TempFieldSelector";

const schema = z.object({
  text: z.string().trim().min(1, "Message required").max(2000),
});

type FormValues = z.infer<typeof schema>;

const EMOJIS = ["😊", "👍", "🙏", "🎉", "😅", "✅", "🚚", "❤️", "😕", "📦"];

export default function Composer(props: { chatId: string }) {
  const { chatId } = props;

  const approvedTemplates = useLogin((i) => i.approvedTemplates);
  const tempList = useMemo(
    () => approvedTemplates.map((t) => ({ id: t.id, name: t.name })),
    [approvedTemplates]
  );

  const [showTemplateConfig, setShowTemplateConfig] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      useLogin.getState().fetchTemplates();
    }
  }, []);

  const [request] = useAxios({
    endpoint: "SENDMESSAGE",
    hideErrorMsg: false,
  });

  const quickReplies = useInboxStore((s) => s.quickReplies);
  const sendMessage = useInboxStore((s) => s.actions.sendMessage);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { text: "" },
  });

  const text = watch("text");

  const canSend = useMemo(
    () => text.trim().length > 0 && !isSubmitting,
    [text, isSubmitting]
  );

  // 1. TEXT MESSAGE SUBMIT
  const onSubmit = handleSubmit(async (values) => {
    const textValue = values.text.trim();
    const chat = useInboxStore.getState().chats.find((c) => c.id === chatId);

    sendMessage(chatId, {
      sender: "agent",
      type: "text",
      time: new Date().toISOString(),
      text: textValue,
    });

    try {
      await request({
        method: "POST",
        params: { phone: chat?.contact.phone },
        data: {
          chatId,
          message: textValue,
          direction: "outbound",
        },
      });
      reset({ text: "" });
      setShowTemplateConfig(false);
      setSelectedTemplateId(null);
    } catch (err) {
      console.error("Text send failed", err);
    }
  });

  // 2. FILE / IMAGE / VIDEO SUBMIT (FormData)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const chat = useInboxStore.getState().chats.find((c) => c.id === chatId);
    const phone = chat?.contact.phone;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    const messageType: MessageType = isImage
      ? "image"
      : isVideo
      ? "video"
      : "document";

    const previewUrl =
      isImage || isVideo ? URL.createObjectURL(file) : undefined;

    sendMessage(chatId, {
      sender: "agent",
      type: messageType,
      time: new Date().toISOString(),
      fileName: file.name,
      fileUrl: previewUrl,
      text: file.name,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", chatId);
    formData.append("direction", "outbound");
    formData.append("messageType", messageType);

    try {
      await request({
        method: "POST",
        params: { phone },
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.error("File upload failed", err);
    }

    e.target.value = "";
  };

  return (
    <Box p="3" borderTop="1px solid" borderColor="gray.200">
      <Stack gap="2">
        {/* ACTION BAR */}
        <HStack justify="space-between">
          <HStack gap="2">
            <input
              type="file"
              ref={fileRef}
              hidden
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx"
            />

            <IconButton
              aria-label="Attach"
              variant="ghost"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <FiPaperclip />
            </IconButton>

            {/* TEMPLATE MENU */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                  Use Template <ChevronDownIcon />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content maxH="200px" minW="10rem">
                    {tempList.length === 0 ? (
                      <Menu.Item value="empty" disabled>
                        No approved templates
                      </Menu.Item>
                    ) : (
                      tempList.map((item) => (
                        <Menu.Item
                          key={item.id}
                          value={item.id}
                          onClick={() => {
                            setSelectedTemplateId(item.id);
                            setShowTemplateConfig(true);
                          }}
                        >
                          {item.name}
                        </Menu.Item>
                      ))
                    )}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {/* QUICK REPLIES */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                  Quick Reply <ChevronDownIcon />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    {quickReplies.map((qr) => (
                      <Menu.Item
                        key={qr}
                        value={qr}
                        onClick={() =>
                          setValue("text", qr, { shouldDirty: true })
                        }
                      >
                        {qr}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {/* EMOJIS */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton variant="ghost" size="sm">
                  <FaceIcon />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <HStack p="2" wrap="wrap" maxW="220px">
                      {EMOJIS.map((e) => (
                        <Button
                          key={e}
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                            setValue("text", `${watch("text") ?? ""}${e}`, {
                              shouldDirty: true,
                            })
                          }
                        >
                          {e}
                        </Button>
                      ))}
                    </HStack>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>

          <Button
            colorPalette="blue"
            size="sm"
            onClick={onSubmit}
            disabled={!canSend}
            loading={isSubmitting}
          >
            Send <PaperPlaneIcon style={{ marginLeft: "8px" }} />
          </Button>
        </HStack>

        {/* TEXT AREA */}
        <Textarea
          placeholder="Write a message…"
          resize="none"
          minH="48px"
          maxH="160px"
          {...register("text")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
      </Stack>

      {/* Show TempFieldSelector only when a template is clicked */}
      {showTemplateConfig && (
        <TempFieldSelector
          setShowTemplateConfig={setShowTemplateConfig}
          templateId={selectedTemplateId}
        />
      )}
    </Box>
  );
}