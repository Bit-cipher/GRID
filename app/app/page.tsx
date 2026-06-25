/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { AppShell } from "@/components/app-shell";
import { LiveState } from "@/components/live-state";
import { QuickActions } from "@/components/quick-actions";
import { TournamentList } from "@/components/tournament-list";
import { Modal } from "@/components/ui/modal";

import { CreateTournament } from "@/components/create-tournament";
import { JoinTournament } from "@/components/join-tournament";
import { FinalizeTournament } from "@/components/finalize-tournament";
import { CancelRefund } from "@/components/cancel-refund";


import { getProgram, connection } from "@/lib/program";
import { getSolVaultPda } from "@/lib/pda";

export default function DashboardPage() {
  const wallet = useAnchorWallet();

  const [tournamentPda, setTournamentPda] = useState<PublicKey | null>(null);
  const [solVaultPda, setSolVaultPda] = useState<PublicKey | null>(null);
  const [state, setState] = useState<any | null>(null);
  const [modal, setModal] = useState<
    null | "create" | "join" | "finalize" | "cancel"
  >(null);

  async function fetchState() {
    if (!wallet || !tournamentPda) return;

    try {
      const program = getProgram(wallet);
      const tournament = await (program.account as any).tournament.fetch(
        tournamentPda,
      );
      const vault = solVaultPda ? await connection.getBalance(solVaultPda) : 0;

      setState({
        title: tournament.title,
        game: tournament.game,
        entryFee: tournament.entryFee.toNumber() / LAMPORTS_PER_SOL,
        prizePool: tournament.prizePool.toNumber() / LAMPORTS_PER_SOL,
        currentPlayers: tournament.currentPlayers,
        maxPlayers: tournament.maxPlayers,
        organizer: tournament.organizer.toBase58(),
        status: Object.keys(tournament.status)[0],
        winners: tournament.winners.map((w: PublicKey) => w.toBase58()),
        vaultBalance: vault / LAMPORTS_PER_SOL,
      });
    } catch {}
  }

  useEffect(() => {
    const t = setTimeout(fetchState, 0);
    const i = setInterval(fetchState, 3000);
    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, [wallet, tournamentPda, solVaultPda]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold md:text-4xl">Tournament Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Create, join, and manage tournaments on-chain.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Status"
            value={state ? state.status.toUpperCase() : "READY"}
          />
          <Stat
            label="Prize Pool"
            value={`${state ? state.prizePool : 0} SOL`}
          />
          <Stat
            label="Players"
            value={
              state ? `${state.currentPlayers}/${state.maxPlayers}` : "0/0"
            }
          />
          <Stat label="Winners" value={state ? state.winners.length : 0} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <LiveState
            state={state}
            tournamentPda={tournamentPda}
            solVaultPda={solVaultPda}
          />

          <QuickActions
            onCreate={() => setModal("create")}
            onJoin={() => setModal("join")}
            onFinalize={() => setModal("finalize")}
            onCancel={() => setModal("cancel")}
          />
        </section>

        <section className="mt-6">
          <h2 className="mb-4 text-xl font-bold">On-Chain Tournaments</h2>
          <TournamentList
            onSelect={(tournament) => {
              setTournamentPda(tournament);
              setSolVaultPda(getSolVaultPda(tournament));
            }}
          />
        </section>

        <Modal
          open={modal === "create"}
          title="Create Tournament"
          onClose={() => setModal(null)}
        >
          <CreateTournament
            onTournamentCreated={(tournament, vault) => {
              setTournamentPda(tournament);
              setSolVaultPda(vault);
              setModal(null);
            }}
          />
        </Modal>

        <Modal
          open={modal === "join"}
          title="Join Tournament"
          onClose={() => setModal(null)}
        >
          <JoinTournament
            tournamentPda={tournamentPda}
            solVaultPda={solVaultPda}
          />
        </Modal>

        <Modal
          open={modal === "finalize"}
          title="Finalize Tournament"
          onClose={() => setModal(null)}
        >
          <FinalizeTournament
            tournamentPda={tournamentPda}
            solVaultPda={solVaultPda}
          />
        </Modal>

        <Modal
          open={modal === "cancel"}
          title="Cancel / Refund"
          onClose={() => setModal(null)}
        >
          <CancelRefund
            tournamentPda={tournamentPda}
            solVaultPda={solVaultPda}
          />
        </Modal>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090d16] p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <h2 className="mt-2 text-2xl font-bold">{value}</h2>
    </div>
  );
}
