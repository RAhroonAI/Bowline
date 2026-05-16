"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Locate, Search } from "lucide-react";
import { geocode, type GeocodeResult } from "@/lib/forecast";
import { readState, setLocation } from "@/lib/storage";
import type { Location } from "@/lib/types";

export default function LocationPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<Location | null>(null);

  useEffect(() => {
    setCurrent(readState().location);
  }, []);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setSearching(true);
      setError(null);
      const r = await geocode(query.trim());
      setResults(r);
      if (r.length === 0) setError("No matches. Try a different name.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  function pickResult(r: GeocodeResult) {
    const label = [r.name, r.admin1, r.country].filter(Boolean).join(", ");
    setLocation({ name: label, lat: r.latitude, lng: r.longitude });
    router.push("/");
  }

  function useGeolocation() {
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't available in this browser.");
      return;
    }
    setGeoLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
          );
          let name = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
          if (res.ok) {
            const json = (await res.json()) as { results?: GeocodeResult[] };
            const first = json.results?.[0];
            if (first) {
              name = [first.name, first.admin1, first.country]
                .filter(Boolean)
                .join(", ");
            }
          }
          setLocation({ name, lat: latitude, lng: longitude });
          router.push("/");
        } catch {
          setLocation({
            name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            lat: latitude,
            lng: longitude,
          });
          router.push("/");
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        setError(err.message || "Couldn't get your location.");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <h1 className="mt-6 font-serif text-3xl text-ink">Where are you?</h1>
      <p className="mt-2 text-ink/60">
        Used for the forecast and to flag conditional items on each list.
      </p>

      {current ? (
        <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-ink/70">
          Currently: <span className="font-medium text-ink">{current.name}</span>
        </p>
      ) : null}

      <button
        onClick={useGeolocation}
        disabled={geoLoading}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-terra text-base font-medium text-white shadow-card transition hover:bg-terra-600 disabled:opacity-60"
      >
        <Locate className="h-5 w-5" strokeWidth={1.8} />
        {geoLoading ? "Locating…" : "Use my current location"}
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-ink/40">
        <div className="h-px flex-1 bg-ink/10" />
        or enter a port
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <form onSubmit={search} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder="e.g. Lefkas Marina"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-full border border-ink/15 bg-white pl-10 pr-4 text-base text-ink placeholder:text-ink/35 focus:border-terra focus:outline-none focus:ring-2 focus:ring-terra/20"
          />
        </div>
        <button
          type="submit"
          disabled={searching || !query.trim()}
          aria-label="Search for port"
          className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink-700 disabled:opacity-50"
        >
          {searching ? (
            <span className="text-sm">…</span>
          ) : (
            <Search className="h-4 w-4" strokeWidth={2.2} />
          )}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-terra-600">{error}</p> : null}

      {results.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-2">
          {results.map((r, i) => (
            <li key={`${r.name}-${r.latitude}-${r.longitude}-${i}`}>
              <button
                onClick={() => pickResult(r)}
                className="flex w-full items-start gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 text-left transition hover:border-terra/40"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg text-ink">
                    {r.name}
                  </span>
                  <span className="text-sm text-ink/55">
                    {[r.admin1, r.country].filter(Boolean).join(", ")}
                  </span>
                </span>
                <span className="text-xs uppercase tracking-wider text-ink/40">
                  {r.latitude.toFixed(2)}, {r.longitude.toFixed(2)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
