/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getProgram } from "@/lib/program";
// import { getSolVaultPda } from "@/lib/pda";

export type TournamentItem = {
  pubkey: PublicKey;
  title: string;
  game: string;
  entryFee: number;
  prizePool: number;
  currentPlayers: number;
  maxPlayers: number;
  organizer: string;
  status: string;
  winners: string[];
};

export function TournamentList({
  filter,
  onSelect,
}: {
  filter?: "mine" | "completed";
  onSelect?: (tournament: PublicKey) => void;
}) {
  const wallet = useAnchorWallet();
  const [items, setItems] = useState<TournamentItem[]>([]);

  async function load() {
    if (!wallet) return;

    try {
      const program = getProgram(wallet);
      const accounts = await program.account.tournament.all();

      let mapped: TournamentItem[] = accounts.map((item: any) => {
        const t = item.account;

        return {
          pubkey: item.publicKey,
          title: t.title,
          game: t.game,
          entryFee: t.entryFee.toNumber() / LAMPORTS_PER_SOL,
          prizePool: t.prizePool.toNumber() / LAMPORTS_PER_SOL,
          currentPlayers: t.currentPlayers,
          maxPlayers: t.maxPlayers,
          organizer: t.organizer.toBase58(),
          status: Object.keys(t.status)[0],
          winners: t.winners.map((w: PublicKey) => w.toBase58()),
        };
      });

      if (filter === "mine") {
        mapped = mapped.filter(
          (x) => x.organizer === wallet.publicKey.toBase58(),
        );
      }

      if (filter === "completed") {
        mapped = mapped.filter(
          (x) => x.status === "completed" || x.status === "cancelled",
        );
      }

      setItems(mapped.reverse());
    } catch (err) {
      console.warn("Failed to load tournaments:", err);

      // Ignore rate-limit errors so UI doesn't crash
      if (
        String(err).includes("429") ||
        String(err).includes("Too many requests")
      ) {
        return;
      }
    }
  }

  useEffect(() => {
    load();

    const i = setInterval(load, 20000);

    return () => clearInterval(i);
  }, [wallet]);

  if (!wallet) {
    return <Empty text="Connect wallet to fetch tournaments from chain." />;
  }

  if (!items.length) {
    return <Empty text="No tournaments found yet." />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <button
          key={item.pubkey.toBase58()}
          onClick={() => onSelect?.(item.pubkey)}
          className="w-full rounded-2xl border border-white/10 bg-[#090d16] p-4 text-left transition hover:border-violet-500/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-zinc-500">{item.game}</p>
            </div>

            <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-300">
              {item.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-zinc-400">
            <div>
              <p className="text-zinc-600">Players</p>
              <p>
                {item.currentPlayers}/{item.maxPlayers}
              </p>
            </div>
            <div>
              <p className="text-zinc-600">Entry</p>
              <p>{item.entryFee} SOL</p>
            </div>
            <div>
              <p className="text-zinc-600">Pool</p>
              <p>{item.prizePool} SOL</p>
            </div>
          </div>

          <p className="mt-4 break-all font-mono text-xs text-zinc-600">
            {item.pubkey.toBase58()}
          </p>
        </button>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#090d16] p-8 text-center text-zinc-500">
      {text}
    </div>
  );
}
