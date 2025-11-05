// functions/api/subscribe.ts

export interface Env {
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS,GET",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    ...init,
  });
}

// ✅ CORS preflight
export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { headers: CORS_HEADERS });

// ✅ GET /api/subscribe?health → 헬스체크
export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("health") !== null) {
    return json({
      ok: !!(env.BREVO_API_KEY && env.BREVO_LIST_ID),
      provider: "brevo",
      hasApiKey: !!env.BREVO_API_KEY,
      hasListId: !!env.BREVO_LIST_ID,
    });
  }
  return json({ ok: true, message: "Brevo subscribe endpoint ready." });
};

// ✅ POST /api/subscribe
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const { email } = await request.json().catch(() => ({} as any));

    if (!email || typeof email !== "string") {
      return json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 });
    }

    if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) {
      return json({ ok: false, error: "MISSING_ENV" }, { status: 500 });
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [Number(env.BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return json({ ok: false, error: "PROVIDER_ERROR", detail }, { status: 502 });
    }

    return json({ ok: true, message: "SUBSCRIBED" });
  } catch (e: any) {
    return json({ ok: false, error: "UNKNOWN", detail: String(e?.message || e) }, { status: 500 });
  }
};
