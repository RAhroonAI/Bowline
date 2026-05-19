import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { Verb, RoundSeed, GradeResult } from "@/lib/varverb/types";

const MODEL = "claude-sonnet-4-5";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { verb, seed, user_swedish } = (await req.json()) as {
    verb: Verb;
    seed: RoundSeed;
    user_swedish: string;
  };

  if (!verb?.infinitive || !seed?.english_sentence || !user_swedish) {
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
    `You are grading a Swedish translation exercise for a B1-level learner.\n\n` +
    `English sentence given: ${seed.english_sentence}\n\n` +
    `Target verb: ${verb.infinitive}\n` +
    `Forms: infinitive=${verb.infinitive}, presens=${verb.presens}, ` +
    `preteritum=${verb.preteritum}, supinum=${verb.supinum}, ` +
    `perfekt_particip=${verb.perfekt_particip}\n` +
    `Target form expected: ${seed.target_form}\n\n` +
    `Reference correct translation: ${seed.expected_swedish}\n\n` +
    `Student's translation: ${user_swedish}\n\n` +
    `Grade the translation. Accept ANY valid Swedish translation (don't insist ` +
    `on the reference if the student's version is also correct). Check: verb ` +
    `conjugation, en/ett gender, word order, spelling, adjective agreement, ` +
    `prepositions, definite/indefinite forms.\n\n` +
    `In \`corrected_swedish\`: if correct, return the student's text unchanged; ` +
    `if incorrect, return the corrected version.\n\n` +
    `In \`explanation\`: 2–5 sentences in English explaining mistakes and why. ` +
    `If correct, briefly affirm what they did right. Use markdown for emphasis ` +
    `on Swedish words (e.g. *blivit*).\n\n` +
    `In \`verb_explanation\`: 2–3 sentences in English about the target verb ` +
    `'${verb.infinitive}' — what it means, when it's used, any quirks or common ` +
    `patterns. Use markdown for Swedish examples.`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      tools: [
        {
          name: "grade_swedish_translation",
          description: "Grade a student's Swedish translation attempt.",
          input_schema: {
            type: "object",
            properties: {
              is_correct: { type: "boolean" },
              corrected_swedish: { type: "string" },
              explanation: { type: "string" },
              verb_explanation: { type: "string" },
            },
            required: [
              "is_correct",
              "corrected_swedish",
              "explanation",
              "verb_explanation",
            ],
          },
        },
      ],
      tool_choice: { type: "tool", name: "grade_swedish_translation" },
      messages: [{ role: "user", content: prompt }],
    });

    for (const block of response.content) {
      if (block.type === "tool_use") {
        return NextResponse.json(block.input as GradeResult);
      }
    }
    return NextResponse.json(
      { error: "Model did not return a tool call" },
      { status: 500 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
