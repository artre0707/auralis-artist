// functions/api/subscribe.ts

// Define the environment variables expected by the function
export interface Env {
  MAILCHIMP_API_KEY: string;
  MAILCHIMP_SERVER_PREFIX: string;
  MAILCHIMP_LIST_ID: string;
}

// Common headers for CORS and content type
const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*", // Or a specific origin for better security
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Main function handler for Cloudflare Pages
// FIX: Replaced unknown PagesFunction type with an explicit inline type for the context.
export const onRequest: (context: { request: Request; env: Env; }) => Promise<Response> = async (context) => {
  const { request, env } = context;

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: JSON_HEADERS, status: 204 });
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      headers: JSON_HEADERS,
      status: 405,
    });
  }

  // --- Dev Mode Check ---
  // If environment variables are not set, run in dev mode.
  if (!env.MAILCHIMP_API_KEY || !env.MAILCHIMP_SERVER_PREFIX || !env.MAILCHIMP_LIST_ID) {
    console.warn("Mailchimp env vars not set. Running in dev mode.");
    // Simulate a short delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return new Response(JSON.stringify({ success: true, message: "Subscribed (dev mode)" }), {
      headers: JSON_HEADERS,
      status: 200,
    });
  }

  // --- Production Logic ---
  let body: { email?: string };
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      headers: JSON_HEADERS,
      status: 400,
    });
  }

  const email = body?.email;
  if (!email || typeof email !== "string" || !email.includes('@')) {
    return new Response(JSON.stringify({ error: "A valid email is required." }), {
      headers: JSON_HEADERS,
      status: 400,
    });
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_LIST_ID } = env;
  const mailchimpUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

  const payload = {
    email_address: email,
    status: "subscribed",
  };

  try {
    const response = await fetch(mailchimpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Mailchimp uses Basic Auth with any string as username and API key as password
        "Authorization": `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
      },
      body: JSON.stringify(payload),
    });

    // Mailchimp returns 200 OK on success
    if (response.ok) {
      return new Response(JSON.stringify({ success: true, message: "Subscribed successfully" }), {
        headers: JSON_HEADERS,
        status: 200,
      });
    }

    const errorData = await response.json();
    
    // Check if the member already exists
    if (errorData.title === "Member Exists") {
      return new Response(JSON.stringify({ success: true, message: "Already subscribed" }), {
        headers: JSON_HEADERS,
        status: 200, // Treat as success for the user
      });
    }
    
    // Handle other Mailchimp errors
    console.error("Mailchimp API Error:", errorData);
    return new Response(JSON.stringify({ error: errorData.detail || "Subscription failed." }), {
      headers: JSON_HEADERS,
      status: response.status,
    });

  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return new Response(JSON.stringify({ error: "An internal server error occurred." }), {
      headers: JSON_HEADERS,
      status: 500,
    });
  }
};
