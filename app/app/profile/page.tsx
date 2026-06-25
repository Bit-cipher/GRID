/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { AppShell } from "@/components/app-shell";
import { getProgram } from "@/lib/program";
import { getPlayerProfilePda } from "@/lib/pda";

export default function ProfilePage() {
  const wallet = useAnchorWallet();
  const [profile, setProfile] = useState<any | null>(null);

  async function load() {
    if (!wallet) return;

    try {
      const program = getProgram(wallet);
      const pda = getPlayerProfilePda(wallet.publicKey);
      const account = await (program.account as any).playerProfile.fetch(pda);
      setProfile(account);
    } catch {
      setProfile(null);
    }
  }

  useEffect(() => {
    load();
  }, [wallet]);

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-2 text-zinc-400">Your on-chain GRID identity.</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#090d16] p-5">
        {wallet ? (
          <>
            <p className="break-all font-mono text-sm text-zinc-400">
              {wallet.publicKey.toBase58()}
            </p>

            {profile ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Wins" value={profile.wins.toNumber()} />
                <Stat label="Trophies" value={profile.trophies.toNumber()} />
                <Stat
                  label="Played"
                  value={profile.tournamentsPlayed.toNumber()}
                />
                <Stat label="Earnings" value={profile.earnings.toNumber()} />
              </div>
            ) : (
              <p className="mt-5 text-zinc-500">No profile found yet.</p>
            )}
          </>
        ) : (
          <p className="text-zinc-500">Connect wallet.</p>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-black/30 p-4">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
