"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import {
  loadVerbs,
  pickNextVerb,
  pickTargetForm,
  pickTopic,
  recordPractice,
  setLastVerb,
  getLastVerb,
  getRecentSentences,
  rememberSentence,
} from "@/lib/varverb/storage";
import type { Verb, RoundSeed, GradeResult } from "@/lib/varverb/types";

type Stage = "ready" | "exercise" | "graded";
type ChatMessage = { role: "user" | "assistant"; content: string };

export default function VarverbPage() {
  const [verbs, setVerbs] = useState<Verb[] | null>(null);
  const [stage, setStage] = useState<Stage>("ready");
  const [activeVerb, setActiveVerb] = useState<Verb | null>(null);
  const [seed, setSeed] = useState<RoundSeed | null>(null);
  const [userInput, setUserInput] = useState("");
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [picked, setPicked] = useState<string>("(smart)");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    setVerbs(loadVerbs());
  }, []);

  if (!verbs) {
    return <main className="min-h-screen" aria-hidden />;
  }

  const totalPractices = verbs.reduce((s, v) => s + v.practice_count, 0);
  const untouched = verbs.filter((v) => v.practice_count === 0).length;

  async function startRoundFor(verb: Verb) {
    setError(null);
    setLoading(true);
    setStage("exercise");
    setActiveVerb(verb);
    setSeed(null);
    setGrade(null);
    setUserInput("");
    setChatHistory([]);
    setChatInput("");
    setLastVerb(verb.infinitive);
    try {
      const target_form = pickTargetForm(verb);
      const topic = pickTopic();
      const avoid = getRecentSentences();
      const res = await fetch("/varverb/api/sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verb, target_form, topic, avoid }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const round = (await res.json()) as RoundSeed;
      rememberSentence(round.english_sentence);
      setSeed(round);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start round");
    } finally {
      setLoading(false);
    }
  }

  async function startRound() {
    const verb =
      picked === "(smart)"
        ? pickNextVerb(verbs!, getLastVerb())
        : verbs!.find((v) => v.infinitive === picked)!;
    await startRoundFor(verb);
  }

  async function nextRound() {
    // Always smart-pick for the in-session Next button so the user
    // keeps moving through new verbs without going back to the menu.
    const verb = pickNextVerb(verbs!, getLastVerb());
    await startRoundFor(verb);
  }

  function endSession() {
    setStage("ready");
    setActiveVerb(null);
    setSeed(null);
    setGrade(null);
    setUserInput("");
    setChatHistory([]);
    setChatInput("");
    setError(null);
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const question = chatInput.trim();
    if (!question || !activeVerb || !seed || !grade) return;
    setChatLoading(true);
    setChatInput("");
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user", content: question },
    ];
    setChatHistory(newHistory);
    try {
      const res = await fetch("/varverb/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verb: activeVerb,
          seed,
          user_input: userInput,
          grade,
          history: chatHistory,
          question,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const { answer } = (await res.json()) as { answer: string };
      setChatHistory([...newHistory, { role: "assistant", content: answer }]);
    } catch (e) {
      setChatHistory([
        ...newHistory,
        {
          role: "assistant",
          content: `_Couldn't get a response: ${
            e instanceof Error ? e.message : "unknown error"
          }_`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  async function submitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!userInput.trim() || !activeVerb || !seed) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/varverb/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verb: activeVerb,
          seed,
          user_swedish: userInput.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const result = (await res.json()) as GradeResult;
      setGrade(result);
      setStage("graded");
      const updated = recordPractice(activeVerb.infinitive, result.is_correct);
      setVerbs(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to grade");
    } finally {
      setLoading(false);
    }
  }

  async function speakSwedish(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voice = await getSwedishVoice();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "sv-SE";
    utterance.rate = 0.95;
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-ink/50 transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Sagavik
        </Link>
        <span className="rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/60">
          {totalPractices} attempts · {verbs.length} verbs
        </span>
      </div>

      <header className="text-center">
        <div className="mx-auto h-px w-12 bg-terra/60" aria-hidden />
        <h1 className="mt-5 font-serif text-5xl text-ink tracking-tight">
          Vårverb
        </h1>
        <p className="mt-3 text-base text-ink/60">
          A small spring lab for the B1 verb list.
        </p>
      </header>

      {error && (
        <div className="mt-6 rounded-2xl border border-terra/40 bg-terra-50 px-5 py-3 text-sm text-terra-600">
          {error}
        </div>
      )}

      {stage === "ready" && (
        <ReadyCard
          total={verbs.length}
          untouched={untouched}
          picked={picked}
          options={[
            "(smart)",
            ...verbs.map((v) => v.infinitive).sort(),
          ]}
          onPick={setPicked}
          onStart={startRound}
          loading={loading}
        />
      )}

      {stage === "exercise" && seed && (
        <ExerciseCard
          english={seed.english_sentence}
          userInput={userInput}
          setUserInput={setUserInput}
          onSubmit={submitAnswer}
          loading={loading}
        />
      )}

      {stage === "graded" && seed && grade && activeVerb && (
        <ResultCard
          english={seed.english_sentence}
          grade={grade}
          verb={activeVerb}
          targetForm={seed.target_form}
          userInput={userInput}
          loading={loading}
          chatHistory={chatHistory}
          chatInput={chatInput}
          chatLoading={chatLoading}
          onChatInput={setChatInput}
          onChatSubmit={sendChat}
          onNext={nextRound}
          onEnd={endSession}
          onSpeak={() => speakSwedish(grade.corrected_swedish)}
        />
      )}
    </main>
  );
}

function ReadyCard({
  total,
  untouched,
  picked,
  options,
  onPick,
  onStart,
  loading,
}: {
  total: number;
  untouched: number;
  picked: string;
  options: string[];
  onPick: (v: string) => void;
  onStart: () => void;
  loading: boolean;
}) {
  return (
    <>
      <section className="mt-10 rounded-2xl border border-ink/8 bg-white px-8 py-12 text-center shadow-card animate-fadeIn">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terra-600">
          Ready to begin
        </p>
        <p className="mt-6 font-serif text-2xl text-ink leading-snug">
          {total} verbs in the list.
          <br />
          <span className="text-ink/60">{untouched} not yet practiced.</span>
        </p>
      </section>

      <div className="mx-auto mt-6 w-full max-w-xs">
        <label className="sr-only" htmlFor="verb-picker">
          Verb to drill
        </label>
        <div className="relative">
          <select
            id="verb-picker"
            value={picked}
            onChange={(e) => onPick(e.target.value)}
            className="w-full appearance-none rounded-xl border border-ink/15 bg-white px-4 py-3 pr-10 font-sans text-sm text-ink shadow-card focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "(smart)"
                  ? "✦  Smart pick — least practiced first"
                  : opt}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <button
          type="button"
          onClick={onStart}
          disabled={loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sea px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-card transition hover:bg-sea-600 hover:shadow-cardHover disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner /> Making a sentence…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Start practice
            </>
          )}
        </button>
      </div>
    </>
  );
}

function ExerciseCard({
  english,
  userInput,
  setUserInput,
  onSubmit,
  loading,
}: {
  english: string;
  userInput: string;
  setUserInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) {
  return (
    <>
      <section className="mt-10 rounded-2xl border border-ink/8 bg-white px-8 py-12 text-center shadow-card animate-fadeIn">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terra-600">
          Translate to Swedish
        </p>
        <p className="mt-6 font-serif text-2xl text-ink leading-snug">{english}</p>
      </section>

      <form onSubmit={onSubmit} className="mx-auto mt-6 w-full max-w-xs">
        <label className="sr-only" htmlFor="translation-input">
          Your Swedish translation
        </label>
        <input
          id="translation-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Skriv på svenska…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-sans text-base text-ink shadow-card placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20"
        />
        <button
          type="submit"
          disabled={loading || !userInput.trim()}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sea px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-card transition hover:bg-sea-600 hover:shadow-cardHover disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner /> Grading…
            </>
          ) : (
            "Check"
          )}
        </button>
      </form>
    </>
  );
}

