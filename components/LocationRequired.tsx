"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

export default function LocationRequired() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sea/10 text-sea-600">
        <MapPin className="h-7 w-7" strokeWidth={1.6} />
      </span>
      <h1 className="mt-6 font-serif text-2xl text-ink">Set a location first</h1>
      <p className="mt-2 text-ink/60">
        The forecast and conditional items both depend on where you are.
      </p>
      <Link
        href="/bowline/location"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-terra px-6 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-terra-600"
      >
        Choose a port
      </Link>
    </div>
  );
}
