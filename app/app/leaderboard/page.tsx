import { AppShell } from "@/components/app-shell";

export default function LeaderboardPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <p className="mt-2 text-zinc-400">
        Leaderboard will become fully available once profile updates are
        finalized on-chain.
      </p>
    </AppShell>
  );
}
