// services/subscribe.ts

/**
 * Subscribes an email to the newsletter via the API endpoint.
 * @param email The user's email address.
 * @returns A promise that resolves with a success message.
 * @throws An error with a user-friendly message if the subscription fails.
 */
export async function subscribeToNewsletter(email: string): Promise<string> {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw an error with the message from the API, or a default one
    throw new Error(data.error || "An unknown error occurred. Please try again.");
  }

  // Return the success message from the API (e.g., "Subscribed", "Already subscribed", "Subscribed (dev mode)")
  return data.message || "Subscription successful!";
}
