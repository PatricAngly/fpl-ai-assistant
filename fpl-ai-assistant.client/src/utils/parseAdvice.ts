import { Advice } from "../types/Advice";

export function parseAdvice(rawAdvice: string): Advice | null {
  if (!rawAdvice) return null;

  let cleaned = rawAdvice.trim();

  // Remove Markdown-format: ```json ... ```
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.warn("Kunde inte parsa OpenAI-svar:", error);
    return null;
  }
}
