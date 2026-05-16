import type { ChecklistItem, SystemGroup } from "./types";

export const dailySystems: SystemGroup[] = [
  {
    id: "electrical",
    name: "Electrical",
    icon: "Zap",
    items: [
      { id: "electrical_battery_voltage", text: "Check battery voltage." },
      {
        id: "electrical_battery_switch",
        text: "Check battery switch position. Verify for motoring and/or at rest.",
      },
      {
        id: "electrical_shore_power",
        text: "Shore power: Shut off at panel; disconnect and stow cable before getting under way.",
      },
      {
        id: "electrical_instruments",
        text: "Instruments: Remove sun covers; check operation.",
      },
      { id: "electrical_vhf", text: "VHF radio: Switch on; check function." },
      {
        id: "electrical_nav_lights",
        text: "Navigation lights: Check operation.",
      },
    ],
  },
  {
    id: "bilge",
    name: "Bilge",
    icon: "Droplet",
    items: [
      { id: "bilge_water_level", text: "Check water level." },
      { id: "bilge_test_pump", text: "Test electric pump." },
      { id: "bilge_pump_dry", text: "Pump dry." },
    ],
  },
  {
    id: "seacocks",
    name: "Seacocks",
    icon: "CircleDot",
    items: [
      {
        id: "seacocks_open",
        text: "Open for use as required (e.g., engine raw-water intake).",
      },
      {
        id: "seacocks_secure",
        text: "Secure if not required (e.g., head sink drain that could back fill when heeled).",
      },
    ],
  },
  {
    id: "engine",
    name: "Engine",
    icon: "Cog",
    items: [
      { id: "engine_oil", text: "Check oil level." },
      { id: "engine_coolant", text: "Check coolant level." },
      { id: "engine_belts", text: "Test belt tension." },
      { id: "engine_hoses", text: "Examine hoses." },
      { id: "engine_leaks", text: "Look for drips or leakage." },
      {
        id: "engine_fuel_shutoff",
        text: "Check fuel shut-off handle position.",
      },
      { id: "engine_fuel_level", text: "Check fuel level." },
      { id: "engine_start", text: "Start engine." },
      {
        id: "engine_cooling_water",
        text: "Observe cooling water discharge in exhaust.",
      },
      { id: "engine_gauges", text: "Check gauges." },
      {
        id: "engine_transmission",
        text: "Transmission: Engage and check operation.",
      },
    ],
  },
  {
    id: "domestic",
    name: "Domestic",
    icon: "Utensils",
    items: [
      { id: "domestic_freshwater", text: "Check freshwater tank levels." },
      { id: "domestic_ice", text: "Check ice volume." },
      { id: "domestic_provisions", text: "Provisions: Check properly stowed." },
      {
        id: "domestic_fridge",
        text: "Refrigerator: Check cold plate(s) function.",
      },
      { id: "domestic_stove", text: "Stove: Check fuel and burners." },
    ],
  },
  {
    id: "steering",
    name: "Steering",
    icon: "Compass",
    items: [
      {
        id: "steering_motion",
        text: "Check for smooth motion hard-over to hard-over.",
      },
    ],
  },
  {
    id: "heads",
    name: "Heads",
    icon: "Wrench",
    items: [
      { id: "heads_operation", text: "Check operation and seacocks." },
      {
        id: "heads_holding",
        text: "Holding tanks: Check levels; positions of Y-valves or discharge valves.",
      },
    ],
  },
  {
    id: "sails",
    name: "Sails and Rigging",
    icon: "Sailboat",
    items: [
      {
        id: "sails_standing_rigging",
        text: "Standing rigging: Check cotter pins.",
      },
      { id: "sails_shackles", text: "Shackles: Check pins are tight." },
      {
        id: "sails_lines",
        text: "Sheets and halyards: Check condition and readiness.",
      },
      {
        id: "sails_covers",
        text: "Sailcovers: Cover removed or sailbag/stackpack open.",
      },
      { id: "sails_winch_handles", text: "Winch handles: Stow in cockpit." },
    ],
  },
  {
    id: "ground_tackle",
    name: "Ground Tackle",
    icon: "Anchor",
    items: [
      { id: "ground_tackle_anchor_1", text: "Anchor 1: Check shackle security." },
      { id: "ground_tackle_anchor_2", text: "Anchor 2: Check accessibility." },
      { id: "ground_tackle_windlass", text: "Windlass: Check operation." },
    ],
  },
  {
    id: "navigation",
    name: "Navigation",
    icon: "Wind",
    items: [
      {
        id: "nav_weather",
        text: "Weather: Check wind and sea conditions are suitable.",
      },
      {
        id: "nav_charts",
        text: "Check appropriate charts and cruising guides.",
      },
      { id: "nav_tools", text: "Nav tools: Ready them for use." },
      {
        id: "nav_chart_plotter",
        text: "Chart plotter: Turn on; verify chart and position.",
      },
      { id: "nav_float_plan", text: "Float plan: Submit as appropriate." },
    ],
  },
  {
    id: "dinghy",
    name: "Dinghy",
    icon: "LifeBuoy",
    items: [
      { id: "dinghy_inflation", text: "Inflation: Check firmness." },
      { id: "dinghy_motor", text: "Motor: Start and check gearshift." },
      { id: "dinghy_fuel", text: "Fuel: Check level." },
      {
        id: "dinghy_equipment",
        text: "Equipment: Check PFDs and oars/paddles available.",
      },
      { id: "dinghy_towing", text: "Check dinghy towing gear." },
    ],
  },
  {
    id: "safety",
    name: "Safety",
    icon: "ShieldCheck",
    items: [
      { id: "safety_equipment", text: "Safety equipment: Check accessibility." },
      { id: "safety_crew", text: "Crew: Check readiness." },
    ],
  },
];

