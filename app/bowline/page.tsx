"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Sunrise, Sailboat, Moon, RotateCcw } from "lucide-react";
import { readState, resetDay } from "@/lib/storage";
import type { BowlineState } from "@/lib/types";

export default function Home() {
  const [state, setState] = useState<BowlineState | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setState(readState());
  }, []);

  if (!state) {
    return <main className="min-h-screen" aria-hidden />;
  }

  const completedCount =
    state.daily.completed.length +
    state.before.completed.length +
    state.after.completed.length;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-12">
      <header className="text-center">
        <div
          className="mx-auto h-px w-12 bg-terra/60"
          aria-hidden
        />
        <h1 className="mt-5 font-serif text-5xl text-ink tracking-tight">
          Bowline
        </h1>
        <p className="mt-3 text-ink/60">
          The daily checklist for bareboat chartering.
        </p>
      </header>

      <nav className="mt-12 flex flex-col gap-3">
        <FlowButton
          href="/bowline/daily"
          icon={<Sunrise className="h-6 w-6" />}
          label="Daily Checklist"
          sub="Open before you do anything else."
          locked={!state.location}
        />
        <FlowButton
          href="/bowline/before"
          icon={<Sailboat className="h-6 w-6" />}
          label="Before Getting Under Way"
          sub="The short list before lines off."
          locked={!state.location}
        />
        <FlowButton
          href="/bowline/after"
          icon={<Moon className="h-6 w-6" />}
          label="After the Day's Sail"
          sub="Secured at anchor, mooring or dock."
          locked={!state.location}
        />
      </nav>

      <section className="mt-10 rounded-2xl border border-sand-300/70 bg-white/70 p-4 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sea/10 text-sea-600">
            <MapPin className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink/50">
              Location
            </p>
            <p className="truncate font-serif text-lg text-ink">
              {state.location ? state.location.name : "Not set"}
            </p>
          </div>
          <Link
            href="/bowline/location"
            className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-ink/70 transition hover:border-ink/30 hover:text-ink"
          >
            {state.location ? "Change" : "Set"}
          </Link>
        </div>
      </section>

      <div className="mt-auto pt-12 text-center">
        {showReset ? (
          <div className="mx-auto max-w-xs rounded-2xl border border-terra/40 bg-white/90 p-5 shadow-card">
            <p className="font-serif text-lg text-ink">Reset today's lists?</p>
            <p className="mt-1 text-sm text-ink/60">
              Clears completed items in all three flows. Location stays.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 rounded-full border border-ink/15 py-2.5 text-sm text-ink/70 hover:bg-sand-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setState(resetDay());
                  setShowReset(false);
                }}
                className="flex-1 rounded-full bg-terra py-2.5 text-sm font-medium text-white hover:bg-terra-600"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowReset(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink/40 hover:text-ink/70"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset day{completedCount > 0 ? ` (${completedCount})` : ""}
          </button>
        )}
      </div>
    </main>
  );
}

function FlowButton({
  href,
  icon,
  label,
  sub,
  locked,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  locked: boolean;
}) {
  const className =
    "group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white px-5 py-5 text-left shadow-card transition hover:border-terra/40 hover:shadow-cardHover";
  const inner = (
    <>
      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-terra-50 text-terra-600 transition group-hover:bg-terra group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-lg text-ink leading-tight">
          {label}
        </span>
        <span className="mt-0.5 block text-sm text-ink/55">{sub}</span>
      </span>
    </>
  );

  if (locked) {
    return (
      <Link
        href="/bowline/location"
        className={`${className} opacity-80`}
        title="Set a location first"
      >
        {inner}
      </Link>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
