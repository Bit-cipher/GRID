"use client";

import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { getProgram, connection } from "@/lib/program";
import { getPlayerProfilePda } from "@/lib/pda";

type Props = {
  tournamentPda: PublicKey | null;
  solVaultPda: PublicKey | null;
};

export function FinalizeTournament({
  tournamentPda,
  solVaultPda,
}: Props) {
  const wallet = useAnchorWallet();

  const [winner, setWinner] = useState("");
  const [status, setStatus] = useState("");
  const [winnerBalance, setWinnerBalance] = useState<number | null>(null);

  async function handleFinalize() {
    try {
      if (!wallet) {
        setStatus("Connect wallet first.");
        return;
      }

      if (!tournamentPda || !solVaultPda) {
        setStatus("Create a tournament first.");
        return;
      }

      if (!winner) {
        setStatus("Enter winner wallet address.");
        return;
      }

      setStatus("Finalizing tournament...");

      const winnerPubkey = new PublicKey(winner);
      const winnerProfilePda = getPlayerProfilePda(winnerPubkey);

      const program = getProgram(wallet as anchor.Wallet);

      await program.methods
        .finalizeTournamentSol([winnerPubkey])
        .accounts({
          tournament: tournamentPda,
          solVault: solVaultPda,
          organizer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .remainingAccounts([
          {
            pubkey: winnerPubkey,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: winnerProfilePda,
            isWritable: true,
            isSigner: false,
          },
        ])
        .rpc();

      const balance = await connection.getBalance(winnerPubkey);

      setWinnerBalance(balance / LAMPORTS_PER_SOL);

      setStatus("Tournament finalized successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to finalize tournament.");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="text-xl font-semibold">
        Finalize Tournament
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Organizer selects the winner and rewards are paid automatically.
      </p>

      <div className="mt-5 space-y-4">
        <input
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          placeholder="Winner wallet address"
          className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none"
        />

        <button
          onClick={handleFinalize}
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          Finalize & Pay Winner
        </button>

        {winnerBalance !== null && (
          <p className="text-sm text-zinc-400">
            Winner Balance: {winnerBalance.toFixed(4)} SOL
          </p>
        )}

        {status && (
          <p className="text-sm text-zinc-400">{status}</p>
        )}
      </div>
    </div>
  );
}