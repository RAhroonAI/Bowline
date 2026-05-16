"use client";

import type { SystemGroup } from "@/lib/types";
import SystemIcon from "./SystemIcon";
import ChecklistRow from "./ChecklistRow";

type ConditionalRow = { id: string; text: string };

type Props = {
  system: SystemGroup;
  completed: Set<string>;
  conditionals: ConditionalRow[];
  onToggle: (id: string) => void;
};

export default function SystemCard({
  system,
  completed,
  conditionals,
  onToggle,
}: Props) {
  return (
    <section className="rounded-2xl bg-white/80 p-5 shadow-card backdrop-blur-sm">
      <header className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sea/10 text-sea-600">
          <SystemIcon name={system.icon} className="h-5 w-5" />
        </span>
        <h2 className="font-serif text-xl text-ink">{system.name}</h2>
      </header>
      <div className="flex flex-col divide-y divide-sand-200/80">
        {system.items.map((it) => (
          <ChecklistRow
            key={it.id}
            id={it.id}
            text={it.text}
            done={completed.has(it.id)}
            onToggle={onToggle}
          />
        ))}
        {conditionals.map((c) => (
          <ChecklistRow
            key={c.id}
            id={c.id}
            text={c.text}
            done={completed.has(c.id)}
            conditional
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
