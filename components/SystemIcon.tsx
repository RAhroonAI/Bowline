"use client";

import {
  Anchor,
  CircleDot,
  Cog,
  Compass,
  Droplet,
  LifeBuoy,
  Sailboat,
  ShieldCheck,
  Utensils,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import type { SystemGroup } from "@/lib/types";

const MAP = {
  Zap,
  Droplet,
  CircleDot,
  Cog,
  Utensils,
  Compass,
  Wrench,
  Sailboat,
  Anchor,
  Wind,
  LifeBuoy,
  ShieldCheck,
} as const;

export default function SystemIcon({
  name,
  className,
}: {
  name: SystemGroup["icon"];
  className?: string;
}) {
  const Icon = MAP[name];
  return <Icon className={className} strokeWidth={1.6} />;
}
