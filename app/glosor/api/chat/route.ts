import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { Glosa, WordGradeResult } from "@/lib/glosor/types";

const MODEL = "claude-sonnet-4-6";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = (await req.json()) as {
    glosa: Glosa;
    user_input: string;
    grade: WordGradeResult;
    history: ChatMessage[];
    question: string;
  };
  const { glosa, user_input, grade, history, question } = body;

  if (!glosa?.english || !question?.trim()) {
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
    `You are a friendly Swedish tutor helping a student practice vocabulary. ` +
    `The student just translated a single English word into Swedish and is ` +
    `asking follow-up questions about it.\n\n` +
    `Context of this exercise:\n` +
    `- English prompt: ${glosa.english}\n` +
    `- Correct Swedish: ${glosa.swedish}\n` +
    `- Student wrote: ${user_input}\n` +
    `- Was correct: ${grade.is_correct}\n\n` +
    `Answer the student's questions in English, with Swedish examples in ` +
    `markdown italics. Keep answers concise — usually 2–4 sentences. You can ` +
    `discuss gender (en/ett), definite/plural forms, related words, common ` +
    `phrases, etymology, pronunciation, or anything else the student asks.`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
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
