import path from 'path';
import { discoverDashboardPageRoutes } from '@/lib/launch/discover-dashboard-routes';
import { parseDashboardQaChecklistRoutes } from '@/lib/launch/parse-dashboard-qa-checklist';

describe('dashboard QA checklist parity', () => {
  const appRoot = process.cwd();
  const checklistPath = path.join(appRoot, 'docs', 'DASHBOARD_FEATURE_QA_CHECKLIST.md');

  it('checklist documents every discovered dashboard route', () => {
    const fromDisk = discoverDashboardPageRoutes(appRoot);
    const fromDoc = parseDashboardQaChecklistRoutes(checklistPath);

    const missing = fromDisk.filter((r) => !fromDoc.includes(r));
    const extra = fromDoc.filter((r) => !fromDisk.includes(r));

    expect({
      missing,
      extra,
      message:
        missing.length || extra.length
          ? 'Update docs/DASHBOARD_FEATURE_QA_CHECKLIST.md: add missing rows or remove stale routes.'
          : 'ok',
    }).toEqual({
      missing: [],
      extra: [],
      message: 'ok',
    });
  });
});
