// /functions/api/translate.ts
// Cloudflare Pages Functions (TypeScript)
// ENV: Cloudflare Pages → Project → Settings → Environment Variables → GEMINI_API_KEY

export interface Env {
  GEMINI_API_KEY: string;
}

// FIX: Define PagesFunction for Cloudflare environment.
type PagesFunction<TEnv = unknown> = (context: {
  request: Request;
  env: TEnv;
  params: Record<string, string>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string) => Promise<Response>;
  data: Record<string, unknown>;
}) => Response | Promise<Response>;


/**
 * 옵션
 * - text: 번역할 원문 (필수)
 * - target: 목표 언어 ISO 코드 (기본: "ko")  예) "en", "ja", "fr"
 * - source: 원문 언어 코드 (선택, 미지정 시 자동 감지 지시)
 * - formal: "formal" | "casual" (선택) → 한국어의 경우 존댓말/반말 뉘앙스 힌트
 */
type ReqBody = {
  text: string;
  target?: string;
  source?: string;
  formal?: "formal" | "casual";
};

function buildPrompt({ text, target = "ko", source, formal }: ReqBody) {
  const tgtName =
    target.toLowerCase() === "ko" ? "Korean" :
    target.toLowerCase() === "en" ? "English" :
    target;

  const styleHint =
    target.toLowerCase() === "ko"
      ? formal === "casual"
        ? "Write naturally in Korean, casual but respectful tone suitable for web UI."
        : "Write naturally in Korean with clear, polished, respectful tone (존댓말)."
      : "Write naturally with a clear, polished tone appropriate for web content.";

  const detectLine = source
    ? `Source language is ${source}.`
    : "Detect the source language automatically.";

  // 번역 지시: 줄바꿈/공백/문장부호 보존, 마크업/코드 금지, 출력은 번역문만
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.GEMINI_API_KEY) {
      return new Response("Missing GEMINI_API_KEY", { status: 500 });
    }

    const body = (await request.json()) as ReqBody;

    if (!body || typeof body.text !== "string" || !body.text.trim()) {
      return new Response("Missing 'text' in body", { status: 400 });
    }

    const target = (body.target || "ko").toLowerCase();
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt({ ...body, target }) }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    };

    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        encodeURIComponent(env.GEMINI_API_KEY),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(errText || "Gemini error", { status: 500 });
    }

    // FIX: The .json() method on a Response does not take a generic type argument.
    const data: any = await resp.json();
    const translated =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("")?.trim() ?? "";

    return new Response(JSON.stringify({ text: translated }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(err?.message || "Server error", { status: 500 });
  }
};