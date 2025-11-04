// /functions/api/translate.ts
// Cloudflare Pages Functions (TypeScript)

export interface Env {
  GEMINI_API_KEY: string;
}

// 공통 응답 헤더 (필요 시 CORS 허용)
const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
};

type ReqBody = {
  text: string;
  target?: string;      // 기본 "ko"
  source?: string;      // 선택
  formal?: "formal" | "casual";
};

function buildPrompt({ text, target = "ko", source, formal }: ReqBody) {
  const tgtName =
    target.toLowerCase() === "ko" ? "Korean" :
    target.toLowerCase() === "en" ? "English" : target;

  const styleHint =
    target.toLowerCase() === "ko"
      ? formal === "casual"
        ? "Write naturally in Korean, casual but respectful tone suitable for web UI."
        : "Write naturally in Korean with clear, polished, respectful tone (존댓말)."
      : "Write naturally with a clear, polished tone appropriate for web content.";

  const detectLine = source
    ? `Source language is ${source}.`
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

    // 헬스체크: 브라우저에서 /api/translate?health 로 바로 확인 가능
    if (request.method === "GET" && url.searchParams.has("health")) {
      return new Response(JSON.stringify({ ok: true, env: !!env.GEMINI_API_KEY }), {
        headers: JSON_HEADERS,
        status: 200,
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

    // JSON 파싱 (본문이 비었거나 content-type 누락 시 방어)
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

    const target = (body.target || "ko").toLowerCase();

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt({ ...body, target }) }],
        },
      ],
      generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
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
      // 상세 오류 반환 (디버깅 편의)
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

    const translated =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("")?.trim() ?? "";

    return new Response(JSON.stringify({ text: translated }), {
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
