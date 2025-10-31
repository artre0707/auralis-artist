// pages/api/translate.ts
import { translateText } from '../../services/geminiService';

export default async function handler(req: { method: string, body: { text: string, target: 'en' | 'ko', source?: 'EN' | 'KR' } }) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Allow": "POST" },
    });
  }
  
  const { text, target } = req.body;
  const normalizedTarget = target?.toLowerCase() as 'en' | 'ko';

  if (!text || !target || !['en', 'ko'].includes(normalizedTarget)) {
    return new Response(JSON.stringify({ error: "Missing 'text' or invalid 'target' in body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const translated = await translateText(text, normalizedTarget);
    return new Response(JSON.stringify({ translated: translated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return new Response(JSON.stringify({ error: "An internal server error occurred." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
  }
}
