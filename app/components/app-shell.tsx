"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  History,
  Crown,
  User,
  BarChart3,
  ShieldCheck,
  Lock,
  Scale,
  Zap,
} from "lucide-react";
import { ClientWalletButton } from "@/components/client-wallet-button";

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
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(124,58,237,0.18),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.08),transparent_28%)]" />

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[340px] border-r border-white/10 bg-[#070a12]/95 p-6 xl:block">
        <div className="flex h-full flex-col">
          <h1 className="text-5xl font-black tracking-widest text-white drop-shadow">
            GRID
          </h1>

          <div className="mt-8">
            <h2 className="text-3xl font-bold leading-tight">
              The Trust Layer for
              <span className="block text-violet-400">Competitive Gaming</span>
            </h2>

            <p className="mt-5 leading-7 text-zinc-400">
              On-chain tournaments.
              <br />
              Transparent prize pools.
              <br />
              Fair play, guaranteed.
            </p>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/20 via-[#111827] to-black p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative mx-auto grid h-48 w-48 place-items-center rounded-full border border-violet-400/30 bg-black/40">
              <Trophy className="h-24 w-24 text-violet-300" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Feature
              icon={<ShieldCheck size={18} />}
              title="On-Chain"
              text="Recorded on Solana"
            />
            <Feature
              icon={<BarChart3 size={18} />}
              title="Transparent"
              text="State tracking"
            />
            <Feature
              icon={<Lock size={18} />}
              title="Secure"
              text="Escrow vaults"
            />
            <Feature
              icon={<Scale size={18} />}
              title="Fair Play"
              text="Program logic"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="text-violet-300">
                <Zap />
              </div>
              <div>
                <p className="font-bold">Built on Solana</p>
                <p className="text-sm text-zinc-500">
                  Blazing fast. Low fees. Scalable.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 text-sm text-zinc-600">
            GRID · Devnet MVP
          </div>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#05070d]/90 px-4 py-3 backdrop-blur xl:left-[340px] xl:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-widest xl:hidden">
            GRID
          </h1>

          <nav className="hidden items-center gap-8 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-4 text-sm transition ${
                  path === item.href
                    ? "border-violet-500 text-violet-300"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-300 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Devnet
            </span>
            <ClientWalletButton />
          </div>
        </div>
      </header>

      <section className="relative z-10 px-4 pb-28 pt-24 xl:ml-[340px] xl:px-8">
        {children}
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-white/10 bg-black/95 backdrop-blur xl:hidden">
        {nav.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = path === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-3 text-xs"
            >
              <Icon
                size={18}
                className={active ? "text-violet-400" : "text-zinc-500"}
              />
              <span
                className={
                  active ? "mt-1 text-violet-400" : "mt-1 text-zinc-500"
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

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
      <div className="mx-auto grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-300">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-zinc-500">{text}</p>
    </div>
  );
}
