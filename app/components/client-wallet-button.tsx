"use client";

import dynamic from "next/dynamic";

export const ClientWalletButton = dynamic(
  async () => {
    const mod = await import("@solana/wallet-adapter-react-ui");
    return mod.WalletMultiButton;
  },
  { ssr: false },
);
