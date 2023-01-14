import openai from "./client";
import { DEFAULT_TEXT_MODEL } from "./client/config";

export async function translate({
  origin,
  target,
  text,
}: {
  origin: string;
  target: string;
  text: string;
}): Promise<string | undefined> {
  const { data } = await openai.createCompletion({
    model: DEFAULT_TEXT_MODEL,
    prompt: `Translate from ${origin} to ${target}:\n${text}`,
    n: 1,
  });

  const { choices } = data;

  if (choices.length === 0) {
    throw new NoTranslationFoundError("No translation found");
  }

  const translated = choices[0].text;
  if (translated) {
    return translated;
  } else {
    throw new NoTranslationFoundError("No translation found");
  }
}

export class NoTranslationFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoTranslationFoundError";
  }
}
