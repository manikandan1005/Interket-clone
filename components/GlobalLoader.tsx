"use client";
import { useEffect, useState } from "react";
import { subscribe } from "@/lib/http/loader";
import { Box, Center, Spinner } from "@chakra-ui/react";

export default function GlobalLoader() {
  const [pending, setPending] = useState(0);
  useEffect(() => {
    const unsubscribe = subscribe(setPending);
    return () => {
      unsubscribe();
    };
  }, []);
  if (pending <= 0) return null;
  return (
    <Box position="fixed" inset="0" zIndex="overlay">
      <Center w="100%" h="100%">
        <Spinner size="xl" />
      </Center>
    </Box>
  );
}
