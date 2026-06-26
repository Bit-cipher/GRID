/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PublicKey } from "@solana/web3.js";
import { Copy, Trophy } from "lucide-react";

function short(value?: string) {
  if (!value) return "Not selected";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function LiveState({
  state,
  tournamentPda,
  solVaultPda,
}: {
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
        <>
          <div className="grid gap-5 lg:grid-cols-[190px_1fr]">
            <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-950/70 to-black p-4">
              <div className="grid h-36 place-items-center rounded-lg bg-black/40">
                <Trophy className="h-16 w-16 text-violet-300" />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="rounded-md bg-emerald-500/20 px-2 py-1 text-emerald-400">
                  {state.status.toUpperCase()}
                </span>
                <span className="text-zinc-400">
                  {state.currentPlayers}/{state.maxPlayers} Players
                </span>
              </div>
            </div>

            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              <Row label="Title" value={state.title} />
              <Row label="Status" value={state.status.toUpperCase()} green />
              <Row label="Game" value={state.game} />
              <Row
                label="Players"
                value={`${state.currentPlayers}/${state.maxPlayers}`}
              />
              <Row label="Entry Fee" value={`${state.entryFee} SOL`} />
              <Row label="Vault Balance" value={`${state.vaultBalance} SOL`} />
              <Row label="Prize Pool" value={`${state.prizePool} SOL`} />
              <Row label="Organizer" value={short(state.organizer)} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-2">
            <Address label="Tournament PDA" value={tournamentPda?.toBase58()} />
            <Address label="Vault PDA" value={solVaultPda?.toBase58()} />
          </div>
        </>
      ) : (
        <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed border-white/10">
          <div className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-zinc-600" />
            <p className="mt-3 font-semibold">No tournament selected</p>
            <p className="text-sm text-zinc-500">
              Create or select a tournament to view live state.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="border-b border-white/10 pb-3">
      <p className="text-sm text-zinc-500">{label}</p>
      <p
        className={`mt-1 break-all text-sm font-semibold ${
          green ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Address({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-black/30 p-3">
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="font-mono text-xs text-zinc-300">{short(value)}</p>
      </div>

      {value && (
        <button onClick={() => navigator.clipboard.writeText(value)}>
          <Copy size={16} className="text-zinc-500 hover:text-white" />
        </button>
      )}
    </div>
  );
}
