import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  buildContentSecurityPolicyReportOnly,
  shouldEmitCspReportOnly,
} = require(join(__dirname, 'lib/security/content-security-policy.cjs'));

const isDev = process.env.NODE_ENV === 'development';

const cspReportOnlyValue = buildContentSecurityPolicyReportOnly({
  isDev,
  reportUri: process.env.CSP_REPORT_URI,
});

const baseSecurityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  ...(isDev
    ? []
    : [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]),
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
];

if (shouldEmitCspReportOnly()) {
  baseSecurityHeaders.push({
    key: 'Content-Security-Policy-Report-Only',
    value: cspReportOnlyValue,
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['geist'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  swcMinify: true,
  productionBrowserSourceMaps: false,
  experimental: {
    webpackBuildWorker: true,
    cpus: 1,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.replit.dev' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: baseSecurityHeaders,
    },
    {
      source: '/sw.js',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate, max-age=0',
        },
      ],
    },
    {
      source: '/:path((?!_next/static|_next/image|favicon|logo|manifest).*)',
      headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }],
    },
  ],
};

export default nextConfig;
