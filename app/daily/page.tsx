"use client";

import { useEffect, useMemo, useState } from "react";
import FlowHeader from "@/components/FlowHeader";
import ForecastBanner from "@/components/ForecastBanner";
import LocationRequired from "@/components/LocationRequired";
import SystemCard from "@/components/SystemCard";
import DoneFooter from "@/components/DoneFooter";
import { dailySystems } from "@/lib/checklists";
import { activeConditionalsForSystem } from "@/lib/conditionals";
import { readState, toggleItem } from "@/lib/storage";
import type { BowlineState, Forecast } from "@/lib/types";

export default function DailyPage() {
  const [state, setState] = useState<BowlineState | null>(null);

  useEffect(() => {
    setState(readState());
  }, []);

  function onToggle(id: string) {
    setState(toggleItem("daily", id));
  }
  function onForecast(f: Forecast) {
    setState((s) => (s ? { ...s, forecast: f } : s));
  }

  const completedSet = useMemo(
    () => new Set(state?.daily.completed ?? []),
    [state?.daily.completed]
  );

  const counts = useMemo(() => {
    if (!state) return { total: 0, done: 0 };
    let total = 0;
    let done = 0;
    for (const sys of dailySystems) {
      for (const it of sys.items) {
        total += 1;
        if (completedSet.has(it.id)) done += 1;
      }
      for (const c of activeConditionalsForSystem(
        state.forecast,
        "daily",
        sys.id
      )) {
        total += 1;
        if (completedSet.has(c.id)) done += 1;
      }
    }
    return { total, done };
  }, [state, completedSet]);

  if (!state) return <main className="min-h-screen" />;
  if (!state.location) return <LocationRequired />;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-8">
      <FlowHeader eyebrow="Morning · at the dock" title="Daily Checklist" />

      <ForecastBanner
        location={state.location}
        forecast={state.forecast}
        onForecastChange={onForecast}
        windowStartHours={0}
        windowDuration={12}
      />

      <div className="mt-6 flex flex-col gap-4">
        {dailySystems.map((sys) => {
          const cond = activeConditionalsForSystem(
            state.forecast,
            "daily",
            sys.id
          );
          return (
            <SystemCard
              key={sys.id}
              system={sys}
              completed={completedSet}
              conditionals={cond}
              onToggle={onToggle}
            />
          );
        })}
      </div>

      <DoneFooter total={counts.total} done={counts.done} />
    </main>
  );
}
