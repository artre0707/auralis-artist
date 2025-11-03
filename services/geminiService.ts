import { GoogleGenAI, Type } from "@google/genai";

export type MuseOutput = {
  title: string;
  mood: string;
  instrumentation: string;
  concept: string;
  musicalElements: {
    motif: string;
    harmony: string;
    tempo: string;
    dynamics: string;
  };
};

/* ───────────────── API 키 공통 획득 로직 ─────────────────
   - 브라우저: import.meta.env.VITE_GOOGLE_API_KEY (Cloudflare Pages Variables)
   - 서버/빌드: process.env.GOOGLE_API_KEY / VITE_GOOGLE_API_KEY / API_KEY
   - 필요시 window.__GOOGLE_API_KEY__ 같은 전역도 허용(옵션)
*/
function getApiKey(): string | undefined {
  // @ts-ignore - Vite 환경에서만 존재
  const viteKey = typeof window !== "undefined" ? (import.meta as any)?.env?.VITE_GOOGLE_API_KEY : undefined;
  const winKey = typeof window !== "undefined" ? (window as any).__GOOGLE_API_KEY__ : undefined;

  return (
    viteKey ||
    winKey ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY ||
    process.env.API_KEY
  );
}

const API_KEY = getApiKey();
if (!API_KEY) {
  throw new Error(
    "An API Key must be set when running in a browser (missing VITE_GOOGLE_API_KEY / GOOGLE_API_KEY)."
  );
}

const schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description:
        "A short, evocative, and artistic title for the musical piece, around 2-5 words.",
    },
    mood: {
      type: Type.STRING,
      description:
        "A paragraph (2-3 sentences) describing the primary mood, feeling, and emotional color of the piece.",
    },
    instrumentation: {
      type: Type.STRING,
      description:
        "A paragraph (2-3 sentences) describing the suggested instrumentation (e.g., solo piano, string quartet, sparse electronics).",
    },
    concept: {
      type: Type.STRING,
      description:
        "A paragraph (2-4 sentences) expanding on the core concept or story behind the music, based on the user's prompt.",
    },
    musicalElements: {
      type: Type.OBJECT,
      properties: {
        motif: {
          type: Type.STRING,
          description:
            "A brief description of a potential central musical idea or melodic fragment.",
        },
        harmony: {
          type: Type.STRING,
          description:
            "Describe the harmonic language (e.g., consonant, gentle dissonance, modal, minimalist).",
        },
        tempo: {
          type: Type.STRING,
          description:
            "Suggest a tempo and feel (e.g., 'Lento, with a sense of gentle breathing', 'Moderato, flowing like water').",
        },
        dynamics: {
          type: Type.STRING,
          description:
            "Describe the dynamic range (e.g., 'Primarily soft (p to mp), with a single swell to forte').",
        },
      },
      required: ["motif", "harmony", "tempo", "dynamics"],
    },
  },
  required: ["title", "mood", "instrumentation", "concept", "musicalElements"],
};

function extractJson(text: string): string {
  const fence = text.match(/```json\s*([\s\S]*?)```/i);
  if (fence) return fence[1].trim();

  const brace = text.match(/\{[\s\S]*\}$/);
  if (brace) return brace[0].trim();

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last >= 0 && last > first) {
    return text.slice(first, last + 1);
  }
  return "{}";
}

function normalizeMuse(obj: any): MuseOutput {
  return {
    title: obj?.title || "Sketch in Quiet Tones",
    mood: obj?.mood || "",
    instrumentation: obj?.instrumentation || "",
    concept: obj?.concept || "",
    musicalElements: {
      motif: obj?.musicalElements?.motif || "",
      harmony: obj?.musicalElements?.harmony || "Cmaj7 – Gadd9 – Am7 – Fmaj7",
      tempo: obj?.musicalElements?.tempo || "68–74 bpm, rubato",
      dynamics: obj?.musicalElements?.dynamics || "pp–mp, occasional swells",
    },
  };
}

