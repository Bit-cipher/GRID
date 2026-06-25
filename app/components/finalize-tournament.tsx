"use client";

import { useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { getProgram } from "@/lib/program";
import { getPlayerProfilePda } from "@/lib/pda";

export function FinalizeTournament({
  tournamentPda,
  solVaultPda,
}: {
  tournamentPda: PublicKey | null;
  solVaultPda: PublicKey | null;
}) {
  const wallet = useAnchorWallet();
  const [winner, setWinner] = useState("");
  const [status, setStatus] = useState("");

  async function handleFinalize() {
    try {
      if (!wallet) return setStatus("Connect wallet first.");
      if (!tournamentPda || !solVaultPda)
        return setStatus("Select a tournament first.");
      if (!winner) return setStatus("Enter winner wallet address.");

      const winnerPubkey = new PublicKey(winner);
      const winnerProfilePda = getPlayerProfilePda(winnerPubkey);
      const program = getProgram(wallet);

      await program.methods
        .finalizeTournamentSol([winnerPubkey])
        .accounts({
          tournament: tournamentPda,
          solVault: solVaultPda,
          organizer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .remainingAccounts([
          { pubkey: winnerPubkey, isWritable: true, isSigner: false },
          { pubkey: winnerProfilePda, isWritable: true, isSigner: false },
        ])
        .rpc();

      setStatus("Tournament finalized and winner paid.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to finalize tournament.");
    }
  }

  return (
    <div className="space-y-4">
      <input
        className="input"
        placeholder="Winner wallet address"
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
      />

      <button onClick={handleFinalize} className="btn-primary">
        Finalize Tournament
      </button>

      {status && <p className="text-sm text-zinc-400">{status}</p>}
    </div>
  );
}
