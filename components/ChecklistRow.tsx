"use client";

import { Check } from "lucide-react";

type Props = {
  id: string;
  text: string;
  done: boolean;
  conditional?: boolean;
  onToggle: (id: string) => void;
};

export default function ChecklistRow({
  id,
  text,
  done,
  conditional,
  onToggle,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`group flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition
        hover:bg-sand-200/60 active:bg-sand-200
        ${done ? "opacity-50" : ""}`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md border transition
          ${done
            ? "border-terra bg-terra text-white"
            : "border-ink/20 bg-white text-transparent group-hover:border-ink/40"
          }`}
        aria-hidden
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`relative inline text-[15px] leading-relaxed text-ink/90
            ${done ? "line-through decoration-ink/60 decoration-[1.5px]" : ""}`}
        >
          {conditional ? (
            <span
              className="mr-2 inline-flex items-center gap-1 rounded-full bg-terra-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-terra-600"
              title="Added based on the forecast"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-terra" />
              Conditional
            </span>
          ) : null}
          {text}
        </span>
      </span>
    </button>
  );
}