export type BeforeSection = {
  id: string;
  name: string;
  items: ChecklistItem[];
};

export const beforeSections: BeforeSection[] = [
  {
    id: "crew",
    name: "Crew and personal safety",
    items: [
      {
        id: "before_crew_pfds",
        text: "PFDs on every crew member, properly fitted.",
      },
      {
        id: "before_crew_children",
        text: "Children seated and briefed for departure — where they sit, what they hold onto.",
      },
      {
        id: "before_crew_briefed",
        text: "Crew briefed on departure plan — who handles which line, where fenders go, helm intentions.",
      },
      {
        id: "before_crew_airhorn",
        text: "Crew know the location of the air horn and how to use it.",
      },
      {
        id: "before_crew_throwables",
        text: "Crew know the location of throwable PFDs and the life ring.",
      },
      {
        id: "before_crew_loose_items",
        text: "Phones, cameras, and loose items stowed or secured.",
      },
    ],
  },
  {
    id: "boat",
    name: "Boat readiness",
    items: [
      { id: "before_boat_stow_gear", text: "Stow gear in the cabin." },
      { id: "before_boat_hatches", text: "Secure hatches and portlights." },
      {
        id: "before_boat_electrical",
        text: "Secure non-essential electrical systems.",
      },
      {
        id: "before_boat_fenders",
        text: "Fenders in position for direction of departure and the dock side.",
      },
      {
        id: "before_boat_lines",
        text: "Lines flaked and ready to come aboard in the order they release.",
      },
      {
        id: "before_boat_spring",
        text: "Spring line strategy briefed if needed.",
      },
      {
        id: "before_boat_helm",
        text: "Helm centered, transmission in neutral.",
      },
      {
        id: "before_boat_throttle",
        text: "Throttle response checked — forward, neutral, reverse at the dock.",
      },
    ],
  },
  {
    id: "situational",
    name: "Situational awareness",
    items: [
      {
        id: "before_situational_dock_walk",
        text: "Walk the dock — fairway clear in both directions, no traffic approaching, no lines or dinghy painters in the water.",
      },
      {
        id: "before_situational_wind",
        text: "Wind direction and speed at the dock confirmed — may differ from the marina forecast.",
      },
      {
        id: "before_situational_tide",
        text: "Current and tide at the dock noted if relevant.",
      },
      {
        id: "before_situational_vhf",
        text: "VHF on, monitoring channel 16 and any local marina channel.",
      },
      {
        id: "before_situational_chartplotter",
        text: "Chart plotter on, current position visible, departure route loaded.",
      },
      {
        id: "before_situational_visual_check",
        text: "Visual check around the boat for any lines or debris near the prop.",
      },
    ],
  },
];

export const afterItems: ChecklistItem[] = [
  { id: "after_cover_main", text: "Cover mainsail." },
  { id: "after_coil_lines", text: "Coil and stow running rigging." },
  { id: "after_winch_handles", text: "Stow winch handles below." },
  {
    id: "after_instruments",
    text: "Turn off instruments and replace sun covers.",
  },
  {
    id: "after_hatches",
    text: "Open hatches for ventilation (if remaining on board).",
  },
  {
    id: "after_anchor_light",
    text: "Check anchor light (if anchored or on mooring).",
  },
  {
    id: "after_batteries",
    text: "Set batteries and monitor voltage readings.",
  },
  { id: "after_bilges", text: "Check bilges." },
  {
    id: "after_heads",
    text: "Check positions of head Y-valves or discharge valves.",
  },
  {
    id: "after_secured",
    text: "Verify boat is properly secured (anchor / mooring / dock).",
  },
  { id: "after_dinghy", text: "Verify dinghy is secured." },
];