function fallbackFromText(text: string, lang: "en" | "ko"): MuseOutput {
  return {
    title: lang === "ko" ? "조용한 선율 스케치" : "Quiet Motif Sketch",
    mood: lang === "ko" ? "고요하고 따스한 정서" : "Calm and warm",
    instrumentation: lang === "ko" ? "피아노 솔로" : "Solo piano",
    concept:
      text.slice(0, 400) ||
      (lang === "ko"
        ? "AI 응답을 처리하는 중 오류가 발생했습니다."
        : "An error occurred while processing the AI response."),
    musicalElements: {
      motif: lang === "ko" ? "상행 3음 동기 후 하행 2음 한숨" : "3-note rise, 2-note sigh",
      harmony: "Cmaj7 – Gadd9 – Am7 – Fmaj7",
      tempo: "68–74 bpm, rubato",
      dynamics: lang === "ko" ? "pp–mp, 점층적 숨결" : "pp–mp with gentle swells",
    },
  };
}

/* ───────────────── 공통 클라이언트 ───────────────── */
function createClient() {
  return new GoogleGenAI({ apiKey: API_KEY! });
}

/* ───────────────── 메인 생성 함수 ───────────────── */
export async function generateMuseJSON(
  prompt: string,
  lang: "en" | "ko" = "en"
): Promise<MuseOutput> {
  const ai = createClient();

  const systemInstruction =
    lang === "ko"
      ? `당신은 피아니스트이자 작곡가인 Auralis를 위한 AI 작곡가 뮤즈입니다. Auralis는 영화적이고 발레에서 영감을 받은 감성적인 작품으로 유명합니다. 사용자의 추상적인 프롬프트(느낌, 장면, 색상 등)를 받아 상세하고 구조화된 음악적 컨셉을 생성합니다. 어조는 예술적이고, 연상적이며, 영감을 주어야 하며, 묘사적인 언어를 사용하세요. 오직 JSON 객체로만 응답하세요.`
      : `You are an AI composer's muse for Auralis, a pianist known for cinematic, ballet-inspired, emotionally resonant works. Take an abstract prompt (feeling, scene, color) and produce a detailed, structured musical concept. Tone: artistic, evocative, inspiring. Respond ONLY with a JSON object.`;

  const userPrompt =
    lang === "ko"
      ? `이 프롬프트를 기반으로 음악적 컨셉을 생성하세요: "${prompt}"`
      : `Generate a musical concept based on this prompt: "${prompt}"`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const rawText = response.text.trim();
  const jsonText = extractJson(rawText);

  try {
    if (!jsonText || jsonText === "{}") throw new Error("Extracted JSON is empty.");
    const parsed = JSON.parse(jsonText);
    return normalizeMuse(parsed);
  } catch (e) {
    console.warn("JSON parsing failed, using fallback. Error:", e);
    return fallbackFromText(rawText, lang);
  }
}

/**
 * translateText — Gemini 기반 자연 번역 함수
 * @param text 원문 텍스트
 * @param target "ko" | "en"
 * @returns 감성적으로 번역된 문장
 */
export async function translateText(text: string, target: "ko" | "en"): Promise<string> {
  if (!text || !text.trim()) return text;

  const ai = createClient();

  if (target === "ko") {
    const prompt = `
Translate the following text into soft, poetic Korean
in the serene and reflective tone of Auralis (오랄리스),
a Korean composer and pianist known for calm and luminous music.
Avoid literal translation and keep sentences flowing naturally.
Return only the translated Korean text.

---
${text}
---
`;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const translatedText = response.text.trim();
      return translatedText.length > 0 ? translatedText : text;
    } catch (error) {
      console.error("Gemini translation to ko failed:", error);
      return text;
    }
  }

  if (target === "en") {
    const systemInstruction =
      "You are a translation expert for elegant, natural English suitable for album liner notes or artistic descriptions. Respond ONLY with the translated English text.";
    const userPrompt = `Translate the following text:\n\n---\n${text}\n---`;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: { systemInstruction },
      });
      const translatedText = response.text.trim();
      return translatedText.length > 0 ? translatedText : text;
    } catch (error) {
      console.error("Gemini translation to en failed:", error);
      return text;
    }
  }

  return text;
}
