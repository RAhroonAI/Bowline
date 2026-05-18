"use client";

import { useEffect, useMemo, useState } from "react";
import FlowHeader from "@/components/FlowHeader";
import ForecastBanner from "@/components/ForecastBanner";
import LocationRequired from "@/components/LocationRequired";
import FlatChecklist from "@/components/FlatChecklist";
import DoneFooter from "@/components/DoneFooter";
import { afterItems } from "@/lib/checklists";
import { activeConditionalsForSystem } from "@/lib/conditionals";
import { readState, toggleItem } from "@/lib/storage";
import type { BowlineState, Forecast } from "@/lib/types";

export default function AfterPage() {
  const [state, setState] = useState<BowlineState | null>(null);

  useEffect(() => {
    setState(readState());
  }, []);

  function onToggle(id: string) {
    setState(toggleItem("after", id));
  }
  function onForecast(f: Forecast) {
    setState((s) => (s ? { ...s, forecast: f } : s));
  }

  const completedSet = useMemo(
    () => new Set(state?.after.completed ?? []),
    [state?.after.completed]
  );

  const conditionals = useMemo(
    () => activeConditionalsForSystem(state?.forecast ?? null, "after", null),
    [state?.forecast]
  );

  const counts = useMemo(() => {
    let total = afterItems.length + conditionals.length;
    let done = 0;
    for (const it of afterItems) if (completedSet.has(it.id)) done += 1;
    for (const c of conditionals) if (completedSet.has(c.id)) done += 1;
    return { total, done };
  }, [completedSet, conditionals]);

  if (!state) return <main className="min-h-screen" />;
  if (!state.location) return <LocationRequired />;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-8">
      <FlowHeader
        eyebrow="Secured for the night"
        title="After the Day's Sail"
      />

      <ForecastBanner
        location={state.location}
        forecast={state.forecast}
        onForecastChange={onForecast}
        windowStartHours={4}
        windowDuration={12}
      />

      <div className="mt-6">
        <FlatChecklist
          items={afterItems}
          conditionals={conditionals}
          completed={completedSet}
          onToggle={onToggle}
        />
      </div>

      <DoneFooter total={counts.total} done={counts.done} />
    </main>
  );
}
