"use client";

import type { ChecklistItem } from "@/lib/types";
import ChecklistRow from "./ChecklistRow";

type Conditional = { id: string; text: string };

export default function FlatChecklist({
  items,
  conditionals,
  completed,
  onToggle,
}: {
  items: ChecklistItem[];
  conditionals: Conditional[];
  completed: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl bg-white/80 p-3 shadow-card">
      <div className="flex flex-col divide-y divide-sand-200/80">
        {items.map((it) => (
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
