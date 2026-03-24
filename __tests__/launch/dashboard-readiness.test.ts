import fs from 'fs';
import path from 'path';
import {
  DASHBOARD_ROUTES_WITHOUT_CONTEXTUAL_HELP,
  discoverDashboardPageRoutes,
} from '@/lib/launch/discover-dashboard-routes';

describe('launch readiness — dashboard contextual help', () => {
  const appRoot = process.cwd();

  it('discovers every dashboard page route', () => {
    const routes = discoverDashboardPageRoutes(appRoot);
    expect(routes.length).toBeGreaterThanOrEqual(30);
    expect(routes).toContain('/dashboard');
    expect(routes).toContain('/dashboard/map');
    expect(routes).toContain('/dashboard/leads/[id]');
  });

  it('each dashboard page.tsx imports ContextualHelpTrigger or is exempt', () => {
    const dashboardDir = path.join(appRoot, 'app', 'dashboard');

    function walk(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          walk(full);
        } else if (e.isFile() && e.name === 'page.tsx') {
          const rel = path.relative(dashboardDir, path.dirname(full));
          const seg = rel === '' ? '' : rel.split(path.sep).join('/');
          const route = seg === '' ? '/dashboard' : `/dashboard/${seg}`;

          if (DASHBOARD_ROUTES_WITHOUT_CONTEXTUAL_HELP.has(route)) {
            continue;
          }

          const src = fs.readFileSync(full, 'utf8');
          const hasHelp =
            src.includes('ContextualHelpTrigger') || src.includes('contextualHelp');
          if (!hasHelp) {
            throw new Error(
              `Expected ContextualHelpTrigger on ${route} (${path.relative(appRoot, full)})`
            );
          }
        }
      }
    }

    walk(dashboardDir);
  });
});
