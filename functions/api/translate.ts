// Cloudflare Pages Functions — Hardened Translate API

export interface Env { GEMINI_API_KEY: string; }

const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};

function normLang(v?: string) {
  if (!v) return undefined;
  const x = v.toLowerCase().trim();
  if (["ko","kr","korean"].includes(x)) return "ko";
  if (["en","eng","english","en-us","en-gb"].includes(x)) return "en";
  return x;
}
function langDisplayName(code?: string) {
  switch (code) { case "ko": return "Korean"; case "en": return "English"; default: return code || ""; }
}
function splitIntoChunks(input: string, max = 3000) {
  const chunks: string[] = []; const paras = input.split(/\n{2,}/); let buf = "";
  const push = () => { if (buf.trim()) { chunks.push(buf); buf = ""; } };
  for (const p of paras) {
    if ((buf + "\n\n" + p).length <= max) { buf = buf ? `${buf}\n\n${p}` : p; }
    else if (p.length <= max) { push(); buf = p; }
    else {
      const sents = p.split(/(?<=[.!?…])\s+/);
      for (const s of sents) {
        if ((buf + " " + s).length <= max) { buf = buf ? `${buf} ${s}` : s; }
        else if (s.length <= max) { push(); buf = s; }
        else { let i = 0; while (i < s.length) { const piece = s.slice(i, i + max); if (buf) push(); chunks.push(piece); i += max; } buf = ""; }
      }
    }
  }
  push(); return chunks.length ? chunks : [input];
}
type ReqBody = { text: string; target?: string; source?: string; formal?: "formal" | "casual"; };

function buildPrompt({ text, target = "ko", source, formal }: ReqBody) {
  const tgt = normLang(target) || "ko"; const src = normLang(source); const tgtName = langDisplayName(tgt);
  const styleHint = tgt === "ko"
    ? (formal === "casual"
        ? "Write naturally in Korean, casual but respectful tone suitable for web UI."
        : "Write naturally in Korean with a clear, polished, respectful tone (존댓말).")
    : "Write naturally with a clear, polished tone appropriate for web content.";
  const detectLine = src ? `Source language is ${langDisplayName(src)}.` : "Detect the source language automatically.";
  return [
    "You are a professional translator for a bilingual artist website (Auralis).",
    detectLine,
    `Translate the following text into ${tgtName}.`,
    styleHint,
    "Preserve line breaks and paragraph structure.",
    "Do not add headings, lists, quotes, or code fences.",
    "Output only the translated text — no prefixes or explanations.",
    "",
    "----- BEGIN TEXT -----",
    text,
    "----- END TEXT -----",
  ].join("\n");
}

async function callGemini(apiKey: string, prompt: string, timeoutMs = 20000, attempt = 0): Promise<string> {
  const controller = new AbortController(); const t = setTimeout(() => controller.abort(), timeoutMs);
  const model = "gemini-2.5-flash";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 2048 } };
  try {
    const resp = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
    const raw = await resp.text();
    if (!resp.ok) {
      if ((resp.status === 429 || resp.status >= 500) && attempt < 2) {
        const backoff = 500 * Math.pow(2, attempt); await new Promise(r => setTimeout(r, backoff));
        return callGemini(apiKey, prompt, timeoutMs, attempt + 1);
      }
      throw new Error(`Gemini error ${resp.status}: ${raw}`);
    }
    let data: any; try { data = JSON.parse(raw); } catch { throw new Error(`Invalid JSON from Gemini: ${raw}`); }
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("").trim() || "";
    const finish = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || null;
    if (!text) throw new Error(`Empty translation (finishReason=${finish})`);
    return text;
  } catch (err: any) {
    if (attempt < 2) { const backoff = 700 * Math.pow(2, attempt); await new Promise(r => setTimeout(r, backoff)); return callGemini(apiKey, prompt, timeoutMs, attempt + 1); }
    throw err;
  } finally { clearTimeout(t); }
}

export const onRequest: (ctx: { request: Request; env: Env; }) => Promise<Response> = async (ctx) => {
  try {
    const { request, env } = ctx; const url = new URL(request.url);
    if (request.method === "GET" && url.searchParams.has("health")) {
      return new Response(JSON.stringify({ ok: true, env: !!env.GEMINI_API_KEY }), { headers: JSON_HEADERS, status: 200 });
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: { ...JSON_HEADERS, "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "POST, GET, OPTIONS" }, status: 204 });
    }
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method Not Allowed" }), { headers: JSON_HEADERS, status: 405 });
    if (!env.GEMINI_API_KEY) return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { headers: JSON_HEADERS, status: 500 });

    let body: ReqBody | undefined;
    try { body = (await request.json()) as ReqBody; }
    catch { return new Response(JSON.stringify({ error: "Invalid JSON body" }), { headers: JSON_HEADERS, status: 400 }); }
    if (!body?.text || !body.text.trim()) return new Response(JSON.stringify({ error: "Missing 'text' in body" }), { headers: JSON_HEADERS, status: 400 });

    const target = normLang(body.target) || "ko";
    const chunks = splitIntoChunks(body.text, 3000); const results: string[] = [];
    for (const chunk of chunks) { const prompt = buildPrompt({ ...body, text: chunk, target }); const translated = await callGemini(env.GEMINI_API_KEY, prompt, 20000); results.push(translated); }
    const joined = results.join("\n\n").trim();
    return new Response(JSON.stringify({ text: joined, chunks: chunks.length }), { headers: JSON_HEADERS, status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), { headers: JSON_HEADERS, status: 500 });
  }
};