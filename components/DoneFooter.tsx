"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function DoneFooter({
  total,
  done,
}: {
  total: number;
  done: number;
}) {
  const router = useRouter();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="sticky bottom-4 mt-8">
      <div className="rounded-full border border-ink/10 bg-white/95 p-1.5 shadow-cardHover backdrop-blur">
        <div className="flex items-center gap-3 pl-4 pr-1.5">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-ink/50">
              Progress
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
              <div
                className="h-full rounded-full bg-terra transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="inline-flex h-12 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-ink-700"
          >
            <Check className="h-4 w-4" strokeWidth={2.4} />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
