import { AppShell } from "@/components/app-shell";
import { TournamentList } from "@/components/tournament-list";

export default function MyTournamentsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">My Tournaments</h1>
      <p className="mt-2 text-zinc-400">
        Tournaments created by your connected wallet.
      </p>
      <div className="mt-6">
        <TournamentList filter="mine" />
      </div>
    </AppShell>
  );
}
