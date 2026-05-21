/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['geist'],
  typescript: {
    // BUILD LOCK: ogni errore TS blocca il build (qualità Diamond)
    ignoreBuildErrors: false,
  },
  eslint: {
    // BUILD LOCK: lint in build per segnalare errori reali
    ignoreDuringBuilds: false,
  },
  swcMinify: true,
  // Riduce uso memoria in build (evita OOM)
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
  redirects: async () => [
    // Consolidated pages — redirect old duplicates to canonical URLs
    { source: '/dashboard/perfect-copy', destination: '/dashboard/ai-listings', permanent: true },
    { source: '/dashboard/emotional-listing', destination: '/dashboard/ai-listings', permanent: true },
    { source: '/dashboard/titles', destination: '/dashboard/ai-listings', permanent: true },
    { source: '/dashboard/hashtags', destination: '/dashboard/social-posts', permanent: true },
    { source: '/dashboard/scraper', destination: '/dashboard/prospecting', permanent: true },
    { source: '/dashboard/analyze', destination: '/dashboard/prospecting', permanent: true },
    { source: '/dashboard/auditor', destination: '/dashboard/prospecting', permanent: true },
    { source: '/dashboard/agency-branding', destination: '/dashboard/branding', permanent: true },
    { source: '/dashboard/crm/automations', destination: '/dashboard/automations', permanent: true },
    { source: '/dashboard/crm/settings', destination: '/dashboard/settings/workspace', permanent: true },
    { source: '/dashboard/video-scripts', destination: '/dashboard/social-posts', permanent: true },
    { source: '/dashboard/templates', destination: '/dashboard/listings', permanent: true },
  ],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/:path((?!_next/static|_next/image|favicon|logo|manifest).*)',
      headers: [
        { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
      ],
    },
  ],
};

export default nextConfig;
