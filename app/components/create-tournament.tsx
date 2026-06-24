"use client";

import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { getProgram } from "@/lib/program";
import { getPlatformPda, getSolVaultPda, getTournamentPda } from "@/lib/pda";

type Props = {
  onTournamentCreated: (tournament: PublicKey, vault: PublicKey) => void;
};

export function CreateTournament({ onTournamentCreated }: Props) {
  const wallet = useAnchorWallet();

  const [title, setTitle] = useState("Campus FIFA Cup");
  const [game, setGame] = useState("FIFA");
  const [entryFee, setEntryFee] = useState("0.01");
  const [maxPlayers, setMaxPlayers] = useState("2");
  const [status, setStatus] = useState("");

  async function handleCreateTournament() {
    try {
      if (!wallet) {
        setStatus("Connect wallet first.");
        return;
      }

      setStatus("Creating tournament...");

      const program = getProgram(wallet as anchor.Wallet);
      const platformPda = getPlatformPda();

      let platform;

      try {
        platform = await program.account.platformState.fetch(platformPda);
      } catch {
        setStatus("Platform not initialized yet. Initializing platform...");

        await program.methods
          .initializePlatform(0)
          .accounts({
            platform: platformPda,
            admin: wallet.publicKey,
            treasury: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)
          .rpc();

        platform = await program.account.platformState.fetch(platformPda);
      }

      const tournamentId = platform.tournamentCount;
      const tournamentPda = getTournamentPda(
        wallet.publicKey,
        BigInt(tournamentId.toString())
      );
      const solVaultPda = getSolVaultPda(tournamentPda);

      const entryFeeLamports = new anchor.BN(
        Math.floor(Number(entryFee) * LAMPORTS_PER_SOL)
      );

      await program.methods
        .createTournament(
          title,
          game,
          entryFeeLamports,
          Number(maxPlayers),
          [10000],
          { sol: {} },
          PublicKey.default
        )
        .accounts({
          platform: platformPda,
          tournament: tournamentPda,
          organizer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .rpc();

      onTournamentCreated(tournamentPda, solVaultPda);

      setStatus(
        `Tournament created: ${tournamentPda.toBase58().slice(0, 8)}...`
      );
    } catch (err) {
      console.error(err);
      setStatus("Failed to create tournament.");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="text-xl font-semibold">Create Tournament</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Organizer creates a SOL tournament and defines the entry fee.
      </p>

      <div className="mt-5 space-y-4">
        <input
          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tournament title"
        />

        <input
          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          placeholder="Game"
        />

        <input
          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          placeholder="Entry fee in SOL"
        />

        <input
          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
          placeholder="Max players"
        />

        <button
          onClick={handleCreateTournament}
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          Create Tournament
        </button>

        {status && <p className="text-sm text-zinc-400">{status}</p>}
      </div>
    </div>
  );
}