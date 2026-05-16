import type { BowlineState, FlowKey, Location, Forecast } from "./types";

const KEY = "bowline_state";

const empty: BowlineState = {
  location: null,
  forecast: null,
  daily: { completed: [] },
  before: { completed: [] },
  after: { completed: [] },
};

export function readState(): BowlineState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<BowlineState>;
    return {
      location: parsed.location ?? null,
      forecast: parsed.forecast ?? null,
      daily: parsed.daily ?? { completed: [] },
      before: parsed.before ?? { completed: [] },
      after: parsed.after ?? { completed: [] },
    };
  } catch {
    return empty;
  }
}

export function writeState(state: BowlineState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function patchState(patch: Partial<BowlineState>): BowlineState {
  const next = { ...readState(), ...patch };
  writeState(next);
  return next;
}

export function setLocation(location: Location): BowlineState {
  return patchState({ location, forecast: null });
}

export function setForecast(forecast: Forecast): BowlineState {
  return patchState({ forecast });
}

export function toggleItem(flow: FlowKey, id: string): BowlineState {
  const state = readState();
  const existing = new Set(state[flow].completed);
  if (existing.has(id)) existing.delete(id);
  else existing.add(id);
  const next: BowlineState = {
    ...state,
    [flow]: { completed: Array.from(existing) },
  };
  writeState(next);
  return next;
}

export function resetDay(): BowlineState {
  const state = readState();
  const next: BowlineState = {
    ...state,
    daily: { completed: [] },
    before: { completed: [] },
    after: { completed: [] },
  };
  writeState(next);
  return next;
}
