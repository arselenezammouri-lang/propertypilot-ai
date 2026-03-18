export function isLocalMockModeEnabled(): boolean {
  if (process.env.NODE_ENV !== 'development') return false;

  const explicitFlag = process.env.LOCAL_DEV_MOCK_MODE;
  if (typeof explicitFlag === 'string') {
    return explicitFlag === 'true';
  }

  return true;
}
