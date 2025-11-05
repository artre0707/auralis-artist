import { useState } from "react";

export function useTranslator() {
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  async function translate(text: string, target: string = "ko") {
    setErr(null);
    if (!text?.trim()) {
      setErr("번역할 텍스트가 비어 있습니다.");
      return null;
    }
    try {
      setLoading(true);
      const API = `${location.origin}/api/translate`;
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: "en", target, formal: "formal" }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        alert(`번역 API 오류: ${res.status}\n${t.slice(0, 400)}`);
        setErr(`API 오류 (${res.status})`);
        return null;
      }

      const data = await res.json();
      if (!data?.text) {
        alert("번역 응답이 비어 있습니다.");
        setErr("빈 응답");
        return null;
      }

      return String(data.text);
    } catch (e: any) {
      alert(`요청이 나가지 않았습니다.\n${String(e?.message || e)}`);
      setErr("요청 실패");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { translate, loading, error };
}
