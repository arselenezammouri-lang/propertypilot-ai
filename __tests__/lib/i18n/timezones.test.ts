import { isValidDashboardTimezone, DEFAULT_DASHBOARD_TIMEZONE } from '@/lib/i18n/timezones';

describe('timezones', () => {
  it('accepts known IANA zones', () => {
    expect(isValidDashboardTimezone('Europe/Rome')).toBe(true);
    expect(isValidDashboardTimezone('America/New_York')).toBe(true);
  });

  it('rejects unknown zones', () => {
    expect(isValidDashboardTimezone('Mars/Colony1')).toBe(false);
  });

  it('default is UTC', () => {
    expect(DEFAULT_DASHBOARD_TIMEZONE).toBe('UTC');
  });
});
