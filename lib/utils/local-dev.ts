/**
 * Mock API fixtures (React Query fallbacks, LOCAL_MOCK_USER_ID subscription shortcuts).
 * Default OFF on localhost so founders hit real Supabase/Stripe-backed APIs; set LOCAL_DEV_MOCK_MODE=true for offline fixtures.
 */
export function isLocalMockModeEnabled(): boolean {
  if (process.env.NODE_ENV !== 'development') return false;

  const explicitFlag = process.env.LOCAL_DEV_MOCK_MODE;
  if (typeof explicitFlag === 'string') {
    return explicitFlag === 'true';
  }

  return false;
}

/** True only when running `next dev` (NODE_ENV=development). Used for localhost-only founder tooling. */
export function isNextDevRuntime(): boolean {
  return process.env.NODE_ENV === 'development';
}
