import React, { useState } from 'react';
import { subscribeToNewsletter } from '../services/subscribe';

type Lang = 'EN' | 'KR';

const content = {
  EN: {
    emailPlaceholder: "your@email.com",
    subscribe: "Subscribe",
    subscribing: "Subscribing...",
    subscribeSuccess: "Subscribed. Thank you!",
    subscribeError: "Subscription failed. Please try again.",
    alreadySubscribed: "You're already subscribed.",
    disclaimer: "No spam. Unsubscribe anytime.",
  },
  KR: {
    emailPlaceholder: "your@email.com",
    subscribe: "구독하기",
    subscribing: "구독 중...",
    subscribeSuccess: "구독이 완료되었습니다!",
    subscribeError: "구독에 실패했습니다. 다시 시도해주세요.",
    alreadySubscribed: "이미 구독하셨습니다.",
    disclaimer: "스팸 없음. 언제든지 구독 취소 가능.",
  }
};

export default function SubscribeForm({ language }: { language: Lang }) {
  const c = content[language];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    
    setStatus("loading");
    setMsg("");

    try {
      const successMessage = await subscribeToNewsletter(email);
      
      if (successMessage.toLowerCase().includes("already")) {
        setMsg(c.alreadySubscribed);
      } else {
        setMsg(c.subscribeSuccess);
      }
      setStatus("ok");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMsg(err.message || c.subscribeError);
    }
  };

  return (
    <>
      <form onSubmit={handleNewsletterSubmit} className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex-grow flex items-center gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={c.emailPlaceholder}
            className="newsletter-input w-full rounded-full px-5 py-2.5 text-sm
                       border bg-neutral-100 text-neutral-900 placeholder:text-neutral-500
                       focus:outline-none focus:ring-2 focus:ring-[#CBAE7A]/60 focus:border-[#CBAE7A]
                       dark:bg-transparent dark:text-neutral-100 dark:placeholder:text-neutral-400
                       dark:border-white/20 dark:focus:ring-[#CBAE7A] dark:focus:border-[#CBAE7A]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full px-5 py-2.5 text-sm font-medium
                       bg-[#CBAE7A] text-[#0B0C0E] hover:bg-[#e0c995] transition-colors whitespace-nowrap disabled:opacity-70"
          >
            {status === "loading" ? c.subscribing : c.subscribe}
          </button>
        </div>
        {msg && (
          <div className="w-full text-center sm:text-left sm:w-auto">
            <span className={`text-xs ml-2 font-medium ${status === "ok" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
              {msg}
            </span>
          </div>
        )}
      </form>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-300">{c.disclaimer}</p>
    </>
  );
}
