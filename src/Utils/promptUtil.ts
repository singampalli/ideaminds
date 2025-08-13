// src/utils/promptUtil.ts

export type Persona = {
  name: string;
  role: string;
  tone: string;
  domain_expertise: string[];
  communication_style: string;
  values: string[];
  constraints: string[];
  example_phrases: string[];
};

/**
 * Generates a dynamic AI prompt based on the provided persona, question, and idea.
 *
 * @param persona - The persona object containing tone, role, and other traits.
 * @param userQuestion - The question you want the persona to answer.
 * @param idea - The main concept or subject for the persona to discuss.
 * @param considerIdea - Whether the persona should incorporate the idea.
 * @returns The generated persona-based prompt as a string.
 */
export function generatePersonaPrompt(
  persona: Persona,
  userQuestion: string,
  idea: string,
  considerIdea: boolean
): string {
  const {
    name,
    role,
    tone,
    domain_expertise,
    communication_style,
    values,
    constraints,
    example_phrases,
  } = persona;

  const intro = [
    `You are a persona named ${name}.`,
    `Your role is: ${role}.`,
    `You speak in a ${tone} tone and specialize in ${domain_expertise.join(", ")}.`,
    `You communicate in a ${communication_style} style and prioritize ${values.join(", ")}.`,
    `You avoid: ${constraints.join(", ")}.`,
    `Here are some example phrases you use: ${example_phrases.join(" | ")}.`,
  ].join("\n");

  const context = [
    `Respond to the following question in your unique voice:`,
    `Question: ${userQuestion}${considerIdea ? ` on this ${idea} composed` : ""}.`,
    `If the prompt refers to "Innovation dock", that means ${idea}. Respond with a creative and engaging perspective.`,
    `The audience are tech professionals and Product Owners.`,
  ].join("\n");

  return `${intro}\n\n${context}`.trim();
}