// /functions/api/translate.ts
// Cloudflare Pages Functions (TypeScript)

export interface Env {
  GEMINI_API_KEY: string;
}

const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};

function normLang(v?: string) {
  if (!v) return undefined;
  const x = v.toLowerCase().trim();
  if (["ko", "kr", "korean"].includes(x)) return "ko";
  if (["en", "eng", "english", "en-us", "en-gb"].includes(x)) return "en";
  return x;
}

type ReqBody = {
  text: string;
  target?: string;
  source?: string;
  formal?: "formal" | "casual";
};

function langDisplayName(code: string) {
  switch (code) {
    case "ko": return "Korean";
    case "en": return "English";
    default:   return code;
  }
}

function buildPrompt({ text, target = "ko", source, formal }: ReqBody) {
  const tgt = normLang(target) || "ko";
  const src = normLang(source);

  const tgtName = langDisplayName(tgt);

  const styleHint =
    tgt === "ko"
      ? (formal === "casual"
          ? "Write naturally in Korean, casual but respectful tone suitable for web UI."
          : "Write naturally in Korean with a clear, polished, respectful tone (존댓말).")
      : "Write naturally with a clear, polished tone appropriate for web content.";

  const detectLine = src
    ? `Source language is ${langDisplayName(src)}.`
    : "Detect the source language automatically.";

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

export const onRequest: PagesFunction<Env> = async (ctx) => {
  try {
    const { request, env } = ctx;
    const url = new URL(request.url);

    if (request.method === "GET" && url.searchParams.has("health")) {
      return new Response(JSON.stringify({ ok: true, env: !!env.GEMINI_API_KEY }), {
        headers: JSON_HEADERS, status: 200,
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          ...JSON_HEADERS,
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        },
        status: 204,
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        headers: JSON_HEADERS, status: 405,
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        headers: JSON_HEADERS, status: 500,
      });
    }

    let body: ReqBody | undefined;
    try {
      body = (await request.json()) as ReqBody;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: JSON_HEADERS, status: 400,
      });
    }

    if (!body?.text || !body.text.trim()) {
      return new Response(JSON.stringify({ error: "Missing 'text' in body" }), {
        headers: JSON_HEADERS, status: 400,
      });
    }

    const target = normLang(body.target) || "ko";
    const payload = {
      contents: [{ role: "user", parts: [{ text: buildPrompt({ ...body, target }) }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
      // safetySettings는 생략(일부 텍스트가 과하게 차단될 수 있음)
    };

    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      encodeURIComponent(env.GEMINI_API_KEY);

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await resp.text();

    if (!resp.ok) {
      // 모델 오류를 그대로 노출하여 프론트에서 보이게
      return new Response(JSON.stringify({ error: "Gemini API error", status: resp.status, detail: raw }), {
        headers: JSON_HEADERS, status: 502,
      });
    }

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON from Gemini", raw }), {
        headers: JSON_HEADERS, status: 502,
      });
    }

    // 여러 응답 포맷 대응: parts[].text, output_text 등
    const partsText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text || "")
        .join("")
        .trim() || "";

    const outputText = (data?.candidates?.[0]?.output_text || "").trim();

    const translated = partsText || outputText;

    // 블록 여부도 명확히 반환
    const block = data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason;

    if (!translated) {
      return new Response(
        JSON.stringify({
          error: "Empty translation",
          info: { blockReason: block ?? null, debug: data?.promptFeedback ?? null },
        }),
        { headers: JSON_HEADERS, status: 502 }
      );
    }

    return new Response(JSON.stringify({ text: translated }), {
      headers: JSON_HEADERS, status: 200,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      headers: JSON_HEADERS, status: 500,
    });
  }
};
