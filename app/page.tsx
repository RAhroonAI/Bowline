import Link from "next/link";
import { WatercolorBowline } from "@/components/WatercolorBowline";
import { WatercolorVarverb } from "@/components/WatercolorVarverb";
import { WatercolorGlosor } from "@/components/WatercolorGlosor";

export default function SagavikHub() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
      <header className="text-center">
        <div className="mx-auto h-px w-12 bg-terra/60" aria-hidden />
        <h1 className="mt-6 font-serif text-5xl text-ink tracking-tight sm:text-6xl">
          Sagavik
        </h1>
        <p className="mt-4 text-base text-ink/60">
          A small workshop of personal projects.
        </p>
      </header>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ProjectTile
          href="/bowline"
          tag="01 · Sailing"
          title="Bowline"
          oneLiner="The daily checklist for bareboat chartering."
          art={<WatercolorBowline />}
        />
        <ProjectTile
          href="/varverb"
          tag="02 · Verb"
          title="Vårverb"
          oneLiner="Swedish verb practice for the B1 list."
          art={<WatercolorVarverb />}
        />
        <ProjectTile
          href="/glosor"
          tag="03 · Glosor"
          title="Glosor"
          oneLiner="Swedish vocabulary flashcards."
          art={<WatercolorGlosor />}
        />
      </div>

      <p className="mt-16 text-center text-xs uppercase tracking-[0.22em] text-ink/40">
        Floviken
        <span className="mx-2 text-ink/20">·</span>
        <a
          href="https://floviken.se"
          className="border-b border-ink/15 pb-px transition hover:border-ink/40 hover:text-ink/70"
        >
          Clinical AI work
        </a>
      </p>
    </main>
  );
}

function ProjectTile({
  href,
  tag,
  title,
  oneLiner,
  art,
  external,
}: {
  href: string;
  tag: string;
  title: string;
  oneLiner: string;
  art: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "group block overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition hover:border-ink/20 hover:shadow-cardHover";
  const inner = (
    <>
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-sand-200">
        {art}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-transparent" />
      </div>
      <div className="px-5 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-terra-600">
          {tag}
        </p>
        <h2 className="mt-2 font-serif text-2xl text-ink leading-tight">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
          {oneLiner}
        </p>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
