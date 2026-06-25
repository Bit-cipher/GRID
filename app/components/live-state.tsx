"use client";

import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Trophy } from "lucide-react";

export function LiveState({
  state,
  tournamentPda,
  solVaultPda,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
  tournamentPda: PublicKey | null;
  solVaultPda: PublicKey | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090d16] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">Live Tournament State</h2>
        <span className="flex items-center gap-2 text-sm text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          LIVE
        </span>
      </div>

      {state ? (
        <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
            <div className="grid h-32 place-items-center rounded-lg bg-black/40">
              <Trophy className="h-14 w-14 text-violet-300" />
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <span className="rounded bg-emerald-500/15 px-2 py-1 text-emerald-400">
                {state.status.toUpperCase()}
              </span>
              <span className="text-zinc-400">
                {state.currentPlayers}/{state.maxPlayers}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Title" value={state.title} />
            <Info label="Game" value={state.game} />
            <Info label="Entry Fee" value={`${state.entryFee} SOL`} />
            <Info label="Prize Pool" value={`${state.prizePool} SOL`} />
            <Info label="Vault Balance" value={`${state.vaultBalance} SOL`} />
            <Info
              label="Organizer"
              value={`${state.organizer.slice(0, 6)}...${state.organizer.slice(
                -4,
              )}`}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-zinc-500">
          Select or create a tournament to view live on-chain state.
        </div>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Address label="Tournament PDA" value={tournamentPda?.toBase58()} />
        <Address label="Vault PDA" value={solVaultPda?.toBase58()} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-b border-white/10 pb-3">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold">{value}</p>
    </div>
  );
}

function Address({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl bg-black/30 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="break-all font-mono text-xs text-zinc-400">
        {value || "Not selected"}
      </p>
    </div>
  );
}
