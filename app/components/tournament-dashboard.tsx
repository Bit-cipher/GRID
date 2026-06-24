"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";

import { CreateTournament } from "./create-tournament";
import { JoinTournament } from "./join-tournament";
import { FinalizeTournament } from "./finalize-tournament";
import { CancelRefund } from "./cancel-refund";
import { GRID_PROGRAM_ID } from "@/lib/constants";

export function TournamentDashboard() {
  const [tournamentPda, setTournamentPda] = useState<PublicKey | null>(null);
  const [solVaultPda, setSolVaultPda] = useState<PublicKey | null>(null);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">GRID</h1>
            <p className="mt-2 text-zinc-400">
              The trust layer for competitive gaming.
            </p>
          </div>

          <WalletMultiButton />
        </div>

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-sm text-zinc-500">Devnet Program ID</p>
          <p className="mt-1 break-all font-mono text-sm text-zinc-200">
            {GRID_PROGRAM_ID.toBase58()}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <CreateTournament
            onTournamentCreated={(tournament, vault) => {
              setTournamentPda(tournament);
              setSolVaultPda(vault);
            }}
          />

          <JoinTournament
            tournamentPda={tournamentPda}
            solVaultPda={solVaultPda}
          />

          <FinalizeTournament
            tournamentPda={tournamentPda}
            solVaultPda={solVaultPda}
          />

          <CancelRefund
            tournamentPda={tournamentPda}
            solVaultPda={solVaultPda}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-semibold">Live Tournament State</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-zinc-500">Tournament PDA</p>
              <p className="break-all font-mono text-zinc-200">
                {tournamentPda ? tournamentPda.toBase58() : "Not created yet"}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">SOL Vault PDA</p>
              <p className="break-all font-mono text-zinc-200">
                {solVaultPda ? solVaultPda.toBase58() : "Not created yet"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}