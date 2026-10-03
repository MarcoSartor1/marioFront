export type LoginFailure = 'RateLimit' | 'CredentialsSignin' | 'AuthUnavailable';

export function getLoginFailure(error: unknown): LoginFailure | undefined {
  const pending: unknown[] = [error];
  const seen = new Set<object>();
  let callbackFailure = false;
  let credentialsFailure = false;
  // Auth.js puede envolver la causa en cause.err. La beta antigua de signIn
  // solo conserva el mensaje CallbackRouteError, sin la causa original.
  while (pending.length && seen.size < 10) {
    const value = pending.shift();
    if (!value || typeof value !== 'object' || seen.has(value)) continue;
    seen.add(value);
    const item = value as { message?: string; type?: string; cause?: unknown; err?: unknown };
    if (item.message === 'RateLimitExceeded') return 'RateLimit';
    if (item.message === 'CredentialsSignin' || item.type === 'CredentialsSignin') credentialsFailure = true;
    if (item.message === 'CallbackRouteError' || item.type === 'CallbackRouteError') callbackFailure = true;
    pending.push(item.cause, item.err);
  }
  if (credentialsFailure) return 'CredentialsSignin';
  if (callbackFailure) return 'AuthUnavailable';
}
