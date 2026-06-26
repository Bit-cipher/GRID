/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

import { getProgram, connection } from "@/lib/program";
import { getPlayerProfilePda, getPlayerRegistrationPda } from "@/lib/pda";

export function JoinTournament({
  tournamentPda,
  solVaultPda,
  onSuccess,
}: {
  tournamentPda: PublicKey | null;
  solVaultPda: PublicKey | null;
  onSuccess?: () => void;
}) {
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    try {
      if (!wallet) return toast.error("Connect wallet first.");
      if (!tournamentPda || !solVaultPda) {
        return toast.error("Select a tournament first.");
      }

      setLoading(true);
      toast.loading("Preparing tournament join...", { id: "join" });

      const program = getProgram(wallet);
      const profilePda = getPlayerProfilePda(wallet.publicKey);
      const registrationPda = getPlayerRegistrationPda(
        tournamentPda,
        wallet.publicKey,
      );

      const existingProfile = await connection.getAccountInfo(profilePda);

      if (!existingProfile) {
        toast.loading("Creating player profile...", { id: "join" });

        await program.methods
          .createPlayerProfile()
          .accounts({
            playerProfile: profilePda,
            player: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          } as any)
          .rpc();
      }

      toast.loading("Joining tournament and escrowing SOL...", { id: "join" });

      const sig = await program.methods
        .joinTournamentSol()
        .accounts({
          tournament: tournamentPda,
          playerRegistration: registrationPda,
          solVault: solVaultPda,
          player: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();

      toast.success("Joined tournament successfully.", {
        id: "join",
        description: sig.slice(0, 12) + "...",
      });

      onSuccess?.();
    } catch (err: any) {
      console.error(err);

      if (String(err).includes("already in use")) {
        toast.error("You already joined this tournament.", { id: "join" });
      } else {
        toast.error("Failed to join tournament.", { id: "join" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="break-all text-sm text-zinc-400">
        Tournament: {tournamentPda?.toBase58() || "None selected"}
      </p>

      <button disabled={loading} onClick={handleJoin} className="btn-primary">
        {loading ? "Joining..." : "Join Tournament"}
      </button>
    </div>
  );
}