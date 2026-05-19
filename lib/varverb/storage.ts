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
    chapter: v.chapter,
    practice_count: v.practice_count ?? 0,
    correct_count: v.correct_count ?? 0,
    incorrect_count: v.incorrect_count ?? 0,
  };
}

export const ALL_VERB_CHAPTERS = "(all)";

export function listVerbChapters(verbs: Verb[]): string[] {
  const set = new Set<string>();
  for (const v of verbs) {
    if (v.chapter && v.chapter.trim() !== "") set.add(v.chapter.trim());
  }
  return Array.from(set).sort();
}

export function filterVerbsByChapter(verbs: Verb[], chapter: string): Verb[] {
  if (chapter === ALL_VERB_CHAPTERS) return verbs;
  return verbs.filter((v) => v.chapter === chapter);
}

export function loadVerbs(): Verb[] {
  if (typeof window === "undefined") return [];

  const seedVerbs = (seed as Partial<Verb>[]).map((v) =>
    ensureFields({
      ...v,
      practice_count: 0,
      correct_count: 0,
      incorrect_count: 0,
    }),
  );

  let stored: Verb[] = [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      stored = (JSON.parse(raw) as Partial<Verb>[]).map(ensureFields);
    }
  } catch {
    // fall through to seed
  }

  if (stored.length === 0) {
    saveVerbs(seedVerbs);
    return seedVerbs;
  }

  // Merge: add any new seed verbs that aren't already in localStorage.
  // Preserves practice stats for existing rows; new words start at zero.
  const storedInfs = new Set(stored.map((v) => v.infinitive));
  const newOnes = seedVerbs.filter((v) => !storedInfs.has(v.infinitive));
  if (newOnes.length > 0) {
    const merged = [...stored, ...newOnes];
    saveVerbs(merged);
    return merged;
  }
  return stored;
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

const RECENT_VERBS_KEY = "varverb.recentInfinitives.v1";
const MAX_RECENT_VERBS = 10;

export function getRecentInfinitives(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_VERBS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function rememberInfinitive(infinitive: string): void {
  if (typeof window === "undefined") return;
  const prev = getRecentInfinitives();
  const next = [infinitive, ...prev.filter((s) => s !== infinitive)].slice(0, MAX_RECENT_VERBS);
  localStorage.setItem(RECENT_VERBS_KEY, JSON.stringify(next));
}

export function pickNextVerb(verbs: Verb[], lastInfinitive: string | null): Verb {
  if (verbs.length === 0) {
    throw new Error("pickNextVerb called with empty list");
  }
  const recent = new Set(getRecentInfinitives());
  if (lastInfinitive) recent.add(lastInfinitive);

  // Build candidate pool: exclude recently-shown verbs if possible.
  let candidates = verbs.filter((v) => !recent.has(v.infinitive));
  if (candidates.length === 0) {
    // All verbs are recent — relax and only exclude the very last one.
    candidates = verbs.filter((v) => v.infinitive !== lastInfinitive);
    if (candidates.length === 0) candidates = verbs;
  }

  // Tier 1: any never-practiced verbs are highest priority.
  const untouched = candidates.filter((v) => v.practice_count === 0);
  if (untouched.length > 0) {
    return untouched[Math.floor(Math.random() * untouched.length)];
  }

  // Tier 2: weighted random across remaining candidates.
  // Lower practice_count and higher incorrect_count → higher weight.
  const weighted = candidates.map((v) => ({
    verb: v,
    weight: 1 / (v.practice_count + 1) + v.incorrect_count * 0.75,
  }));
  const total = weighted.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.verb;
  }
  return weighted[weighted.length - 1].verb;
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
