import { AppShell } from "@/components/app-shell";
import { TournamentList } from "@/components/tournament-list";

export default function HistoryPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">History</h1>
      <p className="mt-2 text-zinc-400">Completed and cancelled tournaments.</p>
      <div className="mt-6">
        <TournamentList filter="completed" />
      </div>
    </AppShell>
  );
}
