"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClientWalletButton } from "@/components/client-wallet-button";
import { Home, Trophy, History, Crown, User, BarChart3 } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/my-tournaments", label: "My Tournaments", icon: Crown },
  { href: "/history", label: "History", icon: History },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-[320px] border-r border-white/10 bg-black/40 p-6 xl:block">
        <h1 className="text-5xl font-black tracking-widest">GRID</h1>

        <div className="mt-8">
          <h2 className="text-3xl font-bold leading-tight">
            The Trust Layer for
            <span className="block text-violet-400">Competitive Gaming</span>
          </h2>

          <p className="mt-5 leading-7 text-zinc-400">
            On-chain tournaments. Transparent prize pools. Fair play,
            guaranteed.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {["On-Chain", "Transparent", "Secure", "Fair Play"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
          <p className="font-bold">Built on Solana</p>
          <p className="text-sm text-zinc-400">Devnet MVP</p>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#05070d]/90 px-4 py-3 backdrop-blur xl:left-[320px]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-widest xl:hidden">
            GRID
          </h1>

          <nav className="hidden gap-6 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  path === item.href ? "text-violet-400" : "text-zinc-400"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-xl border border-white/10 px-3 py-2 text-sm sm:block">
              Devnet
            </span>
            <ClientWalletButton />{" "}
          </div>
        </div>
      </header>

      <section className="px-4 pb-28 pt-24 xl:ml-[320px] xl:px-8">
        {children}
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-white/10 bg-black/90 xl:hidden">
        {nav.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-3 text-xs"
            >
              <Icon
                size={18}
                className={
                  path === item.href ? "text-violet-400" : "text-zinc-500"
                }
              />
              <span
                className={
                  path === item.href ? "text-violet-400" : "text-zinc-500"
                }
              >
                {item.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
