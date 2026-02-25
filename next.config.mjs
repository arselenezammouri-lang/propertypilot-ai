/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['geist'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
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
      source: '/:path((?!_next/static|_next/image|favicon|logo|manifest).*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, must-revalidate',
        },
      ],
    },
  ],
};

export default nextConfig;
