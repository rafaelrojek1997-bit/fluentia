import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: { default: "Fluentia — Twój mentor angielskiego", template: "%s | Fluentia" },
  description: "Codzienna, spersonalizowana praktyka angielskiego z mentorem AI.",
  robots: { index: false, follow: false }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#6757e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl" suppressHydrationWarning><body><AppProviders>{children}</AppProviders></body></html>;
}
