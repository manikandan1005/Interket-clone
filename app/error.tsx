"use client";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    toast.error(error.message || "Something went wrong", { duration: 6000 });
  }, [error]);
  return (
    <VStack minH="100vh" align="center" justify="center" gap="4">
      <Heading size="md">Something went wrong</Heading>
      <Text>Try again or return to the login page.</Text>
      <Box>
        <Button onClick={reset} mr="2">Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/login")}>Go to login</Button>
      </Box>
    </VStack>
  );
}
