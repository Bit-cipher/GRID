import type { Metadata } from "next";
import "./globals.css";
import { AppWalletProvider } from "@/components/wallet-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "GRID",
  description: "The trust layer for competitive gaming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AppWalletProvider>
      </body>
    </html>
  );
}
