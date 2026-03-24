"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { system } from "@/theme";

export default function Providers(props: { children: ReactNode }) {
  const { children } = props;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ChakraProvider value={system}>
        <QueryClientProvider client={queryClient}>
          {children}
          <SonnerToaster position="top-right" richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}
