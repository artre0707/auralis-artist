import React, { useState } from "react";

type Lang = "EN" | "KR";
interface Props {
  language: Lang;
}

type UiCopy = {
  placeholder: string;
  buttonIdle: string;
  buttonLoading: string;
  success: string;
  invalidEmail: string;
  missingEnv: string;
  providerError: string;
  unknownError: string;
};

const COPY: Record<Lang, UiCopy> = {
  EN: {
    placeholder: "Enter your email",
    buttonIdle: "Subscribe",
    buttonLoading: "Subscribing...",
    success: "Subscribed. Thank you!",
    invalidEmail: "Please enter a valid email address.",
    missingEnv: "Server configuration missing. Please try again later.",
    providerError: "Service temporarily unavailable. Please try again later.",
    unknownError: "Subscription failed. Please try again.",
  },
  KR: {
    placeholder: "이메일 주소를 입력하세요",
    buttonIdle: "구독하기",
    buttonLoading: "구독 처리 중...",
    success: "구독이 완료되었습니다. 감사합니다!",
    invalidEmail: "이메일 형식이 올바르지 않습니다.",
    missingEnv: "서버 환경 변수가 설정되지 않았습니다.",
    providerError: "서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해 주세요.",
    unknownError: "구독에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  },
};

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

const SubscribeForm: React.FC<Props> = ({ language }) => {
  const t = COPY[language || "EN"];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setState("err");
      setMsg(t.invalidEmail);
      return;
    }

    setState("loading");
    setMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.ok !== true) {
        const code = data?.error;
        if (code === "INVALID_EMAIL") setMsg(t.invalidEmail);
        else if (code === "MISSING_ENV") setMsg(t.missingEnv);
        else if (code === "PROVIDER_ERROR") setMsg(t.providerError);
        else setMsg(t.unknownError);
        setState("err");
        return;
      }

      setState("ok");
      setMsg(t.success);
      setEmail("");
    } catch {
      setState("err");
      setMsg(t.unknownError);
    }
  };

  const showMessage = (state === "ok" || state === "err") && msg;

  return (
    <form
      onSubmit={onSubmit}
      className="relative mt-4 flex flex-col sm:flex-row items-center gap-2"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.placeholder}
        aria-label={t.placeholder}
        className="w-full flex-1 rounded-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-sm placeholder:text-neutral-500 dark:bg-transparent"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full sm:w-auto rounded-full px-5 py-2.5 bg-[var(--accent)] text-white font-medium text-sm hover:brightness-110 transition disabled:opacity-50"
      >
        {state === "loading" ? t.buttonLoading : t.buttonIdle}
      </button>

      {showMessage && (
        <p
          className={`
            absolute -bottom-6 left-2 sm:left-4 text-xs tracking-wide transition-all duration-300 opacity-90
            ${state === "ok" ? "text-[var(--accent)]" : "text-[#ef4444]"}
          `}
        >
          {msg}
        </p>
      )}
    </form>
  );
};

export default SubscribeForm;
