interface AccessPreview {
  onboardingRequired?: boolean;
}

/** Navigation hint only. Protected routes and the API still validate the session. */
export function accountDestination(
  identity: unknown,
  token: string,
  access: AccessPreview | null,
  nowSeconds = Math.floor(Date.now() / 1000),
): string[] | null {
  if (!identity || typeof identity !== 'object') return null;
  const user = identity as Record<string, unknown>;
  if (typeof user['_id'] !== 'string' || !user['_id'] || typeof user['role'] !== 'string') return null;
  const role = user['role'].toUpperCase();
  if (!['ADMIN', 'STAFF_ADMIN', 'STAFF', 'OWNER', 'FAMILY'].includes(role)) return null;
  try {
    const parts = token.replace(/^Bearer\s+/i, '').replace(/['"]+/g, '').split('.');
    if (parts.length !== 3 || !parts[2]) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
    const payload: Record<string, unknown> = JSON.parse(decoded);
    if (typeof payload['exp'] !== 'number' || payload['exp'] <= nowSeconds || payload['sub'] !== user['_id'] ||
      typeof payload['role'] !== 'string' || payload['role'].toUpperCase() !== role) return null;
    if (role === 'ADMIN' && access?.onboardingRequired) return ['/onboarding'];
    if (role === 'OWNER' && !user['organizationId']) return ['/smart-home'];
    return ['/start', user['_id']];
  } catch {
    return null;
  }
}
