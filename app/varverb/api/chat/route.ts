import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { Verb, RoundSeed, GradeResult } from "@/lib/varverb/types";

const MODEL = "claude-sonnet-4-6";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = (await req.json()) as {
    verb: Verb;
    seed: RoundSeed;
    user_input: string;
    grade: GradeResult;
    history: ChatMessage[];
    question: string;
  };
  const { verb, seed, user_input, grade, history, question } = body;

  if (!verb?.infinitive || !seed?.english_sentence || !question?.trim()) {
    return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server missing ANTHROPIC_API_KEY" },
      { status: 500 },
    );
  }

  const client = new Anthropic({ apiKey });

  const system =
    `You are a friendly Swedish tutor helping a student practice. The student ` +
    `just completed a translation exercise and is asking follow-up questions ` +
    `about it.\n\n` +
    `Context of this exercise:\n` +
    `- Verb being practiced: ${verb.infinitive}\n` +
    `- All forms: infinitive=${verb.infinitive}, presens=${verb.presens}, ` +
    `preteritum=${verb.preteritum}, supinum=${verb.supinum}, ` +
    `perfekt_particip=${verb.perfekt_particip}\n` +
    `- English sentence given: ${seed.english_sentence}\n` +
    `- Target form: ${seed.target_form}\n` +
    `- Expected Swedish: ${seed.expected_swedish}\n` +
    `- Student wrote: ${user_input}\n` +
    `- Was correct: ${grade.is_correct}\n` +
    `- Corrected Swedish: ${grade.corrected_swedish}\n\n` +
    `Answer the student's questions in English (with Swedish examples where ` +
    `useful). Keep answers concise — usually 2–4 sentences. Use markdown for ` +
    `emphasis on Swedish words (e.g. *blivit*). You can discuss vocabulary, ` +
    `grammar, conjugation, pronunciation, similar words, or anything else the ` +
    `student asks. Be patient and clear.`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      system,
      messages: [
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: question },
      ],
    });

    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");
    return NextResponse.json({ answer: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
