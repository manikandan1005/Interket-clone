"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Provider(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </ThemeProvider>
  );
}

