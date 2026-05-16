"use client";

import { useEffect, useMemo, useState } from "react";
import FlowHeader from "@/components/FlowHeader";
import ForecastBanner from "@/components/ForecastBanner";
import LocationRequired from "@/components/LocationRequired";
import ChecklistRow from "@/components/ChecklistRow";
import DoneFooter from "@/components/DoneFooter";
import { beforeSections } from "@/lib/checklists";
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
    let total = 0;
    let done = 0;
    for (const section of beforeSections) {
      for (const item of section.items) {
        total += 1;
        if (completedSet.has(item.id)) done += 1;
      }
    }
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

      <div className="mt-6 flex flex-col gap-4">
        {beforeSections.map((section) => (
          <section
            key={section.id}
            className="rounded-2xl bg-white/80 p-5 shadow-card backdrop-blur-sm"
          >
            <header className="mb-3">
              <h2 className="font-serif text-xl text-ink">{section.name}</h2>
            </header>
            <div className="flex flex-col divide-y divide-sand-200/80">
              {section.items.map((item) => (
                <ChecklistRow
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  done={completedSet.has(item.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <DoneFooter total={counts.total} done={counts.done} />
    </main>
  );
}
