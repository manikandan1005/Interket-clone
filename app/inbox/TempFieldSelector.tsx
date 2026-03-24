"use client";

import { useState } from "react";
import { useInboxStore } from "@/lib/store";

import {
  Box,
  Button,
  HStack, Flex,
  IconButton,
  Stack,
  Text,
  Badge,
  Collapsible,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  X,
} from "lucide-react";
import { useLogin } from "@/lib/loginStore";
import useAxios from "@/lib/http/useAxios";
import { selectedctid } from "@/lib/inboxService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversationData {
  id: string;
  channel: string;
  status: string;
  assignee: string | undefined;
  contact: {
    name: string;
    phone: string;
  };
  labels: string[];
  lastActivity: string;
  lastMessage: {
    text: string;
    time: string;
    isMine: boolean;
  };
  tags: string[];
  unread: number;
}

interface Props {
  setShowTemplateConfig: React.Dispatch<React.SetStateAction<boolean>>;
  conversationData?: ConversationData;
  templateId: string | null;
}

interface VariableConfig {
  variable: string;
  prefix: string;
}

// ─── Contact Field → Conversation Data mapping ────────────────────────────────

type ContactFieldKey =
  | "id"
  | "User Id"
  | "Phone Number"
  | "Email"
  | "Name"
  | "Tags"
  | "Creation Date"
  | "Country Code";

function resolveContactFieldValue(
  field: ContactFieldKey | string,
  data?: ConversationData
): string {
  if (!data) return "";
  switch (field) {
    case "id":
      return data.id ?? "";
    case "User Id":
      return data.id ?? "";
    case "Phone Number":
      return data.contact?.phone ?? "";
    case "Email":
      return "";
    case "Name":
      return data.contact?.name ?? "";
    case "Tags":
      return data.tags?.join(", ") ?? "";
    case "Creation Date":
      return data.lastActivity
        ? new Date(data.lastActivity).toLocaleDateString()
        : "";
    case "Country Code":
      return data.contact?.phone?.slice(0, 2) ?? "";
    default:
      return "";
  }
}

// ─── Contact Fields list ──────────────────────────────────────────────────────

const CONTACT_FIELDS = ["id","AccountOwner","AppointmentTime","ContactDealValue","contactName","countrycode","createdOn","email","phoneNumber","tags","updatedAt","userId","whatsapp_opted"];

// ─── Parse variables from template content ────────────────────────────────────

function parseVariables(content: string): VariableConfig[] {
  const regex = /(\S+)?\s*\{\{(\d+)\}\}/g;
  const results: VariableConfig[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({
      variable: match[2],
      prefix: match[1] ?? "",
    });
  }
  return results;
}

// ─── Variable Row ─────────────────────────────────────────────────────────────

