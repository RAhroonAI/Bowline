import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { Verb, RoundSeed } from "@/lib/varverb/types";

const MODEL = "claude-sonnet-4-6";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { verb } = (await req.json()) as { verb: Verb };
  if (!verb || !verb.infinitive) {
    return NextResponse.json({ error: "Missing verb" }, { status: 400 });
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
    `Create an English sentence whose Swedish translation requires a ` +
    `specific conjugation form of the verb '${verb.infinitive}'.\n\n` +
    `Verb forms:\n` +
    `- infinitive: ${verb.infinitive}\n` +
    `- presens (present): ${verb.presens}\n` +
    `- preteritum (past): ${verb.preteritum}\n` +
    `- supinum (used with har/hade for perfect tenses): ${verb.supinum}\n` +
    `- perfekt_particip (used as adjective): ${verb.perfekt_particip}\n\n` +
    `STRICT REQUIREMENTS:\n` +
    `- Level: B1 (intermediate). Both the English AND the resulting Swedish ` +
    `  must be at B1. No higher.\n` +
    `- Vocabulary: only common everyday words. NO abstract nouns, NO idioms, ` +
    `  NO literary phrasing.\n` +
    `- Topics: daily life — food, family, work, home, weather, transport, ` +
    `  shopping, hobbies, friends, simple feelings, school. NOTHING abstract.\n` +
    `- Length: 5–10 words. Simple grammar.\n` +
    `- Pick the target form by varying across calls. Skip a form whose value is empty.\n\n` +
    `GOOD style: 'I drank coffee this morning.' 'She has lived here for two years.'\n` +
    `BAD style (do NOT produce anything like these): 'The bitter medicine without complaining.' 'He pondered the meaning of suffering.'`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      tools: [
        {
          name: "create_practice_sentence",
          description:
            "Create an English sentence that requires a specific Swedish verb form when translated.",
          input_schema: {
            type: "object",
            properties: {
              target_form: {
                type: "string",
                enum: [
                  "infinitive",
                  "presens",
                  "preteritum",
                  "supinum",
                  "perfekt_particip",
                ],
              },
              english_sentence: { type: "string" },
              expected_swedish: { type: "string" },
            },
            required: ["target_form", "english_sentence", "expected_swedish"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "create_practice_sentence" },
      messages: [{ role: "user", content: prompt }],
    });

    for (const block of response.content) {
      if (block.type === "tool_use") {
        return NextResponse.json(block.input as RoundSeed);
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
