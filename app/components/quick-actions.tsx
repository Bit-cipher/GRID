"use client";

import { Check, Plus, RotateCcw, Users, XCircle } from "lucide-react";

export function QuickActions({
  onCreate,
  onJoin,
  onFinalize,
  onCancel,
}: {
  onCreate: () => void;
  onJoin: () => void;
  onFinalize: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090d16] p-5">
      <h2 className="text-xl font-bold">Quick Actions</h2>

      <div className="mt-5 space-y-3">
        <Action icon={<Plus />} label="Create Tournament" onClick={onCreate} />
        <Action icon={<Users />} label="Join Tournament" onClick={onJoin} />
        <Action
          icon={<Check />}
          label="Finalize Tournament"
          onClick={onFinalize}
        />
        <Action
          icon={<XCircle />}
          label="Cancel / Refund"
          onClick={onCancel}
          danger
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Action({ icon, label, onClick, danger }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
        danger
          ? "border-red-500/30 text-red-300"
          : "border-violet-500/30 text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
