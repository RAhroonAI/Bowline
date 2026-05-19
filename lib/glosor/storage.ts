"use client";

import type { Glosa } from "./types";
import seed from "../glosor-seed.json";

const KEY = "glosor.words.v1";
const LAST_KEY = "glosor.lastWord.v1";
const SEEN_KEY = "glosor.seenWords.v1";
const MAX_SEEN = 20;

function ensureFields(g: Partial<Glosa>): Glosa {
  return {
    english: g.english ?? "",
    swedish: g.swedish ?? "",
    chapter: g.chapter,
    example: g.example,
    notes: g.notes,
    practice_count: g.practice_count ?? 0,
    correct_count: g.correct_count ?? 0,
    incorrect_count: g.incorrect_count ?? 0,
  };
}

export const ALL_CHAPTERS = "(all)";
export const NO_CHAPTER = "(uncategorized)";

export function listChapters(glosor: Glosa[]): string[] {
  const set = new Set<string>();
  for (const g of glosor) {
    if (g.chapter && g.chapter.trim() !== "") set.add(g.chapter.trim());
  }
  return Array.from(set).sort();
}

export function filterByChapter(glosor: Glosa[], chapter: string): Glosa[] {
  if (chapter === ALL_CHAPTERS) return glosor;
  if (chapter === NO_CHAPTER) return glosor.filter((g) => !g.chapter || g.chapter.trim() === "");
  return glosor.filter((g) => g.chapter === chapter);
}

export function loadGlosor(): Glosa[] {
  if (typeof window === "undefined") return [];

  const seedGlosor = (seed as Partial<Glosa>[]).map(ensureFields);

  let stored: Glosa[] = [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      stored = (JSON.parse(raw) as Partial<Glosa>[]).map(ensureFields);
    }
  } catch {
    // fall through to seed
  }

  if (stored.length === 0) {
    saveGlosor(seedGlosor);
    return seedGlosor;
  }

  // Merge: add any new seed words that aren't already in localStorage.
  // Existing rows keep their practice stats.
  const storedEnglish = new Set(stored.map((g) => g.english));
  const newOnes = seedGlosor.filter((g) => !storedEnglish.has(g.english));
  if (newOnes.length > 0) {
    const merged = [...stored, ...newOnes];
    saveGlosor(merged);
    return merged;
  }
  return stored;
}

export function saveGlosor(glosor: Glosa[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(glosor));
}

export function recordGlosaPractice(
  english: string,
  was_correct: boolean,
): Glosa[] {
  const glosor = loadGlosor();
  for (const g of glosor) {
    if (g.english === english) {
      g.practice_count += 1;
      if (was_correct) g.correct_count += 1;
      else g.incorrect_count += 1;
      break;
    }
  }
  saveGlosor(glosor);
  return glosor;
}

export function getLastGlosa(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_KEY);
}

export function setLastGlosa(english: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_KEY, english);
}

export function pickNextGlosa(glosor: Glosa[], lastEnglish: string | null): Glosa {
  if (glosor.length === 0) {
    throw new Error("pickNextGlosa called with empty list");
  }
  const recent = new Set(getRecentGlosaEnglish());
  if (lastEnglish) recent.add(lastEnglish);

  // Build candidate pool: exclude recently-shown words if possible.
  let candidates = glosor.filter((g) => !recent.has(g.english));
  if (candidates.length === 0) {
    candidates = glosor.filter((g) => g.english !== lastEnglish);
    if (candidates.length === 0) candidates = glosor;
  }

  // Tier 1: untouched words first.
  const untouched = candidates.filter((g) => g.practice_count === 0);
  if (untouched.length > 0) {
    return untouched[Math.floor(Math.random() * untouched.length)];
  }

  // Tier 2: weighted random favoring least-practiced + most-missed.
  const weighted = candidates.map((g) => ({
    glosa: g,
    weight: 1 / (g.practice_count + 1) + g.incorrect_count * 0.75,
  }));
  const total = weighted.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.glosa;
  }
  return weighted[weighted.length - 1].glosa;
}

export function getRecentGlosaEnglish(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function rememberGlosa(english: string): void {
  if (typeof window === "undefined") return;
  const prev = getRecentGlosaEnglish();
  const next = [english, ...prev.filter((s) => s !== english)].slice(0, MAX_SEEN);
  localStorage.setItem(SEEN_KEY, JSON.stringify(next));
}
