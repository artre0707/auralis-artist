// This is a placeholder for a serverless function.
// In a real environment (like Vercel or Netlify), this file would be placed in the `api` directory.

// For the purpose of this demo, this file is included but will not be executed by the client-side app directly.
// The fetch call in ConnectSection.tsx points to "/api/subscribe", which would trigger this function.

export default async function handler(req: { method: string, body: { email: string } }) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Allow": "POST" },
    });
  }

  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return new Response(JSON.stringify({ error: "A valid email is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  // In a real-world scenario, you would use an environment variable for the API key.
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    console.error("Brevo API key or List ID is not configured on the server.");
     return new Response(JSON.stringify({ error: "Server configuration error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [Number(BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    if (response.status === 201 || response.status === 204) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const errorData = await response.json();
    const errorMessage = errorData.message || "An error occurred during subscription.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return new Response(JSON.stringify({ error: "An internal server error occurred." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}