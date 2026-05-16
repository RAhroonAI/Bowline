import type { ConditionalItem, Forecast } from "./types";
import { summarizeWindow } from "./forecast";

export const conditionals: ConditionalItem[] = [
  {
    id: "conditional_reef_before_harbor",
    systemId: "sails",
    flow: "daily",
    trigger: (f: Forecast) => {
      const w = summarizeWindow(f, 0, 12);
      return (w.maxWind ?? 0) > 18;
    },
    render: (f: Forecast) => {
      const w = summarizeWindow(f, 0, 12);
      const max = w.maxWind != null ? Math.round(w.maxWind) : "?";
      return `Reef before leaving the harbor — winds forecast to ${max} kt.`;
    },
  },
  {
    id: "conditional_harnesses",
    systemId: "safety",
    flow: "daily",
    trigger: (f: Forecast) => {
      const w = summarizeWindow(f, 0, 12);
      return (w.maxGusts ?? 0) > 25;
    },
    render: () => "Harnesses and tethers identified for each crew member.",
  },
  {
    id: "conditional_cold_layer",
    systemId: "domestic",
    flow: "daily",
    trigger: (f: Forecast) => {
      const w = summarizeWindow(f, 0, 12);
      return w.minTemp != null && w.minTemp < 15;
    },
    render: (f: Forecast) => {
      const w = summarizeWindow(f, 0, 12);
      const min = w.minTemp != null ? Math.round(w.minTemp) : "?";
      return `Cold weather layer for each crew member — temp forecast ${min}°C.`;
    },
  },
  {
    id: "conditional_foulies",
    systemId: "domestic",
    flow: "daily",
    trigger: (f: Forecast) => {
      const w = summarizeWindow(f, 0, 12);
      return (w.maxPrecipProb ?? 0) > 60;
    },
    render: () => "Foul weather gear accessible for each crew member.",
  },
  {
    id: "conditional_heavy_weather_brief",
    systemId: "safety",
    flow: "daily",
    trigger: (f: Forecast) => {
      const w = summarizeWindow(f, 0, 12);
      return (w.maxWave ?? 0) > 1.5;
    },
    render: () =>
      "Brief crew on heavy weather sail handling and crew positioning.",
  },
  {
    id: "conditional_anchor_watch",
    systemId: null,
    flow: "after",
    trigger: (f: Forecast) => {
      const w = summarizeWindow(f, 4, 12);
      return (w.maxWind ?? 0) > 20 || w.maxDirShift > 60;
    },
    render: () =>
      "Set anchor watch or check anchor alarm — overnight wind shift forecast.",
  },
  {
    id: "conditional_snubber",
    systemId: null,
    flow: "after",
    trigger: (f: Forecast) => {
      const w = summarizeWindow(f, 4, 12);
      return (w.maxWind ?? 0) > 25;
    },
    render: () => "Double snubber, check chafe gear on anchor rode.",
  },
];

export function activeConditionalsForSystem(
  forecast: Forecast | null,
  flow: "daily" | "after",
  systemId: string | null
): Array<{ id: string; text: string }> {
  if (!forecast) return [];
  return conditionals
    .filter((c) => c.flow === flow && c.systemId === systemId)
    .filter((c) => {
      try {
        return c.trigger(forecast);
      } catch {
        return false;
      }
    })
    .map((c) => ({ id: c.id, text: c.render(forecast) }));
}
