// Auto-retry wrapper for Anthropic API calls.
// Handles the two common transient failures (overload, rate limit) with
// exponential backoff. Cleans up the error message so the client UI
// doesn't show raw JSON.

export async function callAnthropicWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const message = err instanceof Error ? err.message : String(err);
      const status = (err as { status?: number })?.status;
      const isRetriable =
        status === 529 ||
        status === 503 ||
        status === 429 ||
        message.includes("overloaded_error") ||
        message.includes("rate_limit") ||
        message.includes("529") ||
        message.includes("503");
      if (!isRetriable || attempt === maxRetries) throw err;
      // Faster backoff: 250ms, 750ms. If Anthropic is overloaded enough that
      // 1 second of backoff doesn't help, it's better to fail fast so the
      // user can decide whether to retry rather than waiting on a spinner.
      const delayMs = 250 * Math.pow(3, attempt);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

export function friendlyAnthropicError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status;
  if (status === 529 || raw.includes("overloaded_error") || raw.startsWith("529")) {
    return "Anthropic is briefly overloaded. Try again in a few seconds.";
  }
  if (status === 429 || raw.includes("rate_limit")) {
    return "Rate limit reached. Wait a moment, then try again.";
  }
  if (status === 401 || raw.includes("authentication")) {
    return "API key issue. Check the server's ANTHROPIC_API_KEY.";
  }
  if (status === 503) {
    return "Anthropic is temporarily unavailable. Try again in a moment.";
  }
  // Strip "529 {...}" style prefixes by returning a generic message
  if (/^\d{3}\s/.test(raw)) {
    return "AI service returned an error. Try again.";
  }
  return raw;
}
