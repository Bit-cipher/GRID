/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";

import { getProgram } from "@/lib/program";
import { getPlatformPda, getSolVaultPda, getTournamentPda } from "@/lib/pda";

export function CreateTournament({
  onTournamentCreated,
}: {
  onTournamentCreated: (tournament: PublicKey, vault: PublicKey) => void;
}) {
  const wallet = useAnchorWallet();

  const [title, setTitle] = useState("Campus FIFA Cup");
  const [game, setGame] = useState("FIFA");
  const [entryFee, setEntryFee] = useState("0.01");
  const [maxPlayers, setMaxPlayers] = useState("2");
  const [status, setStatus] = useState("");

  async function handleCreate() {
    try {
      if (!wallet) return setStatus("Connect wallet first.");

      setStatus("Creating tournament...");

      const program = getProgram(wallet);
      const platformPda = getPlatformPda();

      let platform;

      try {
        platform = await (program.account as any).platformState.fetch(
          platformPda,
        );
      } catch {
        await program.methods
          .initializePlatform(0)
          .accounts({
            platform: platformPda,
            admin: wallet.publicKey,
            treasury: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          } as any)
          .rpc();

        platform = await (program.account as any).platformState.fetch(
          platformPda,
        );
      }

      const tournamentId = BigInt(platform.tournamentCount.toString());
      const tournamentPda = getTournamentPda(wallet.publicKey, tournamentId);
      const solVaultPda = getSolVaultPda(tournamentPda);

      await program.methods
        .createTournament(
          title,
          game,
          new anchor.BN(Math.floor(Number(entryFee) * LAMPORTS_PER_SOL)),
          Number(maxPlayers),
          [10000],
          { sol: {} },
          PublicKey.default,
        )
        .accounts({
          platform: platformPda,
          tournament: tournamentPda,
          organizer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();

      onTournamentCreated(tournamentPda, solVaultPda);
      setStatus("Tournament created successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to create tournament.");
    }
  }

  return (
    <div className="space-y-4">
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="input"
        value={game}
        onChange={(e) => setGame(e.target.value)}
      />
      <input
        className="input"
        value={entryFee}
        onChange={(e) => setEntryFee(e.target.value)}
      />
      <input
        className="input"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(e.target.value)}
      />

      <button onClick={handleCreate} className="btn-primary">
        Create Tournament
      </button>

      {status && <p className="text-sm text-zinc-400">{status}</p>}
    </div>
  );
}
