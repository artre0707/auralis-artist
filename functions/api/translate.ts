// /functions/api/translate.ts
// Cloudflare Pages Functions (TypeScript)

export interface Env {
  GEMINI_API_KEY: string;
}

// 공통 응답 헤더 (필요 시 CORS 허용)
const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
};

// 언어 코드 정규화: KR→ko, EN/ENG→en 등
function normLang(v?: string) {
  if (!v) return undefined;
  const x = v.toLowerCase().trim();
  if (["ko", "kr", "korean"].includes(x)) return "ko";
  if (["en", "eng", "english", "en-us", "en-gb"].includes(x)) return "en";
  return x; // 기타 값은 그대로
}

type ReqBody = {
  text: string;
  target?: string;      // 기본 "ko"
  source?: string;      // 선택
  formal?: "formal" | "casual";
};

function langDisplayName(code: string) {
  switch (code) {
    case "ko": return "Korean";
    case "en": return "English";
    default:   return code; // 모델이 이해할 수 있도록 그 밖의 값은 그대로
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

// ✅ 단일 핸들러: GET(health check) + POST(번역)
export const onRequest: PagesFunction<Env> = async (ctx) => {
  try {
    const { request, env } = ctx;
    const url = new URL(request.url);

    // 헬스체크: /api/translate?health
    if (request.method === "GET" && url.searchParams.has("health")) {
      return new Response(JSON.stringify({ ok: true, env: !!env.GEMINI_API_KEY }), {
        headers: JSON_HEADERS,
        status: 200,
      });
    }

    if (request.method === "OPTIONS") {
      // CORS 프리플라이트 대비(필요 시)
      return new Response(null, {
        headers: {
          ...JSON_HEADERS,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        },
        status: 204,
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        headers: JSON_HEADERS,
        status: 405,
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        headers: JSON_HEADERS,
        status: 500,
      });
    }

    // JSON 파싱
    let body: ReqBody | undefined;
    try {
      body = (await request.json()) as ReqBody;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: JSON_HEADERS,
        status: 400,
      });
    }

    if (!body?.text || !body.text.trim()) {
      return new Response(JSON.stringify({ error: "Missing 'text' in body" }), {
        headers: JSON_HEADERS,
        status: 400,
      });
    }

    const target = normLang(body.target) || "ko";

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt({ ...body, target }) }],
        },
      ],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      safetySettings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
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
      return new Response(
        JSON.stringify({ error: "Gemini API error", status: resp.status, detail: raw }),
        { headers: JSON_HEADERS, status: 500 }
      );
    }

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON from Gemini", raw }), {
        headers: JSON_HEADERS,
        status: 500,
      });
    }

    const translated: string =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("")?.trim() ?? "";

    // 폴백: 응답이 비었으면 원문 반환(최악의 경우 UI가 빈 문자열로 깨지지 않게)
    const out = translated || body.text;

    return new Response(JSON.stringify({ text: out }), {
      headers: JSON_HEADERS,
      status: 200,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      headers: JSON_HEADERS,
      status: 500,
    });
  }
};
