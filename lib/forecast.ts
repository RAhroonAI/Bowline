import type { Forecast, Location, MarineHourly, WeatherHourly } from "./types";

const CACHE_MS = 1000 * 60 * 60 * 2;

export function isStale(forecast: Forecast | null): boolean {
  if (!forecast) return true;
  const age = Date.now() - new Date(forecast.fetchedAt).getTime();
  return age > CACHE_MS;
}

export async function fetchForecast(loc: Location): Promise<Forecast> {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}` +
    `&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m,temperature_2m,precipitation_probability` +
    `&wind_speed_unit=kn&forecast_days=2&timezone=auto`;
  const marineUrl =
    `https://marine-api.open-meteo.com/v1/marine?latitude=${loc.lat}&longitude=${loc.lng}` +
    `&hourly=wave_height,wave_direction,wave_period&forecast_days=2&timezone=auto`;

  const [weatherRes, marineRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(marineUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather fetch failed: ${weatherRes.status}`);
  }
  const weatherJson = (await weatherRes.json()) as {
    hourly: WeatherHourly;
  };

  let marine: { hourly: MarineHourly } | null = null;
  if (marineRes && marineRes.ok) {
    const marineJson = (await marineRes.json()) as {
      hourly?: MarineHourly;
    };
    if (marineJson.hourly) marine = { hourly: marineJson.hourly };
  }

  return {
    fetchedAt: new Date().toISOString(),
    weather: { hourly: weatherJson.hourly },
    marine,
  };
}

export type ForecastWindow = {
  hours: number;
  maxWind: number | null;
  maxGusts: number | null;
  minTemp: number | null;
  maxTemp: number | null;
  maxPrecipProb: number | null;
  maxWave: number | null;
  windDirStart: number | null;
  windDirEnd: number | null;
  maxDirShift: number;
  nowWind: number | null;
  nowGusts: number | null;
  nowTemp: number | null;
  nowWave: number | null;
  nowWavePeriod: number | null;
};

function findStartIndex(times: string[], target: Date): number {
  const t = target.getTime();
  for (let i = 0; i < times.length; i++) {
    const ts = new Date(times[i]).getTime();
    if (ts >= t - 1000 * 60 * 30) return i;
  }
  return 0;
}

function rangeMax(arr: (number | null)[], start: number, end: number) {
  let m: number | null = null;
  for (let i = start; i < end && i < arr.length; i++) {
    const v = arr[i];
    if (v == null) continue;
    if (m == null || v > m) m = v;
  }
  return m;
}
function rangeMin(arr: (number | null)[], start: number, end: number) {
  let m: number | null = null;
  for (let i = start; i < end && i < arr.length; i++) {
    const v = arr[i];
    if (v == null) continue;
    if (m == null || v < m) m = v;
  }
  return m;
}

function angularDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function summarizeWindow(
  forecast: Forecast,
  startOffsetHours: number,
  durationHours: number
): ForecastWindow {
  const times = forecast.weather.hourly.time;
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const windowStart = new Date(now.getTime() + startOffsetHours * 3600 * 1000);
  const start = findStartIndex(times, windowStart);
  const end = start + durationHours;

  const wh = forecast.weather.hourly;
  const dirs: number[] = [];
  for (let i = start; i < end && i < wh.wind_direction_10m.length; i++) {
    const d = wh.wind_direction_10m[i];
    if (d != null) dirs.push(d);
  }
  let maxDirShift = 0;
  if (dirs.length >= 2) {
    const first = dirs[0];
    for (const d of dirs) {
      const diff = angularDiff(first, d);
      if (diff > maxDirShift) maxDirShift = diff;
    }
  }

  const nowIdx = findStartIndex(times, now);
  const mh = forecast.marine?.hourly;

  return {
    hours: durationHours,
    maxWind: rangeMax(wh.wind_speed_10m, start, end),
    maxGusts: rangeMax(wh.wind_gusts_10m, start, end),
    minTemp: rangeMin(wh.temperature_2m, start, end),
    maxTemp: rangeMax(wh.temperature_2m, start, end),
    maxPrecipProb: rangeMax(wh.precipitation_probability, start, end),
    maxWave: mh ? rangeMax(mh.wave_height, start, end) : null,
    windDirStart: dirs[0] ?? null,
    windDirEnd: dirs[dirs.length - 1] ?? null,
    maxDirShift,
    nowWind: wh.wind_speed_10m[nowIdx] ?? null,
    nowGusts: wh.wind_gusts_10m[nowIdx] ?? null,
    nowTemp: wh.temperature_2m[nowIdx] ?? null,
    nowWave: mh ? mh.wave_height[nowIdx] ?? null : null,
    nowWavePeriod: mh ? mh.wave_period[nowIdx] ?? null : null,
  };
}

const COMPASS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

export function compass(deg: number | null | undefined): string {
  if (deg == null || Number.isNaN(deg)) return "";
  const idx = Math.round((deg % 360) / 22.5) % 16;
  return COMPASS[idx];
}

export function conditionsSummary(w: ForecastWindow): string {
  const bits: string[] = [];
  if (w.maxWind != null) {
    const dir = w.windDirStart != null ? compass(w.windDirStart) + "ly" : "";
    if (w.maxDirShift > 60) {
      bits.push(`Shifting wind, peak ${Math.round(w.maxWind)} kt`);
    } else if (dir) {
      bits.push(`${dir} winds to ${Math.round(w.maxWind)} kt`);
    } else {
      bits.push(`Winds to ${Math.round(w.maxWind)} kt`);
    }
  }
  if (w.maxPrecipProb != null && w.maxPrecipProb >= 60) {
    bits.push("rain likely");
  } else if (w.maxPrecipProb != null && w.maxPrecipProb >= 30) {
    bits.push("scattered showers possible");
  }
  if (w.maxWave != null && w.maxWave > 1.5) {
    bits.push(`seas building to ${w.maxWave.toFixed(1)}m`);
  }
  if (bits.length === 0) return "Calm and settled.";
  return bits.join(", ").replace(/^./, (c) => c.toUpperCase()) + ".";
}

export type GeocodeResult = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

export async function geocode(query: string): Promise<GeocodeResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=8&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);
  const json = (await res.json()) as { results?: GeocodeResult[] };
  return json.results ?? [];
}
