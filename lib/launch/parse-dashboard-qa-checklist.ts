import fs from 'fs';
import path from 'path';

const ROW_RE = /^\|\s*`(\/dashboard[^`]*)`\s*\|/;

/**
 * Routes listed in the QA checklist table (first column, backtick-wrapped paths).
 */
export function parseDashboardQaChecklistRoutes(
  checklistPath = path.join(process.cwd(), 'docs', 'DASHBOARD_FEATURE_QA_CHECKLIST.md')
): string[] {
  if (!fs.existsSync(checklistPath)) {
    return [];
  }
  const lines = fs.readFileSync(checklistPath, 'utf8').split(/\r?\n/);
  const routes: string[] = [];
  for (const line of lines) {
    const m = line.match(ROW_RE);
    if (m) {
      routes.push(m[1].trim());
    }
  }
  return [...new Set(routes)].sort();
}
