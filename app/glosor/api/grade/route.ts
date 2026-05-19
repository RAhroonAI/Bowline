import Anthropic from "@anthropic-ai/sdk";
import { callAnthropicWithRetry, friendlyAnthropicError } from "@/lib/anthropic-retry";
import { NextResponse } from "next/server";
import type { Glosa, WordGradeResult } from "@/lib/glosor/types";

const MODEL = "claude-haiku-4-5";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { glosa, user_swedish } = (await req.json()) as {
    glosa: Glosa;
    user_swedish: string;
  };

  if (!glosa?.english || !user_swedish) {
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

  const prompt =
    `You are grading a Swedish vocabulary exercise for a B1 learner.\n\n` +
    `English prompt: ${glosa.english}\n` +
    `Reference correct Swedish answer: ${glosa.swedish}\n` +
    `Student wrote: ${user_swedish}\n\n` +
    `Grade the student's answer. Accept any valid Swedish translation of the ` +
    `English — there can be more than one correct answer (e.g., synonyms). ` +
    `For nouns, the en/ett article matters: if the English prompt clearly ` +
    `indicates an indefinite noun ("a book"), the student should include the ` +
    `correct article (en/ett); if the English uses "the", the definite form ` +
    `is expected; if no article is implied, either is fine.\n\n` +
    `Check: spelling, en/ett gender, definite/indefinite form, plural form ` +
    `if applicable.\n\n` +
    `In \`corrected_swedish\`: if correct, return the student's text unchanged; ` +
    `if incorrect, return the corrected version.\n\n` +
    `In \`explanation\`: 1–3 sentences in English explaining mistakes and why. ` +
    `If correct, briefly affirm what they did right. Use markdown for emphasis ` +
    `on Swedish words (e.g. *boken*).\n\n` +
    `In \`word_explanation\`: 1–3 sentences in English about the Swedish word ` +
    `'${glosa.swedish}' — its meaning, gender if relevant, definite/plural ` +
    `forms, a useful example sentence. Use markdown for Swedish examples.`;

  try {
    const response = await callAnthropicWithRetry(() => client.messages.create({
      model: MODEL,
      max_tokens: 600,
      temperature: 0.3,
      tools: [
        {
          name: "grade_word",
          description: "Grade a Swedish vocabulary answer.",
          input_schema: {
            type: "object",
            properties: {
              is_correct: { type: "boolean" },
              corrected_swedish: { type: "string" },
              explanation: { type: "string" },
              word_explanation: { type: "string" },
            },
            required: [
              "is_correct",
              "corrected_swedish",
              "explanation",
              "word_explanation",
            ],
          },
        },
      ],
      tool_choice: { type: "tool", name: "grade_word" },
      messages: [{ role: "user", content: prompt }],
    }));

    for (const block of response.content) {
      if (block.type === "tool_use") {
        return NextResponse.json(block.input as WordGradeResult);
      }
    }
    return NextResponse.json(
      { error: "Model did not return a tool call" },
      { status: 500 },
    );
  } catch (err) {
    return NextResponse.json({ error: friendlyAnthropicError(err) }, { status: 500 });
  }
}
