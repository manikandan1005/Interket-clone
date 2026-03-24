"use client";

import { Badge, Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useInboxStore } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";

export default function CustomerCard(props: { chatId: string }) {
  const { chatId } = props;
  // console.log("chat id erom nav :" ,chatId)
  const chat = useInboxStore((s) => s.chats.find((c) => c.id === chatId));
  // console.log("chat id erom nav :" ,chat)
  const [open, setOpen] = useState(true);

  const summary = useMemo(() => {
    const orders = chat?.profile?.orders ?? [];
    const totalSpend = chat?.profile?.totalSpend ?? 0;
    const ltv = chat?.profile?.lifetimeValue ?? 0;
    const lastOrder = orders[0];
    return { orders, totalSpend, ltv, lastOrder };
  }, [chat?.profile]);

  if (!chat?.profile) return null;

  return (
    <Box borderWidth="1px" borderRadius="md" bg="panel" p="4" boxShadow="subtle">
      <HStack justify="space-between" mb="2">
        <Text fontWeight="700">Customer</Text>
        <Button size="xs" variant="ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide" : "Show"}
        </Button>
      </HStack>

      <HStack gap="2" wrap="wrap">
        <Badge variant="subtle">{chat.contact.name}</Badge>
        <Badge variant="outline">{chat.contact.phone}</Badge>
        <Badge colorPalette="green" variant="subtle">
          Orders: {summary.orders.length}
        </Badge>
        <Badge colorPalette="brand" variant="subtle">
          Total Spend: ₹{summary.totalSpend.toLocaleString("en-IN")}
        </Badge>
        <Badge variant="subtle">
          LTV: ₹{summary.ltv.toLocaleString("en-IN")}
        </Badge>
      </HStack>

      {open && (
        <Stack mt="3" gap="2">
          <Text fontSize="sm" fontWeight="600">
            Recent orders
          </Text>
          <Stack gap="1.5">
            {summary.orders.slice(0, 4).map((o) => (
              <HStack key={o.id} justify="space-between">
                <Text fontSize="sm">{o.id}</Text>
                <HStack gap="2">
                  <Badge
                    variant="subtle"
                    colorPalette={
                      o.status === "delivered"
                        ? "green"
                        : o.status === "cancelled"
                          ? "red"
                          : "gray"
                    }
                  >
                    {o.status}
                  </Badge>
                  <Text fontSize="sm" color="muted">
                    ₹{o.total.toLocaleString("en-IN")}
                  </Text>
                  <Text fontSize="xs" color="muted">
                    {formatDistanceToNow(new Date(o.createdAt), { addSuffix: true })}
                  </Text>
                </HStack>
              </HStack>
            ))}
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

