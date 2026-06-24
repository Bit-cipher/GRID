"use client";

import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { getProgram, connection } from "@/lib/program";
import { getPlayerProfilePda, getPlayerRegistrationPda } from "@/lib/pda";

type Props = {
  tournamentPda: PublicKey | null;
  solVaultPda: PublicKey | null;
};

export function JoinTournament({ tournamentPda, solVaultPda }: Props) {
  const wallet = useAnchorWallet();
  const [status, setStatus] = useState("");
  const [vaultBalance, setVaultBalance] = useState<number | null>(null);

  async function handleJoinTournament() {
    try {
      if (!wallet) {
        setStatus("Connect wallet first.");
        return;
      }

      if (!tournamentPda || !solVaultPda) {
        setStatus("Create a tournament first.");
        return;
      }

      setStatus("Joining tournament...");

      const program = getProgram(wallet as anchor.Wallet);

      const playerProfilePda = getPlayerProfilePda(wallet.publicKey);
      const playerRegistrationPda = getPlayerRegistrationPda(
        tournamentPda,
        wallet.publicKey
      );

      const existingProfile = await connection.getAccountInfo(playerProfilePda);

      if (!existingProfile) {
        setStatus("Creating player profile...");

        await program.methods
          .createPlayerProfile()
          .accounts({
            playerProfile: playerProfilePda,
            player: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          } as any)
          .rpc();
      }

      await program.methods
        .joinTournamentSol()
        .accounts({
          tournament: tournamentPda,
          playerRegistration: playerRegistrationPda,
          solVault: solVaultPda,
          player: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();

      const balance = await connection.getBalance(solVaultPda);
      setVaultBalance(balance / LAMPORTS_PER_SOL);

      setStatus("Joined tournament successfully. Entry fee escrowed.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to join tournament. Check console.");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="text-xl font-semibold">Join Tournament</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Player joins the tournament and deposits SOL into the vault.
      </p>

      <div className="mt-5 space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-xs text-zinc-500">Selected Tournament</p>
          <p className="mt-1 break-all font-mono text-xs text-zinc-300">
            {tournamentPda ? tournamentPda.toBase58() : "No tournament selected"}
          </p>
        </div>

        <button
          onClick={handleJoinTournament}
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          Join Tournament
        </button>

        {vaultBalance !== null && (
          <p className="text-sm text-zinc-400">
            Vault Balance: {vaultBalance.toFixed(4)} SOL
          </p>
        )}

        {status && <p className="text-sm text-zinc-400">{status}</p>}
      </div>
    </div>
  );
}