"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FlowHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-terra-600">
        {eyebrow}
      </p>
      <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">
        {title}
      </h1>
    </header>
  );
}
