/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { getProgram } from "@/lib/program";
import { getPlayerRegistrationPda } from "@/lib/pda";

export function CancelRefund({
  tournamentPda,
  solVaultPda,
}: {
  tournamentPda: PublicKey | null;
  solVaultPda: PublicKey | null;
}) {
  const wallet = useAnchorWallet();
  const [status, setStatus] = useState("");

  async function handleCancel() {
    try {
      if (!wallet) return setStatus("Connect wallet first.");
      if (!tournamentPda) return setStatus("Select a tournament first.");

      const program = getProgram(wallet);

      await program.methods
        .cancelTournament()
        .accounts({
          tournament: tournamentPda,
          organizer: wallet.publicKey,
        } as any)
        .rpc();

      setStatus("Tournament cancelled successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to cancel tournament.");
    }
  }

  async function handleRefund() {
    try {
      if (!wallet) return setStatus("Connect wallet first.");
      if (!tournamentPda || !solVaultPda)
        return setStatus("Select a tournament first.");

      const program = getProgram(wallet);
      const registrationPda = getPlayerRegistrationPda(
        tournamentPda,
        wallet.publicKey,
      );

      await program.methods
        .claimRefundSol()
        .accounts({
          tournament: tournamentPda,
          playerRegistration: registrationPda,
          solVault: solVaultPda,
          player: wallet.publicKey,
        } as any)
        .rpc();

      setStatus("Refund claimed successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to claim refund.");
    }
  }

  return (
    <div className="space-y-4">
      <button onClick={handleCancel} className="btn-danger">
        Cancel Tournament
      </button>

      <button onClick={handleRefund} className="btn-primary">
        Claim Refund
      </button>

      {status && <p className="text-sm text-zinc-400">{status}</p>}
    </div>
  );
}
