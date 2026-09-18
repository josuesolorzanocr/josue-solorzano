import Anthropic from "@anthropic-ai/sdk";

/** Cliente por demanda: el build no debe depender de la llave. */
let cliente: Anthropic | null = null;
export function anthropic(): Anthropic {
  if (cliente) return cliente;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Falta ANTHROPIC_API_KEY.");
  cliente = new Anthropic({ apiKey });
  return cliente;
}

export const MODELO = "claude-sonnet-5";

/** El texto de una respuesta de Claude, sin bloques que no sean texto. */
export function textoDe(r: Anthropic.Message): string {
  return r.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}
