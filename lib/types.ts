export type Location = {
  name: string;
  lat: number;
  lng: number;
};

export type MarineHourly = {
  time: string[];
  wave_height: (number | null)[];
  wave_direction: (number | null)[];
  wave_period: (number | null)[];
};

export type WeatherHourly = {
  time: string[];
  wind_speed_10m: (number | null)[];
  wind_gusts_10m: (number | null)[];
  wind_direction_10m: (number | null)[];
  temperature_2m: (number | null)[];
  precipitation_probability: (number | null)[];
};

export type Forecast = {
  fetchedAt: string;
  marine: { hourly: MarineHourly } | null;
  weather: { hourly: WeatherHourly };
};

export type FlowKey = "daily" | "before" | "after";

export type BowlineState = {
  location: Location | null;
  forecast: Forecast | null;
  daily: { completed: string[] };
  before: { completed: string[] };
  after: { completed: string[] };
};

export type ChecklistItem = {
  id: string;
  text: string;
};

export type SystemGroup = {
  id: string;
  name: string;
  icon:
    | "Zap"
    | "Droplet"
    | "CircleDot"
    | "Cog"
    | "Utensils"
    | "Compass"
    | "Wrench"
    | "Sailboat"
    | "Anchor"
    | "Wind"
    | "LifeBuoy"
    | "ShieldCheck";
  items: ChecklistItem[];
};

export type ConditionalItem = {
  id: string;
  systemId: string | null;
  flow: "daily" | "after";
  trigger: (f: Forecast) => boolean;
  render: (f: Forecast) => string;
};
