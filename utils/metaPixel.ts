// utils/metaPixel.ts

// Extend the Window interface to include the fbq function
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Tracks a custom event with Meta Pixel.
 *
 * @param eventName The name of the custom event.
 * @param properties Optional properties to send with the event.
 */
export const trackMetaEvent = (
  eventName: string,
  properties: Record<string, any> = {}
) => {
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, properties);
    // For debugging purposes, you can see events in the browser console.
    console.log(`[Meta Pixel] Tracked: ${eventName}`, properties);
  } else {
    console.warn(
      `[Meta Pixel] fbq not found. Event "${eventName}" was not tracked.`
    );
  }
};
