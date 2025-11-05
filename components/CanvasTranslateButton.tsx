import React, { useState } from "react";
import { useTranslator } from "../hooks/useTranslator";

type Props = {
  getEnglishText: () => string;
  onDone?: (ko: string) => void;
};

export default function CanvasTranslateButton({ getEnglishText, onDone }: Props) {
  const { translate, loading } = useTranslator();
  const [ko, setKo] = useState("");

  return (
    <div>
      <button
        type="button" // 폼 안에서도 submit 방지
        onClick={async () => {
          const eng = getEnglishText() || "";
          const out = await translate(eng, "ko");
          if (out) { setKo(out); onDone?.(out); }
        }}
        disabled={loading}
        className="px-4 py-2 rounded bg-amber-600 text-white disabled:opacity-50"
      >
        {loading ? "번역 중..." : "번역하기 (EN→KR)"}
      </button>

      {ko && (
        <div className="mt-3 p-3 rounded border whitespace-pre-wrap text-sm">
          {ko}
        </div>
      )}
    </div>
  );
}
