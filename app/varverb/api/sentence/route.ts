import Anthropic from "@anthropic-ai/sdk";
import { callAnthropicWithRetry, friendlyAnthropicError } from "@/lib/anthropic-retry";
import { NextResponse } from "next/server";
import type { Verb, RoundSeed, TargetForm } from "@/lib/varverb/types";

const MODEL = "claude-opus-4-7";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    verb: Verb;
    target_form?: TargetForm;
    topic?: string;
    avoid?: string[];
  };
  const { verb, target_form, topic, avoid } = body;
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

  const formDirective = target_form
    ? `\nThe target form for this round is: **${target_form}**. Build the sentence so its Swedish translation requires that exact form.`
    : `\nPick the target form yourself, but vary across calls — don't always pick the same one.`;

  const topicDirective = topic
    ? `\nUse the topic: **${topic}**. The sentence should clearly involve this subject matter.`
    : "";

  const avoidDirective =
    avoid && avoid.length > 0
      ? `\n\nIMPORTANT — DO NOT produce any of these sentences (or anything that paraphrases them). Write something genuinely different:\n${avoid
          .map((s) => `- ${s}`)
          .join("\n")}`
      : "";

  const prompt =
    `You are writing a translation exercise for a Swedish learner at LATE A2 / ` +
    `EARLY B1 level. They are still learning basic everyday vocabulary. Write ONE ` +
    `very simple English sentence whose Swedish translation requires a specific ` +
    `conjugation of the verb '${verb.infinitive}'.\n\n` +
    `Imagine you are writing the example sentences in a beginner-friendly Swedish ` +
    `textbook for adults. Sentences must be short, plain, and instantly translatable ` +
    `by someone with a 1500-word vocabulary.\n\n` +
    `Verb forms:\n` +
    `- infinitive: ${verb.infinitive}\n` +
    `- presens: ${verb.presens}\n` +
    `- preteritum: ${verb.preteritum}\n` +
    `- supinum (with har/hade): ${verb.supinum}\n` +
    `- perfekt_particip: ${verb.perfekt_particip}\n` +
    formDirective +
    topicDirective +
    `\n\nVERY STRICT RULES — DO NOT BREAK ANY OF THESE:\n` +
    `- Length: 4–8 words. Short sentences only.\n` +
    `- Vocabulary: ONLY the most common everyday English words. If a word is longer ` +
    `than 8 letters and isn't a proper noun, find a simpler one. Reject any word a ` +
    `Swedish 14-year-old wouldn't have learned in their first English textbook.\n` +
    `- No idioms, no figurative language, no two-part verbs in fancy senses, no formal ` +
    `vocabulary (no "perceive", "obtain", "regard", "approach", "spread the map" — ` +
    `instead use "see", "get", "look at", "go to", "put the map down").\n` +
    `- Grammar: simple present, simple past, or present perfect ONLY. No conditionals, ` +
    `no "if/then", no passive voice, no subjunctive, no modal stacking ("might have been"), ` +
    `no participial phrases.\n` +
    `- Subjects: prefer "I", "she", "he", "we", "they", "my friend", "the kids", or a ` +
    `simple name. Avoid abstract subjects like "the system", "patience", "this idea".\n` +
    `- Topics: concrete daily life — making coffee, taking the bus, calling a friend, ` +
    `eating dinner, washing dishes, walking to school, missing the train, getting tired. ` +
    `NEVER use abstract concepts (justice, freedom, meaning, society, success, etc.).\n` +
    `- Be specific, not philosophical.\n` +
    `- If the verb you're testing is rare or unusual and forces a B2+ sentence, write ` +
    `the simplest possible context for it even if slightly stilted. A plain awkward ` +
    `sentence is better than a smooth complex one.\n\n` +
    `EXAMPLES of the EXACT register I want — match this complexity, not higher:\n` +
    `- "I drank coffee this morning."\n` +
    `- "She is tired today."\n` +
    `- "We took the bus yesterday."\n` +
    `- "He has lived here for years."\n` +
    `- "The kids ate all the bread."\n` +
    `- "Anna called her mother."\n\n` +
    `EXAMPLES of what is FORBIDDEN — do not produce sentences anywhere near this hard:\n` +
    `- "The bitter medicine without complaining."\n` +
    `- "He pondered the meaning of suffering."\n` +
    `- "Patience is a virtue rarely found."\n` +
    `- "Despite the obstacles, she persevered."\n` +
    `- "Had they known, things would be different."\n\n` +
    `CRITICAL — semantic and orthographic accuracy:\n` +
    `- The English verb you use must DIRECTLY mean the Swedish verb. Don't substitute ` +
    `a near-synonym in English. For example: 'sjunken' (perfekt particip of 'sjunka') ` +
    `means SUNK or SUNKEN, NOT 'broken'. If you can't make a natural B1 sentence with ` +
    `the verb's literal English meaning, pick a different verb form to test rather than ` +
    `produce a wrong-meaning sentence.\n` +
    `- Before you finalize, re-read your Swedish translation as if you were a Swedish ` +
    `teacher proofreading a student. Check every word for spelling, gender (en/ett), ` +
    `definite/indefinite forms, and silent letters (e.g. "gångvägen" not "gånvägen", ` +
    `"någon" not "nån" in writing, "och" not "ock").\n` +
    `- If you're uncertain a Swedish word is spelled correctly, choose a simpler word ` +
    `you're sure of. Better a plain sentence than one with a typo.\n` +
    `- Sanity check: read your English sentence and your Swedish translation side by ` +
    `side. The verb in the English MUST mean the same thing as the Swedish verb form. ` +
    `If they don't match exactly in meaning, rewrite.` +
    avoidDirective;

  try {
    const response = await callAnthropicWithRetry(() => client.messages.create({
      model: MODEL,
      max_tokens: 600,
      // Opus 4.7 uses adaptive sampling and doesn't accept a temperature
      // parameter. Variety comes from the per-call topic seed.
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
    }));

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
    return NextResponse.json({ error: friendlyAnthropicError(err) }, { status: 500 });
  }
}
