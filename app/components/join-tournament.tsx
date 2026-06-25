/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { getProgram, connection } from "@/lib/program";
import { getPlayerProfilePda, getPlayerRegistrationPda } from "@/lib/pda";

export function JoinTournament({
  tournamentPda,
  solVaultPda,
}: {
  tournamentPda: PublicKey | null;
  solVaultPda: PublicKey | null;
}) {
  const wallet = useAnchorWallet();
  const [status, setStatus] = useState("");

  async function handleJoin() {
    try {
      if (!wallet) return setStatus("Connect wallet first.");
      if (!tournamentPda || !solVaultPda)
        return setStatus("Select a tournament first.");

      const program = getProgram(wallet);
      const profilePda = getPlayerProfilePda(wallet.publicKey);
      const registrationPda = getPlayerRegistrationPda(
        tournamentPda,
        wallet.publicKey,
      );

      const existingProfile = await connection.getAccountInfo(profilePda);

      if (!existingProfile) {
        await program.methods
          .createPlayerProfile()
          .accounts({
            playerProfile: profilePda,
            player: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          } as any)
          .rpc();
      }

      await program.methods
        .joinTournamentSol()
        .accounts({
          tournament: tournamentPda,
          playerRegistration: registrationPda,
          solVault: solVaultPda,
          player: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();

      setStatus("Joined tournament successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to join tournament.");
    }
  }

  return (
    <div className="space-y-4">
      <p className="break-all text-sm text-zinc-400">
        Tournament: {tournamentPda?.toBase58() || "None selected"}
      </p>

      <button onClick={handleJoin} className="btn-primary">
        Join Tournament
      </button>

      {status && <p className="text-sm text-zinc-400">{status}</p>}
    </div>
  );
}
