import { useState } from "react";

export function useTranslate() {
  const [loading, setLoading] = useState(false);

  async function translateText(text: string, source: "EN" | "KR", target: "EN" | "KR") {
    if (!text?.trim()) return "";
    try {
      setLoading(true);
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source, target: target.toLowerCase() }),
      });
      if (res.ok) {
        const data = await res.json();
        return data?.translated ?? text;
      }
      return text;
    } catch {
      return text;
    } finally {
      setLoading(false);
    }
  }

  return { translateText, loading };
}
