import "server-only";

/**
 * A sliding-window limiter held in module memory.
 *
 * Be clear about what this is and is not. It throttles one attacker hammering a
 * warm instance, and it costs one file and zero dependencies. It does **not**
 * survive a serverless deployment — Next's own guidance is explicit that route
 * handlers deployed as lambdas "cannot share data between requests", so every
 * cold instance starts with an empty map and a burst fans out across them. On a
 * long-lived `next start` process it works properly.
 *
 * `x-forwarded-for` is also trivially spoofable unless there is a proxy you
 * control in front. If real abuse ever shows up the answer is Turnstile or a
 * WAF, not a bigger map.
 */

const hits = new Map<string, number[]>();

/** Stops the map growing without bound on a long-lived server. */
function sweep(now: number, windowMs: number) {
  for (const [key, times] of hits) {
    const live = times.filter((t) => now - t < windowMs);
    if (live.length) hits.set(key, live);
    else hits.delete(key);
  }
}

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 10 * 60 * 1000 } = {},
): { ok: boolean } {
  const now = Date.now();

  // Cheap and opportunistic — roughly one sweep in twenty calls.
  if (Math.random() < 0.05) sweep(now, windowMs);

  const times = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (times.length >= limit) {
    hits.set(key, times);
    return { ok: false };
  }

  times.push(now);
  hits.set(key, times);
  return { ok: true };
}

/** First hop in `x-forwarded-for`, or a constant when there is no proxy. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
