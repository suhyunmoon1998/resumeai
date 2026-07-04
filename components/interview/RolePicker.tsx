"use client";

import { ROLES } from "@/lib/questions";
import { Role } from "@/types";

export default function RolePicker({
  onSelect,
}: {
  onSelect: (role: Role) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-center font-display text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
        What do <span className="g-text">you</span> do?
      </h1>
      <p className="mt-3 text-center text-gray-500">
        I&apos;ll tailor a few extra questions to your field.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role)}
            aria-label={`Choose role ${role.name}`}
            className="card-hover group flex flex-col items-center gap-2 rounded-3xl border border-white/60 p-6 text-center shadow-sm"
            style={{ background: role.bg }}
          >
            <span className="text-4xl transition group-hover:scale-110" aria-hidden>
              {role.emoji}
            </span>
            <span className="font-bold" style={{ color: role.color }}>
              {role.name}
            </span>
            <span className="text-xs text-gray-500">{role.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