function ResultCard({
  english,
  grade,
  verb,
  targetForm,
  userInput,
  loading,
  chatHistory,
  chatInput,
  chatLoading,
  onChatInput,
  onChatSubmit,
  onNext,
  onEnd,
  onSpeak,
}: {
  english: string;
  grade: GradeResult;
  verb: Verb;
  targetForm: string;
  userInput: string;
  loading: boolean;
  chatHistory: ChatMessage[];
  chatInput: string;
  chatLoading: boolean;
  onChatInput: (v: string) => void;
  onChatSubmit: (e: React.FormEvent) => void;
  onNext: () => void;
  onEnd: () => void;
  onSpeak: () => void;
}) {
  const correct = grade.is_correct;
  return (
    <>
      <section className="mt-10 rounded-2xl border border-ink/8 bg-white px-8 py-10 text-center shadow-card animate-fadeIn">
        <div
          className={`font-serif text-5xl leading-none ${
            correct ? "text-emerald-600" : "text-terra-600"
          }`}
        >
          {correct ? "✓" : "✗"}
        </div>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50">
          {correct ? "Correct" : "Not quite"} · {english}
        </p>
        <p className="mt-4 font-serif text-2xl italic text-ink leading-snug">
          “{grade.corrected_swedish}”
        </p>
        <p className="mt-2 text-sm text-ink/55">
          You wrote: <em>{userInput}</em>
        </p>
      </section>

      <div className="mx-auto mt-5 flex w-full max-w-md gap-3">
        <button
          type="button"
          onClick={onSpeak}
          className="flex-1 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink shadow-card transition hover:border-ink/30 hover:shadow-cardHover"
        >
          🔊 Hear it
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-sea px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-card transition hover:bg-sea-600 hover:shadow-cardHover disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner /> Loading…
            </>
          ) : (
            "Next verb →"
          )}
        </button>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={onEnd}
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/45 transition hover:text-ink/70"
        >
          End practice
        </button>
      </div>

      <section className="mt-8 border-t border-ink/10 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sea-600">
          The verb · form tested: {targetForm}
        </p>
        <h2 className="mt-2 font-serif text-2xl italic text-ink">
          {verb.infinitive}
        </h2>

        <div className="mt-4 overflow-hidden rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand-200">
              <tr>
                {["Infinitive", "Presens", "Preteritum", "Supinum", "Perfekt particip"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-ink/60"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2.5 font-semibold text-ink">{verb.infinitive}</td>
                <td className="px-3 py-2.5 text-ink/80">{verb.presens}</td>
                <td className="px-3 py-2.5 text-ink/80">{verb.preteritum}</td>
                <td className="px-3 py-2.5 text-ink/80">{verb.supinum}</td>
                <td className="px-3 py-2.5 text-ink/80">{verb.perfekt_particip}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm leading-relaxed text-ink/80">
          <MarkdownText text={grade.verb_explanation} />
        </div>

        <h3 className="mt-6 font-serif text-lg italic text-ink/80">
          Your translation
        </h3>
        <div className="mt-2 text-sm leading-relaxed text-ink/80">
          <MarkdownText text={grade.explanation} />
        </div>
      </section>

      <section className="mt-8 border-t border-ink/10 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sea-600">
          Follow-up
        </p>
        <p className="mt-1 text-sm text-ink/55">
          Ask about the verb, the sentence, grammar, anything.
        </p>

        {chatHistory.length > 0 && (
          <div className="mt-4 space-y-3">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.role === "user"
                    ? "rounded-2xl rounded-tr-md bg-sea/10 px-4 py-3 text-sm text-ink"
                    : "rounded-2xl rounded-tl-md bg-sand-200 px-4 py-3 text-sm leading-relaxed text-ink/85"
                }
              >
                {msg.role === "assistant" ? (
                  <MarkdownText text={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="rounded-2xl rounded-tl-md bg-sand-200 px-4 py-3 text-sm text-ink/55">
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Thinking…
                </span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={onChatSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => onChatInput(e.target.value)}
            placeholder="Ask anything…"
            disabled={chatLoading}
            autoComplete="off"
            autoCorrect="off"
            className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink shadow-card placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={chatLoading || !chatInput.trim()}
            className="flex-none rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-card transition hover:border-ink/30 hover:shadow-cardHover disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </section>
    </>
  );
}

function MarkdownText({ text }: { text: string }) {
  // Lightweight rendering: convert *italic* to <em>, **bold** to <strong>,
  // and `code` to <code>. Avoids pulling in a full markdown library.
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="rounded bg-sand-200 px-1.5 py-0.5 font-mono text-[0.88em] text-ink"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <p>{parts}</p>;
}

// Voice loading is async in some browsers. Cache the selected voice
// across speakSwedish calls so it doesn't fall back to the default
// (often English) voice on subsequent calls.
let cachedSwedishVoice: SpeechSynthesisVoice | null | undefined = undefined;

async function getSwedishVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedSwedishVoice !== undefined) return cachedSwedishVoice;
  if (typeof window === "undefined" || !window.speechSynthesis) {
    cachedSwedishVoice = null;
    return null;
  }

  let voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // Voices not yet loaded — wait for the voiceschanged event (max 1 second)
    voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
      const timeout = setTimeout(() => {
        resolve(window.speechSynthesis.getVoices());
      }, 1000);
      window.speechSynthesis.addEventListener(
        "voiceschanged",
        () => {
          clearTimeout(timeout);
          resolve(window.speechSynthesis.getVoices());
        },
        { once: true },
      );
    });
  }

  // Prefer Swedish, then prefer local (higher-quality) voices.
  const swedish = voices.filter((v) => v.lang.toLowerCase().startsWith("sv"));
  if (swedish.length === 0) {
    cachedSwedishVoice = null;
    return null;
  }
  const local = swedish.find((v) => v.localService);
  cachedSwedishVoice = local || swedish[0];
  return cachedSwedishVoice;
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
