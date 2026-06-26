/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Trophy, Coins, Users, Crown } from "lucide-react";

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
  const [summary, setSummary] = useState({
    tournaments: 0,
    prizePool: 0,
    players: 0,
    wins: 0,
  });
  const [modal, setModal] = useState<
    null | "create" | "join" | "finalize" | "cancel"
  >(null);

  async function fetchSummary() {
    if (!wallet) return;

    try {
      const program = getProgram(wallet);
      const tournaments = await (program.account as any).tournament.all();

      const totalPrize = tournaments.reduce((acc: number, item: any) => {
        return acc + item.account.prizePool.toNumber() / LAMPORTS_PER_SOL;
      }, 0);

      const totalPlayers = tournaments.reduce((acc: number, item: any) => {
        return acc + item.account.currentPlayers;
      }, 0);

      setSummary({
        tournaments: tournaments.length,
        prizePool: totalPrize,
        players: totalPlayers,
        wins: 0,
      });
    } catch {}
  }

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
    const t = setTimeout(() => {
      fetchSummary();
      fetchState();
    }, 500);

    const i = setInterval(() => {
      fetchSummary();
      fetchState();
    }, 12000);

    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, [wallet, tournamentPda, solVaultPda]);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 2xl:grid-cols-[1fr_340px]">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Tournament Dashboard
            </h1>
            <p className="mt-2 text-zinc-400">
              Create, join, and manage tournaments on-chain.
            </p>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat
                icon={<Trophy />}
                label="Total Tournaments"
                value={summary.tournaments}
                sub="from chain"
              />
              <Stat
                icon={<Coins />}
                label="Total Prize Pool"
                value={`${summary.prizePool.toFixed(3)} SOL`}
                sub="escrowed total"
              />
              <Stat
                icon={<Users />}
                label="Total Players"
                value={summary.players}
                sub="registered joins"
              />
              <Stat
                icon={<Crown />}
                label="Your Wins"
                value={summary.wins}
                sub="profile based"
              />
            </section>

            <section className="mt-6">
              <LiveState
                state={state}
                tournamentPda={tournamentPda}
                solVaultPda={solVaultPda}
              />
            </section>
          </div>

          <aside className="space-y-5">
            <WalletPanel />
            <QuickActions
              onCreate={() => setModal("create")}
              onJoin={() => setModal("join")}
              onFinalize={() => setModal("finalize")}
              onCancel={() => setModal("cancel")}
            />
          </aside>
        </div>

        <section className="mt-6">
          <h2 className="mb-4 text-xl font-bold">On-Chain Tournaments</h2>
          <TournamentList
            onSelect={(tournament) => {
              setTournamentPda(tournament);
              setSolVaultPda(getSolVaultPda(tournament));
            }}
          />
        </section>

        <Footer />

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

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090d16] p-5">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
        {icon}
      </div>
      <p className="text-sm text-zinc-500">{label}</p>
      <h2 className="mt-1 text-2xl font-bold">{value}</h2>
      <p className="mt-2 text-xs text-emerald-400">{sub}</p>
    </div>
  );
}

function WalletPanel() {
  const wallet = useAnchorWallet();

  return (
    <div className="rounded-2xl border border-white/10 bg-[#090d16] p-5">
      <h2 className="text-xl font-bold">Wallet</h2>

      <div className="mt-5 rounded-xl bg-gradient-to-br from-violet-500/20 to-black p-4">
        <p className="text-sm text-zinc-500">Connected Wallet</p>
        <p className="mt-2 break-all font-mono text-sm">
          {wallet
            ? `${wallet.publicKey.toBase58().slice(0, 6)}...${wallet.publicKey
                .toBase58()
                .slice(-4)}`
            : "Not connected"}
        </p>

        <button
          disabled={!wallet}
          onClick={() =>
            wallet &&
            window.open(
              `https://explorer.solana.com/address/${wallet.publicKey.toBase58()}?cluster=devnet`,
              "_blank",
            )
          }
          className="mt-5 w-full rounded-xl border border-violet-500/40 bg-violet-500/10 py-3 text-sm text-violet-200 disabled:opacity-50"
        >
          View on Explorer
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-8 rounded-2xl border border-white/10 bg-[#090d16] p-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Foot title="Built on Solana" text="Fast settlement and low fees." />
        <Foot title="Auditable" text="Tournament state is on-chain." />
        <Foot title="Secure" text="Funds are held in program vaults." />
        <Foot title="Fair" text="Rewards follow program logic." />
      </div>
    </footer>
  );
}

function Foot({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{text}</p>
    </div>
  );
}
