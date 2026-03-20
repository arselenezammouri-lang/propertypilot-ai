import { isLocalDevHostname } from '@/lib/utils/local-dev-host';

describe('isLocalDevHostname', () => {
  it('accepts localhost with port', () => {
    expect(isLocalDevHostname('localhost:3000')).toBe(true);
  });

  it('accepts 127.0.0.1 and ::1', () => {
    expect(isLocalDevHostname('127.0.0.1')).toBe(true);
    expect(isLocalDevHostname('[::1]:3000')).toBe(true);
  });

  it('rejects production hosts', () => {
    expect(isLocalDevHostname('propertypilot-ai.vercel.app')).toBe(false);
    expect(isLocalDevHostname('')).toBe(false);
  });
});
