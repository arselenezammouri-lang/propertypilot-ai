import fs from 'fs';
import path from 'path';

const PAGE_FILE = 'page.tsx';

/** Walks app/dashboard for page.tsx files and returns their public URL paths. */
export function discoverDashboardPageRoutes(appRoot = process.cwd()): string[] {
  const dashboardDir = path.join(appRoot, 'app', 'dashboard');
  if (!fs.existsSync(dashboardDir)) {
    return [];
  }

  const routes: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (e.isFile() && e.name === PAGE_FILE) {
        const rel = path.relative(dashboardDir, path.dirname(full));
        const seg = rel === '' ? '' : rel.split(path.sep).join('/');
        routes.push(seg === '' ? '/dashboard' : `/dashboard/${seg}`);
      }
    }
  }

  walk(dashboardDir);
  return routes.sort();
}

/** Routes where contextual help is not required (dev-only or special). */
export const DASHBOARD_ROUTES_WITHOUT_CONTEXTUAL_HELP = new Set<string>([
  '/dashboard/test-error',
]);
