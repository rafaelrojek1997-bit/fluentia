"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { DemoProvider } from "@/lib/demo-store";
import { AuthProvider } from "@/lib/auth";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }));
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem><QueryClientProvider client={client}><AuthProvider><DemoProvider>{children}</DemoProvider></AuthProvider></QueryClientProvider></ThemeProvider>;
}
