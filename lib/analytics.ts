/**
 * Google Tag Manager, behind Google Consent Mode v2.
 *
 * GTM always loads, but every storage type starts "denied" — so until a visitor
 * clicks Accept on the cookie card, GA4 sends cookieless pings only and sets no
 * cookies. Ad storage stays denied for good: the card promises no ad networks.
 * The bootstrap that sets the default runs inline in the root layout, before
 * gtm.js, and re-applies a stored "accepted" on every page load.
 */

export const GTM_ID = "GTM-P55PPQ58";
export const CONSENT_STORAGE_KEY = "darly.cookie-choice";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- read via `arguments`
function gtag(..._args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // gtag() must push the `arguments` object, not an array — GTM tells
  // consent commands apart from plain events by that shape.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

export function setAnalyticsConsent(granted: boolean) {
  gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
}

/** Push a custom event for GTM triggers (e.g. a GA4 event tag on `book_call`). */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/** Inline bootstrap: consent defaults, then the standard GTM loader. */
export const gtmBootstrap = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('${CONSENT_STORAGE_KEY}')==='accepted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}
gtag('js',new Date());
dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
(function(d){var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';d.head.appendChild(s);})(document);
`;
