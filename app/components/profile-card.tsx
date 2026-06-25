"use client";

import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function ProfileCard() {
  const wallet = useAnchorWallet();

  return (
    <div className="rounded-2xl border border-white/10 bg-[#090d16] p-5">
      <h2 className="text-xl font-bold">Player Profile</h2>

      <div className="mt-5">
        <div className="h-20 w-20 rounded-full bg-violet-500/20" />

        <p className="mt-4 font-semibold">
          {wallet
            ? `${wallet.publicKey.toBase58().slice(0, 8)}...`
            : "Not Connected"}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat label="Wins" value="0" />
          <Stat label="Losses" value="0" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/30 p-4">
      <p className="text-zinc-500">{label}</p>

      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}
