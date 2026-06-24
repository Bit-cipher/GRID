"use client";

import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { getProgram, connection } from "@/lib/program";
import { getPlayerRegistrationPda } from "@/lib/pda";

type Props = {
  tournamentPda: PublicKey | null;
  solVaultPda: PublicKey | null;
};

export function CancelRefund({ tournamentPda, solVaultPda }: Props) {
  const wallet = useAnchorWallet();

  const [status, setStatus] = useState("");
  const [refundBalance, setRefundBalance] = useState<number | null>(null);

  async function handleCancelTournament() {
    try {
      if (!wallet) {
        setStatus("Connect wallet first.");
        return;
      }

      if (!tournamentPda) {
        setStatus("Create a tournament first.");
        return;
      }

      setStatus("Cancelling tournament...");

      const program = getProgram(wallet as anchor.Wallet);

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

  async function handleClaimRefund() {
    try {
      if (!wallet) {
        setStatus("Connect wallet first.");
        return;
      }

      if (!tournamentPda || !solVaultPda) {
        setStatus("Create and join a tournament first.");
        return;
      }

      setStatus("Claiming refund...");

      const program = getProgram(wallet as anchor.Wallet);

      const playerRegistrationPda = getPlayerRegistrationPda(
        tournamentPda,
        wallet.publicKey
      );

      await program.methods
        .claimRefundSol()
        .accounts({
          tournament: tournamentPda,
          playerRegistration: playerRegistrationPda,
          solVault: solVaultPda,
          player: wallet.publicKey,
        } as any)
        .rpc();

      const balance = await connection.getBalance(wallet.publicKey);
      setRefundBalance(balance / LAMPORTS_PER_SOL);

      setStatus("Refund claimed successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to claim refund.");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="text-xl font-semibold">Cancel / Refund</h2>

      <p className="mt-1 text-sm text-zinc-500">
        Organizer can cancel a tournament, then players can claim their SOL
        refund.
      </p>

      <div className="mt-5 space-y-4">
        <button
          onClick={handleCancelTournament}
          className="w-full rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-900"
        >
          Cancel Tournament
        </button>

        <button
          onClick={handleClaimRefund}
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          Claim Refund
        </button>

        {refundBalance !== null && (
          <p className="text-sm text-zinc-400">
            Wallet Balance After Refund: {refundBalance.toFixed(4)} SOL
          </p>
        )}

        {status && <p className="text-sm text-zinc-400">{status}</p>}
      </div>
    </div>
  );
}