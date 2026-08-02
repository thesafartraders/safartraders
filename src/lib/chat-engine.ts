import "server-only";
import { knowledgeEntries, type ChatLink } from "@/lib/chat-knowledge";

export type ChatMessage = { role: "user"; content: string };
export type LocalAnswer = { reply: string; entryId: string; followUp?: string[]; link?: ChatLink };
export const AI_DAILY_BUDGET = 100;
let aiCallsToday = 0;
let aiCallsDay = new Date().toISOString().slice(0, 10);

export function normalizeChatText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+]+/g, " ").replace(/\bqty\b/g, "quantity").replace(/\s+/g, " ").trim();
}

export function matchLocal(query: string): LocalAnswer | null {
  const normalized = normalizeChatText(query);
  if (!normalized) return null;
  const words = new Set(normalized.split(" "));
  let best: { entry: (typeof knowledgeEntries)[number]; score: number } | null = null;
  for (const entry of knowledgeEntries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const term = normalizeChatText(keyword);
      if (!term) continue;
      if (term.includes(" ") ? normalized.includes(term) : words.has(term)) score += term.includes(" ") ? 3 : 1;
    }
    if (score && (!best || score + (entry.priority || 0) > best.score + (best.entry.priority || 0))) best = { entry, score };
  }
  if (!best || best.score < 2) return null;
  return { reply: best.entry.answer, entryId: best.entry.id, followUp: best.entry.followUp, link: best.entry.link };
}

export function shouldEscalate(query: string, history: ChatMessage[], match: LocalAnswer | null) {
  return !match && Boolean(query.trim()) && history.length > 0;
}

export function getAiCallsToday() {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== aiCallsDay) { aiCallsDay = day; aiCallsToday = 0; }
  return aiCallsToday;
}

export function incrementAiCalls() {
  getAiCallsToday();
  aiCallsToday += 1;
}

export function buildAiMessages(history: ChatMessage[], _match?: LocalAnswer | null, systemPrompt?: string) {
  return [
    ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
    ...history.slice(-4),
  ];
}
