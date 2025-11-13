// functions/api/muse.ts
import { generateMuseJSON } from '../../services/geminiService';

export interface Env { GEMINI_API_KEY: string; }

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    ...init,
  });
}

const onRequest: (ctx: { request: Request; env: Env; }) => Promise<Response> = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  if (!env.GEMINI_API_KEY) {
      return json({ error: "Server configuration error: missing API key." }, { status: 500 });
  }

  try {
    const { prompt, lang } = await request.json() as { prompt: string, lang: 'en' | 'ko' };
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 8) {
      return json({ error: "A valid prompt is required." }, { status: 400 });
    }
    
    if (prompt.length > 600) {
      return json({ error: "Prompt is too long." }, { status: 400 });
    }

    const data = await generateMuseJSON(prompt, lang, env.GEMINI_API_KEY);
    return json(data, { status: 200 });

  } catch (error: any) {
    console.error("AI Muse generation error:", error);
    return json({ error: "An internal server error occurred.", message: error.message }, { status: 500 });
  }
};

export { onRequest };
