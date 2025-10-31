import { generateMuseJSON } from '../../services/geminiService';

export default async function handler(req: { method: string, body: { prompt: string, lang: 'en' | 'ko' } }) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Allow": "POST" },
    });
  }

  const { prompt, lang } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 8) {
    return new Response(JSON.stringify({ error: "A valid prompt is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  if (prompt.length > 600) {
    return new Response(JSON.stringify({ error: "Prompt is too long." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await generateMuseJSON(prompt, lang);
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

  } catch (error: any) {
    console.error("AI Muse generation error:", error);
    return new Response(JSON.stringify({ error: "An internal server error occurred.", message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
  }
}