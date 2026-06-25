import { AppShell } from "@/components/app-shell";
import { TournamentList } from "@/components/tournament-list";

export default function TournamentsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Tournaments</h1>
      <p className="mt-2 text-zinc-400">All tournaments fetched from chain.</p>
      <div className="mt-6">
        <TournamentList />
      </div>
    </AppShell>
  );
}
