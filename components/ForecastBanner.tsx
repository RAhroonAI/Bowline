"use client";

import { useEffect, useState } from "react";
import {
  CloudOff,
  RefreshCcw,
  Wind as WindIcon,
  Thermometer,
  Waves,
} from "lucide-react";
import type { Forecast, Location } from "@/lib/types";
import {
  compass,
  conditionsSummary,
  fetchForecast,
  isStale,
  summarizeWindow,
} from "@/lib/forecast";
import { setForecast } from "@/lib/storage";

type Props = {
  location: Location;
  forecast: Forecast | null;
  onForecastChange: (f: Forecast) => void;
  windowStartHours?: number;
  windowDuration?: number;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

export default function ForecastBanner({
  location,
  forecast,
  onForecastChange,
  windowStartHours = 0,
  windowDuration = 12,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setError(null);
      setLoading(true);
      const f = await fetchForecast(location);
      setForecast(f);
      onForecastChange(f);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load forecast.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!forecast || isStale(forecast)) {
      void refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.lat, location.lng]);

  const window = forecast
    ? summarizeWindow(forecast, windowStartHours, windowDuration)
    : null;
  const stale = forecast ? isStale(forecast) : false;
  const offline = Boolean(error) && Boolean(forecast);
  const cold = Boolean(error) && !forecast;

  return (
    <section
      className={`rounded-2xl border bg-gradient-to-br from-terra-50 to-sand p-5 shadow-card transition
        ${offline || cold ? "border-ink/15" : "border-terra/30"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-terra-600">
              Forecast · {location.name}
            </p>
            {offline ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink/70">
                <CloudOff className="h-3 w-3" strokeWidth={2} />
                Cached
              </span>
            ) : stale && forecast ? (
              <span className="inline-flex items-center rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink/70">
                Stale
              </span>
            ) : null}
          </div>
          <h2 className="mt-1 font-serif text-lg text-ink leading-snug">
            {window
              ? conditionsSummary(window)
              : cold
              ? "Can't reach the forecast service."
              : "Loading conditions…"}
          </h2>
        </div>
        <button
          onClick={() => void refresh()}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/80 text-ink/70 transition hover:bg-white hover:text-ink"
          aria-label="Refresh forecast"
          disabled={loading}
          title="Refresh forecast"
        >
          <RefreshCcw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            strokeWidth={2}
          />
        </button>
      </div>

      {cold ? (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-white/70 px-4 py-3">
          <p className="text-sm text-ink/70">
            Conditional items will appear once a forecast loads.
          </p>
          <button
            onClick={() => void refresh()}
            disabled={loading}
            className="rounded-full bg-terra px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-terra-600 disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      ) : null}

      {window ? (
        <dl className="mt-4 grid grid-cols-3 gap-3 text-ink">
          <Stat
            icon={<WindIcon className="h-4 w-4" />}
            label="Wind"
            primary={
              window.nowWind != null ? `${Math.round(window.nowWind)} kt` : "—"
            }
            secondary={
              window.maxGusts != null
                ? `gusts ${Math.round(window.maxGusts)} kt`
                : compass(window.windDirStart ?? null)
            }
          />
          <Stat
            icon={<Waves className="h-4 w-4" />}
            label="Sea"
            primary={
              window.nowWave != null ? `${window.nowWave.toFixed(1)} m` : "—"
            }
            secondary={
              window.nowWavePeriod != null
                ? `${Math.round(window.nowWavePeriod)} s`
                : ""
            }
          />
          <Stat
            icon={<Thermometer className="h-4 w-4" />}
            label="Air"
            primary={
              window.nowTemp != null ? `${Math.round(window.nowTemp)}°C` : "—"
            }
            secondary={
              window.maxPrecipProb != null && window.maxPrecipProb >= 30
                ? `${Math.round(window.maxPrecipProb)}% rain`
                : ""
            }
          />
        </dl>
      ) : null}

      {forecast ? (
        <p className="mt-3 text-[11px] uppercase tracking-wider text-ink/40">
          {offline || stale ? "Last updated " : "Updated "}
          {timeAgo(forecast.fetchedAt)}
          {!offline && !stale
            ? ` · next ${windowDuration} h window`
            : ""}
        </p>
      ) : null}
    </section>
  );
}

function Stat({
  icon,
  label,
  primary,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary?: string;
}) {
  return (
    <div className="rounded-xl bg-white/70 px-3 py-3">
      <div className="flex items-center gap-1.5 text-sea-600">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="mt-1 font-serif text-xl text-ink">{primary}</div>
      {secondary ? (
        <div className="text-xs text-ink/50">{secondary}</div>
      ) : null}
    </div>
  );
}