function VariableRow({
  variable,
  prefix,
  conversationData,
  value,
  onChange,
}: VariableConfig & {
  conversationData?: ConversationData;
  value: string;
  onChange: (val: string) => void;
}) {
  const varTag = `{{${variable}}}`;

  return (
    <Box
      py={3}
      borderBottom="1px solid"
      borderColor="gray.100"
      _last={{ borderBottom: "none" }}
    >
      <HStack gap={3} align="center">
        {/* Label chip */}
        <Box
          flexShrink={0}
          px={3}
          py={1.5}
          bg="gray.100"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          minW="110px"
          textAlign="center"
        >
          <Text as="span" fontSize="sm" color="gray.600" fontFamily="mono">
            {prefix}{" "}
            <Text as="span" color="teal.600" fontWeight="700">
              {varTag}
            </Text>
          </Text>
        </Box>

        {/* Select dropdown */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            width: "100%",
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "white",
            color: value ? "#1a202c" : "#a0aec0",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="">Choose Contact Field</option>
          {CONTACT_FIELDS.map((field) => {
            const resolved = resolveContactFieldValue(field, conversationData);
            return (
              <option key={field} value={resolved || field}>
                {field}{resolved ? ` — ${resolved}` : ""}
              </option>
            );
          })}
        </select>
      </HStack>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TempFieldSelector({
  setShowTemplateConfig,
  conversationData,
  templateId,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [request] = useAxios({ endpoint: "SENDTEMPLATEMESSAGE" });

  const template = useLogin((i) =>
    i.approvedTemplates.find((t) => t.id === templateId)
  );

  const VARIABLES: VariableConfig[] = template?.content
    ? parseVariables(template.content)
    : [];

  const [values, setValues] = useState<string[]>(() =>
    VARIABLES.map(() => "")
  );

  const updateValue = (index: number, val: string) =>
    setValues((prev) => prev.map((v, i) => (i === index ? val : v)));

  function onClose() {
    setShowTemplateConfig(false);
  }

  async function sendTemplateId() {
    const customerId = selectedctid || conversationData?.id;

    const payload = {
      customerId,
      templateId,
      variables: values,
    };

    await request({ data: payload });
  }

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={50}
      bg="blackAlpha.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      onClick={onClose}
    >
      <Box
        w="full"
        maxW="680px"
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        shadow="2xl"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <HStack
          justify="space-between"
          px={6}
          py={4}
          borderBottom="1px solid"
          borderColor="gray.100"
          bg="gray.50"
        >
          <Stack gap={0}>
            <Text fontSize="lg" fontWeight="800" color="gray.800" letterSpacing="tight">
              Conversation Starter Template
            </Text>
            <Text fontSize="xs" color="gray.500">
              Configure dynamic variables for your WhatsApp message template
            </Text>
          </Stack>

          <IconButton
            className="bg-red-600!"
            aria-label="Close"
            variant="ghost"
            size="sm"
            color="gray.400"
            _hover={{ bg: "gray.100", color: "gray.700" }}
            onClick={onClose}
          >
            <X size={18} />
          </IconButton>
        </HStack>

        {/* Contact data summary strip */}
        {conversationData && (
          <HStack
            px={6}
            py={2.5}
            bg="teal.50"
            borderBottom="1px solid"
            borderColor="teal.100"
            gap={4}
            flexWrap="wrap"
          >
            <HStack gap={1.5}>
              <Text fontSize="xs" color="teal.500" fontWeight="600">Name:</Text>
              <Text fontSize="xs" color="teal.800" fontWeight="500">
                {conversationData.contact?.name || "—"}
              </Text>
            </HStack>
            <Box w="1px" h="12px" bg="teal.200" />
            <HStack gap={1.5}>
              <Text fontSize="xs" color="teal.500" fontWeight="600">Phone:</Text>
              <Text fontSize="xs" color="teal.800" fontWeight="500">
                {conversationData.contact?.phone || "—"}
              </Text>
            </HStack>
            <Box w="1px" h="12px" bg="teal.200" />
            <HStack gap={1.5}>
              <Text fontSize="xs" color="teal.500" fontWeight="600">Channel:</Text>
              <Text fontSize="xs" color="teal.800" fontWeight="500">
                {conversationData.channel || "—"}
              </Text>
            </HStack>
          </HStack>
        )}

        {/* Collapsible body */}
        <Collapsible.Root
          open={!collapsed}
          onOpenChange={(e) => setCollapsed(!e.open)}
        >
          <Collapsible.Trigger asChild>
            <HStack
              as="button"
              w="full"
              justify="space-between"
              px={6}
              py={4}
              bg="gray.50"
              borderBottom="1px solid"
              borderColor="gray.100"
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              transition="background 0.15s"
            >
              <Text
                fontSize="xs"
                fontWeight="700"
                color="gray.600"
                letterSpacing="widest"
                textTransform="uppercase"
              >
                Configure Body Variable
              </Text>
              {collapsed ? (
                <ChevronDownIcon size={16} color="#94a3b8" />
              ) : (
                <ChevronUpIcon size={16} color="#94a3b8" />
              )}
            </HStack>
          </Collapsible.Trigger>

          <Collapsible.Content className="min-h-60! overflow-auto overflow-y-scroll">
            <Box px={6} pb={2}>
              {VARIABLES.length === 0 ? (
                <Text py={4} fontSize="sm" color="gray.400" textAlign="center">
                  No variables found in this template.
                </Text>
              ) : (
                VARIABLES.map((v, i) => (
                  <VariableRow
                    key={v.variable}
                    {...v}
                    conversationData={conversationData}
                    value={values[i]}
                    onChange={(val) => updateValue(i, val)}
                  />
                ))
              )}
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Bottom badge */}
        <HStack px={6} py={3} borderTop="1px solid" borderColor="gray.100">
          <Flex w="full" justifyContent="space-between">
            <Badge
              variant="outline"
              fontSize="xs"
              color="gray.400"
              borderColor="gray.200"
              bg="white"
              px={3}
              py={1}
              borderRadius="full"
            >
              {VARIABLES.length} variables configured
            </Badge>
            <Button onClick={sendTemplateId}>Send</Button>
          </Flex>
        </HStack>
      </Box>
    </Box>
  );
}