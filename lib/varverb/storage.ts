"use client";

import type { Verb } from "./types";
import seed from "../varverb-seed.json";

const KEY = "varverb.verbs.v1";
const LAST_VERB_KEY = "varverb.lastVerb.v1";

function ensureFields(v: Partial<Verb>): Verb {
  return {
    infinitive: v.infinitive ?? "",
    presens: v.presens ?? "",
    preteritum: v.preteritum ?? "",
    supinum: v.supinum ?? "",
    perfekt_particip: v.perfekt_particip ?? "",
    practice_count: v.practice_count ?? 0,
    correct_count: v.correct_count ?? 0,
    incorrect_count: v.incorrect_count ?? 0,
  };
}

export function loadVerbs(): Verb[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Verb>[];
      return parsed.map(ensureFields);
    }
  } catch {
    // fall through to seed
  }
  // First-time visit: hydrate from the bundled seed list and persist.
  const fresh = (seed as Partial<Verb>[]).map(ensureFields).map((v) => ({
    ...v,
    practice_count: 0,
    correct_count: 0,
    incorrect_count: 0,
  }));
  saveVerbs(fresh);
  return fresh;
}

export function saveVerbs(verbs: Verb[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(verbs));
}

export function recordPractice(infinitive: string, was_correct: boolean): Verb[] {
  const verbs = loadVerbs();
  for (const v of verbs) {
    if (v.infinitive === infinitive) {
      v.practice_count += 1;
      if (was_correct) v.correct_count += 1;
      else v.incorrect_count += 1;
      break;
    }
  }
  saveVerbs(verbs);
  return verbs;
}

export function getLastVerb(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_VERB_KEY);
}

export function setLastVerb(infinitive: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_VERB_KEY, infinitive);
}

export function pickNextVerb(verbs: Verb[], lastInfinitive: string | null): Verb {
  const candidates = verbs.filter((v) => v.infinitive !== lastInfinitive);
  const pool = candidates.length > 0 ? candidates : verbs;
  const scored = [...pool].sort(
    (a, b) =>
      a.practice_count - a.incorrect_count * 2 - (b.practice_count - b.incorrect_count * 2),
  );
  const window = Math.max(5, Math.floor(scored.length / 4));
  const top = scored.slice(0, window);
  return top[Math.floor(Math.random() * top.length)];
}

const ALL_FORMS = [
  "infinitive",
  "presens",
  "preteritum",
  "supinum",
  "perfekt_particip",
] as const;

export function pickTargetForm(verb: Verb): typeof ALL_FORMS[number] {
  const available = ALL_FORMS.filter((f) => {
    const v = verb[f];
    return typeof v === "string" && v.trim() !== "" && v.trim() !== "-";
  });
  if (available.length === 0) return "presens";
  return available[Math.floor(Math.random() * available.length)];
}

const TOPICS = [
  "morning routine at home",
  "weather and seasons",
  "a meal with family",
  "commuting and transport",
  "shopping or errands",
  "a phone call with a friend",
  "weekend plans",
  "feeling tired or surprised",
  "a small problem at work",
  "what someone did yesterday",
  "what someone is doing right now",
  "an everyday object getting broken or fixed",
  "asking for directions or help",
  "a child or a pet",
  "school or studying",
  "cooking or making coffee",
  "a walk in the city",
  "packing or unpacking",
  "the train, the bus, or the car",
  "a small disagreement",
];

export function pickTopic(): string {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

const SEEN_KEY = "varverb.seenSentences.v1";
const MAX_SEEN = 30;

export function getRecentSentences(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function rememberSentence(sentence: string): void {
  if (typeof window === "undefined") return;
  const prev = getRecentSentences();
  const next = [sentence, ...prev.filter((s) => s !== sentence)].slice(0, MAX_SEEN);
  localStorage.setItem(SEEN_KEY, JSON.stringify(next));
}
