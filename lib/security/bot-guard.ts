/**
 * Lightweight bot / scanner heuristics for Edge (no ML).
 * Tuned to reduce noise; disable via env if you need server-to-server calls with odd UAs.
 */

const SCANNER_UA =
  /sqlmap|nikto|nuclei|masscan|zgrab|gobuster|dirbuster|wpscan|openvas|nessus|acunetix|burp\s|burpsuite|havij|w3af|arachni|appscan|qualys|rapid7/i;

export type BotGuardConfig = {
  blockEmptyUserAgent: boolean;
  blockScannerUserAgent: boolean;
};

export function parseBotGuardConfig(env: NodeJS.ProcessEnv): BotGuardConfig {
  const isProd = env.NODE_ENV === 'production';
  return {
    blockEmptyUserAgent: env.EDGE_BLOCK_EMPTY_UA !== 'false' && (isProd || env.EDGE_BLOCK_EMPTY_UA === 'true'),
    blockScannerUserAgent:
      env.EDGE_BLOCK_SCANNER_UA === 'true' || (isProd && env.EDGE_BLOCK_SCANNER_UA !== 'false'),
  };
}

export type BotGuardResult = { allow: true } | { allow: false; reason: 'empty_ua' | 'scanner_ua' };

export function evaluateBotGuard(
  userAgent: string | null,
  config: BotGuardConfig
): BotGuardResult {
  const ua = (userAgent ?? '').trim();

  if (config.blockEmptyUserAgent && ua.length === 0) {
    return { allow: false, reason: 'empty_ua' };
  }

  if (config.blockScannerUserAgent && ua.length > 0 && SCANNER_UA.test(ua)) {
    return { allow: false, reason: 'scanner_ua' };
  }

  return { allow: true };
}
