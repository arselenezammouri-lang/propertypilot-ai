/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

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
  headers: async () => [
    {
      source: '/:path*',
      headers: [
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
      ],
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
      headers: [
        { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
      ],
    },
  ],
};

export default nextConfig;
