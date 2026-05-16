"use client";

import { useEffect, useMemo, useState } from "react";
import FlowHeader from "@/components/FlowHeader";
import ForecastBanner from "@/components/ForecastBanner";
import LocationRequired from "@/components/LocationRequired";
import FlatChecklist from "@/components/FlatChecklist";
import DoneFooter from "@/components/DoneFooter";
import { beforeItems } from "@/lib/checklists";
import { readState, toggleItem } from "@/lib/storage";
import type { BowlineState, Forecast } from "@/lib/types";

export default function BeforePage() {
  const [state, setState] = useState<BowlineState | null>(null);

  useEffect(() => {
    setState(readState());
  }, []);

  function onToggle(id: string) {
    setState(toggleItem("before", id));
  }
  function onForecast(f: Forecast) {
    setState((s) => (s ? { ...s, forecast: f } : s));
  }

  const completedSet = useMemo(
    () => new Set(state?.before.completed ?? []),
    [state?.before.completed]
  );

  const counts = useMemo(() => {
    const total = beforeItems.length;
    let done = 0;
    for (const it of beforeItems) if (completedSet.has(it.id)) done += 1;
    return { total, done };
  }, [completedSet]);

  if (!state) return <main className="min-h-screen" />;
  if (!state.location) return <LocationRequired />;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-8">
      <FlowHeader
        eyebrow="Just before lines off"
        title="Before Getting Under Way"
      />

      <ForecastBanner
        location={state.location}
        forecast={state.forecast}
        onForecastChange={onForecast}
        windowStartHours={0}
        windowDuration={12}
      />

      <div className="mt-6">
        <FlatChecklist
          items={beforeItems}
          conditionals={[]}
          completed={completedSet}
          onToggle={onToggle}
        />
      </div>

      <DoneFooter total={counts.total} done={counts.done} />
    </main>
  );
}
